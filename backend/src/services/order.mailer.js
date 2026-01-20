const { sendMail } = require("./mail.service");
const { orderPlacedTemplate } = require("../templates/orderPlaced.template");
const { paymentSuccessTemplate } = require("../templates/paymentSuccess.template");
const { refundTemplate } = require("../templates/refund.template");

exports.sendOrderPlacedMail = async (email, name, orderId, amount) => {
  await sendMail({
    to: email,
    subject: "🛒 Order Placed - Lumina",
    html: orderPlacedTemplate(name, orderId, amount),
  });
};

exports.sendPaymentSuccessMail = async (email, name, orderId, amount) => {
  await sendMail({
    to: email,
    subject: "✅ Payment Successful - Lumina",
    html: paymentSuccessTemplate(name, orderId, amount),
  });
};

exports.sendRefundMail = async (email, name, orderId, amount) => {
  await sendMail({
    to: email,
    subject: "🔁 Refund Successful - Lumina",
    html: refundTemplate(name, orderId, amount),
  });
};
