exports.verifyPayment = async (req, res) => {
  const client = await pool.connect();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    /* ================= VERIFY SIGNATURE ================= */

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    await client.query("BEGIN");

    /* ================= GET ORDER ================= */

    const orderRes = await client.query(
      `SELECT o.id, o.user_id, o.total_amount, o.status, u.name, u.email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       WHERE o.razorpay_order_id = $1
       FOR UPDATE`,
      [razorpay_order_id]
    );

    if (orderRes.rows.length === 0) {
      throw new Error("Order not found");
    }

    const order = orderRes.rows[0];

    if (order.status === "PAID") {
      await client.query("ROLLBACK");
      return res.json({ success: true, message: "Already processed" });
    }

    /* ================= MARK ORDER PAID ================= */

    await client.query(
      `UPDATE orders 
       SET payment_id=$1, status='PAID' 
       WHERE id=$2`,
      [razorpay_payment_id, order.id]
    );

    /* ================= GET ORDER ITEMS ================= */

    const itemsRes = await client.query(
      `SELECT product_id, quantity 
       FROM order_items 
       WHERE order_id = $1`,
      [order.id]
    );

    /* ================= UPDATE STOCK ================= */

    for (const item of itemsRes.rows) {
      const result = await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2 AND stock >= $1
         RETURNING id`,
        [item.quantity, item.product_id]
      );

      if (result.rowCount === 0) {
        throw new Error("Insufficient stock for product " + item.product_id);
      }
    }

    /* ================= CLEAR CART ================= */

    await client.query(
      `DELETE FROM cart_items WHERE user_id = $1`,
      [order.user_id]
    );

    await client.query("COMMIT");

    /* ================= EMAIL (NON BLOCKING) ================= */

    sendPaymentSuccessMail(order, {
      id: order.id,
      total_amount: order.total_amount,
      payment_id: razorpay_payment_id
    }).catch(err => {
      console.error("📧 Payment mail failed:", err.message);
    });

    res.json({ success: true, message: "Payment verified & stock updated" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ error: "Verification failed" });
  } finally {
    client.release();
  }
};
