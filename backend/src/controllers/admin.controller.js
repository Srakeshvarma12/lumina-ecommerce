const pool = require("../config/db");

/* ======================================================
   📊 ADMIN DASHBOARD (STATS + RECENT ORDERS)
====================================================== */
const getDashboardStatsController = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      paidOrders,
      refundedOrders,
      totalRevenue,
      todaySales,
      recentOrders
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM users`),

      pool.query(`SELECT COUNT(*) FROM orders`),

      pool.query(`SELECT COUNT(*) FROM products`),

      pool.query(`SELECT COUNT(*) FROM orders WHERE status = 'PAID'`),

      pool.query(`SELECT COUNT(*) FROM orders WHERE status = 'REFUNDED'`),

      pool.query(`
        SELECT COALESCE(SUM(total_amount), 0) AS revenue
        FROM orders
        WHERE status = 'PAID'
      `),

      pool.query(`
        SELECT COALESCE(SUM(total_amount), 0) AS today
        FROM orders
        WHERE status = 'PAID'
        AND DATE(created_at) = CURRENT_DATE
      `),

      pool.query(`
        SELECT 
          o.id,
          o.total_amount,
          o.status,
          o.created_at,
          u.name AS customer_name,
          u.email
        FROM orders o
        JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC
        LIMIT 5
      `)
    ]);

    res.status(200).json({
      stats: {
        users: Number(totalUsers.rows[0].count),
        orders: Number(totalOrders.rows[0].count),
        products: Number(totalProducts.rows[0].count),
        paidOrders: Number(paidOrders.rows[0].count),
        refundedOrders: Number(refundedOrders.rows[0].count),
        totalRevenue: Number(totalRevenue.rows[0].revenue),
        todaySales: Number(todaySales.rows[0].today),
      },
      recentOrders: recentOrders.rows
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
};


/* ======================================================
   🕒 RECENT ORDERS (ADMIN PAGE)
====================================================== */
const getRecentOrdersController = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id, 
        u.name, 
        u.email,
        o.total_amount, 
        o.status, 
        o.created_at
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    res.status(200).json({ orders: result.rows });
  } catch (error) {
    console.error("Recent orders error:", error);
    res.status(500).json({ error: "Failed to fetch recent orders" });
  }
};


/* ======================================================
   ⚠️ LOW STOCK PRODUCTS
====================================================== */
const getLowStockProductsController = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, stock
      FROM products
      WHERE stock <= 5
      ORDER BY stock ASC
    `);

    res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error("Low stock error:", error);
    res.status(500).json({ error: "Failed to fetch low stock products" });
  }
};


/* ======================================================
   📦 ALL ORDERS (ADMIN)
====================================================== */
const adminGetAllOrdersController = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id, 
        u.name, 
        u.email, 
        o.total_amount, 
        o.status, 
        o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);

    res.status(200).json({ orders: result.rows });
  } catch (error) {
    console.error("Admin get all orders error:", error);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
};


/* ======================================================
   📄 SINGLE ORDER FULL DETAILS (ADMIN)
====================================================== */
const adminGetOrderDetailsController = async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderRes = await pool.query(
      `SELECT o.*, u.name, u.email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       WHERE o.id = $1`,
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const itemsRes = await pool.query(
      `SELECT 
          p.id,
          p.name,
          p.image_url,
          oi.price,
          oi.quantity
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    const addressRes = await pool.query(
      `SELECT 
          full_name,
          phone,
          address_line,
          city,
          state,
          pincode,
          country
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
    console.error("ADMIN ORDER DETAILS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};


/* ======================================================
   📦 INVENTORY
====================================================== */
const getInventoryController = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, price, stock, created_at
      FROM products
      ORDER BY stock ASC
    `);

    res.status(200).json({ products: result.rows });
  } catch (err) {
    console.error("Inventory error:", err);
    res.status(500).json({ error: "Failed to load inventory" });
  }
};

/* ======================================================
   ➕ CREATE PRODUCT (ADMIN)
====================================================== */
const adminCreateProductController = async (req, res) => {
  try {
    const { name, price, stock, category, image_url, description } = req.body;

    // Basic validation
    if (!name || !price || !stock || !category) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const result = await pool.query(
      `INSERT INTO products 
       (name, price, stock, category, image_url, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        price,
        stock,
        category,
        image_url || null,
        description || null
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      product: result.rows[0]
    });

  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

module.exports = {
  getDashboardStatsController,
  getRecentOrdersController,
  getLowStockProductsController,
  adminGetAllOrdersController,
  adminGetOrderDetailsController,
  getInventoryController,
  adminCreateProductController
};
