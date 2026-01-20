const nodemailer = require("nodemailer");

/* =========================
   TRANSPORTER
========================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   BASE SENDER
========================= */

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Lumina Store" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Mail sent to:", to);
  } catch (error) {
    console.error("❌ Mail sending failed:", error.message);
  }
};

/* =========================
   ORDER PLACED MAIL
========================= */

exports.sendOrderPlacedMail = async (user, order) => {
  await sendMail({
    to: user.email,
    subject: "🎉 Order Placed Successfully - Lumina",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Hi ${user.name},</h2>
        <p>Your order <b>#${order.id}</b> has been placed successfully.</p>

        <p><b>Total:</b> ₹${order.total_amount}</p>
        <p><b>Status:</b> ${order.status}</p>

        <hr/>
        <p>We’ll notify you once payment is completed.</p>

        <br/>
        <b>– Lumina Store</b>
      </div>
    `,
  });
};

/* =========================
   PAYMENT SUCCESS MAIL
========================= */

exports.sendPaymentSuccessMail = async (user, order) => {
  await sendMail({
    to: user.email,
    subject: "✅ Payment Successful - Lumina",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Payment Received</h2>

        <p>Hi ${user.name},</p>
        <p>Your payment for order <b>#${order.id}</b> was successful.</p>

        <p><b>Amount Paid:</b> ₹${order.total_amount}</p>
        <p><b>Payment ID:</b> ${order.payment_id}</p>

        <hr/>
        <p>Your order is now being processed.</p>

        <br/>
        <b>– Lumina Store</b>
      </div>
    `,
  });
};

/* =========================
   REFUND MAIL
========================= */

exports.sendRefundMail = async (user, order) => {
  await sendMail({
    to: user.email,
    subject: "🔁 Refund Processed - Lumina",
    html: `
      <div style="font-family:Arial;padding:20px">
        <h2>Refund Successful</h2>

        <p>Hi ${user.name},</p>
        <p>Your order <b>#${order.id}</b> has been refunded.</p>

        <p><b>Refund Amount:</b> ₹${order.total_amount}</p>

        <hr/>
        <p>The amount will reflect in 3–5 business days.</p>

        <br/>
        <b>– Lumina Store</b>
      </div>
    `,
  });
};
