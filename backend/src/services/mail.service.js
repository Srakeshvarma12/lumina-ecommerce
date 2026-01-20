const nodemailer = require("nodemailer");

/* =========================
   CREATE TRANSPORT
========================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* =========================
   COMMON MAIL SENDER
========================= */

const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"Lumina Store" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};

/* =========================
   1. ORDER PLACED MAIL
========================= */

exports.sendOrderPlacedMail = async (user, order) => {
  await sendMail({
    to: user.email,
    subject: "Your order has been placed 🎉",
    html: `
      <h2>Hi ${user.name},</h2>
      <p>Your order <b>#${order.id}</b> has been placed successfully.</p>
      <p><b>Total:</b> ₹${order.total_amount}</p>
      <p>Status: ${order.status}</p>
      <br/>
      <p>We will notify you once payment is completed.</p>
      <br/>
      <p>– Lumina Store</p>
    `
  });
};

/* =========================
   2. PAYMENT SUCCESS MAIL
========================= */

exports.sendPaymentSuccessMail = async (user, order) => {
  await sendMail({
    to: user.email,
    subject: "Payment successful ✅",
    html: `
      <h2>Payment received</h2>
      <p>Hi ${user.name},</p>
      <p>Your payment for order <b>#${order.id}</b> was successful.</p>
      <p><b>Amount paid:</b> ₹${order.total_amount}</p>
      <p><b>Payment ID:</b> ${order.payment_id}</p>
      <br/>
      <p>Your order will be processed soon.</p>
      <br/>
      <p>– Lumina Store</p>
    `
  });
};

/* =========================
   3. REFUND MAIL
========================= */

exports.sendRefundMail = async (user, order) => {
  await sendMail({
    to: user.email,
    subject: "Your refund has been processed 🔁",
    html: `
      <h2>Refund successful</h2>
      <p>Hi ${user.name},</p>
      <p>Your order <b>#${order.id}</b> has been refunded.</p>
      <p><b>Refund amount:</b> ₹${order.total_amount}</p>
      <br/>
      <p>Amount will reflect in 3–5 business days.</p>
      <br/>
      <p>– Lumina Store</p>
    `
  });
};
