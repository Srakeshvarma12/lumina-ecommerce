const pool = require("../config/db");
const { sendOrderPlacedMail } = require("../services/mail.service");

/* ======================================================
   PLACE ORDER FROM CART (WITH SHIPPING ADDRESS)
====================================================== */
const placeOrderFromCart = async (req, res) => {
  const userId = req.user.id;
  const { full_name, phone, address_line, city, state, pincode, country } = req.body;

  if (!full_name || !phone || !address_line || !city || !state || !pincode) {
    return res.status(400).json({ error: "Complete shipping address required" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cart = await client.query(
      `SELECT c.product_id, c.quantity, p.price
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1
       FOR UPDATE`,
      [userId]
    );

    if (cart.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Cart is empty" });
    }

    let total = 0;
    for (const item of cart.rows) {
      total += Number(item.price) * item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, status)
       VALUES ($1, $2, 'PLACED')
       RETURNING id, total_amount, status, created_at`,
      [userId, total]
    );

    const order = orderResult.rows[0];

    for (const item of cart.rows) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    await client.query(
      `INSERT INTO order_addresses
       (order_id, full_name, phone, address_line, city, state, pincode, country)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [order.id, full_name, phone, address_line, city, state, pincode, country || "India"]
    );

    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [userId]);

    await client.query("COMMIT");

    sendOrderPlacedMail(req.user, order).catch(err =>
      console.error("📧 Order mail failed:", err.message)
    );

    res.status(201).json({
      success: true,
      orderId: order.id,
      totalAmount: total,
      message: "Order placed successfully"
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("ORDER ERROR:", err);
    res.status(500).json({ error: "Order creation failed" });
  } finally {
    client.release();
  }
};


/* ======================================================
   GET ALL ORDERS OF LOGGED IN USER (MY ORDERS)
====================================================== */
const getMyOrders = async (req, res) => {
  try {
    const ordersRes = await pool.query(
      `SELECT id, total_amount, status, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ orders: ordersRes.rows });

  } catch (err) {
    console.error("GET MY ORDERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};


/* ======================================================
   GET FULL ORDER DETAILS (WITH PRODUCT IMAGES ✅)
====================================================== */
const getOrderDetails = async (req, res) => {
  const userId = req.user.id;
  const orderId = parseInt(req.params.id);

  try {
    const orderRes = await pool.query(
      `SELECT id, total_amount, status, created_at, payment_id
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const itemsRes = await pool.query(
      `SELECT 
          p.id,
          p.name,
          p.image_url,
          oi.quantity,
          oi.price
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    const addressRes = await pool.query(
      `SELECT full_name, phone, address_line, city, state, pincode, country
       FROM order_addresses
       WHERE order_id = $1`,
      [orderId]
    );

    res.json({
      order: orderRes.rows[0],
      items: itemsRes.rows,
      address: addressRes.rows[0] || null
    });

  } catch (err) {
    console.error("GET ORDER DETAILS ERROR:", err);
    res.status(500).json({ error: "Failed to load order details" });
  }
};


module.exports = {
  placeOrderFromCart,
  getMyOrders,
  getOrderDetails
};
