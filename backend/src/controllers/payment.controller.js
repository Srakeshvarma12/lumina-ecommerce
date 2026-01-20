const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");
const { sendPaymentSuccessMail } = require("../services/mail.service");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.getKey = async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
};

exports.createOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `order_${orderId}`,
    });

    await pool.query(
      `UPDATE orders SET razorpay_order_id = $1 WHERE id = $2`,
      [razorpayOrder.id, orderId]
    );

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });

  } catch (err) {
    console.error("RAZORPAY ERROR:", err);
    res.status(500).json({ error: "Razorpay order failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  const client = await pool.connect();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    await client.query("BEGIN");

    const orderRes = await client.query(
      `SELECT o.id, o.status, o.total_amount, u.name, u.email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       WHERE o.razorpay_order_id = $1
       FOR UPDATE`,
      [razorpay_order_id]
    );

    const order = orderRes.rows[0];

    await client.query(
      `UPDATE orders SET payment_id=$1, status='PAID' WHERE id=$2`,
      [razorpay_payment_id, order.id]
    );

    await client.query("COMMIT");

    // ✅ SEND MAIL (NON BLOCKING)
    sendPaymentSuccessMail(order, {
      id: order.id,
      total_amount: order.total_amount,
      payment_id: razorpay_payment_id
    }).catch(err => {
      console.error("📧 Payment mail failed:", err.message);
    });

    res.json({ success: true });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ error: "Verification failed" });
  } finally {
    client.release();
  }
};
