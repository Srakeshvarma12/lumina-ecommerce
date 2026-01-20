const Razorpay = require("razorpay");
const pool = require("../config/db");
const { sendRefundMail } = require("../services/mail.service");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const refundOrderController = async (req, res) => {
  const client = await pool.connect();

  try {
    const { orderId } = req.params;
    await client.query("BEGIN");

    const orderRes = await client.query(
      `SELECT o.id, o.status, o.payment_id, o.total_amount, u.name, u.email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       WHERE o.id=$1 FOR UPDATE`,
      [orderId]
    );

    const order = orderRes.rows[0];

    const refund = await razorpay.payments.refund(order.payment_id, {
      amount: Math.round(Number(order.total_amount) * 100),
    });

    await client.query(
      `UPDATE orders SET status='REFUNDED' WHERE id=$1`,
      [order.id]
    );

    await client.query("COMMIT");

    // ✅ SEND MAIL (NON BLOCKING)
    sendRefundMail(order, {
      id: order.id,
      total_amount: order.total_amount,
      refund_id: refund.id
    }).catch(err => {
      console.error("📧 Refund mail failed:", err.message);
    });

    res.json({ success: true, refundId: refund.id });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("🔥 REFUND ERROR:", err);
    res.status(500).json({ error: "Refund failed" });
  } finally {
    client.release();
  }
};

module.exports = { refundOrderController };
