const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const refundRazorpayPayment = async (paymentId, amountInPaise = null) => {
  const options = amountInPaise ? { amount: amountInPaise } : {};
  return await razorpay.payments.refund(paymentId, options);
};

module.exports = {
  refundRazorpayPayment,
};
