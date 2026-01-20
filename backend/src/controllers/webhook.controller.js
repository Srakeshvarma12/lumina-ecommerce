const crypto = require("crypto");
const pool = require("../config/db");

const razorpayWebhookController = async (req, res) => {
  const client = await pool.connect();

  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      return res.status(400).json({ error: "Missing signature" });
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (expected !== signature) {
      console.log("❌ Invalid webhook signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = JSON.parse(req.body.toString());
    console.log("✅ Webhook:", event.event);

    if (event.event !== "payment.captured") {
      return res.status(200).json({ status: "ignored" });
    }

    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;

    await client.query("BEGIN");

    // 🔒 lock order row
    const orderRes = await client.query(
      `SELECT id, status FROM orders 
       WHERE razorpay_order_id=$1 FOR UPDATE`,
      [razorpayOrderId]
    );

    if (orderRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(200).json({ status: "order_not_found" });
    }

    const order = orderRes.rows[0];

    if (order.status === "PAID") {
      await client.query("ROLLBACK");
      return res.status(200).json({ status: "already_paid" });
    }

    // 💾 save payment if not exists
    await client.query(
      `INSERT INTO payments (order_id, razorpay_order_id, razorpay_payment_id, status)
       VALUES ($1,$2,$3,'success')
       ON CONFLICT (razorpay_payment_id) DO NOTHING`,
      [order.id, razorpayOrderId, razorpayPaymentId]
    );

    // ✅ mark order paid
    await client.query(
      `UPDATE orders SET status='PAID', payment_id=$2 WHERE id=$1`,
      [order.id, razorpayPaymentId]
    );

    // 📦 get order items
    const itemsRes = await client.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id=$1`,
      [order.id]
    );

    // 📉 reduce stock ONCE
    for (const item of itemsRes.rows) {
      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id=$2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");

    console.log("✅ ORDER PAID, STOCK UPDATED");
    res.status(200).json({ status: "ok" });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("🔥 Webhook error:", err);
    res.status(500).json({ error: "Webhook failed" });
  } finally {
    client.release();
  }
};

module.exports = { razorpayWebhookController };
