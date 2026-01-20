const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay Order
 * amountInPaise MUST already be converted (rupees × 100)
 */
const createRazorpayOrder = async (amountInPaise) => {
  const options = {
    amount: amountInPaise,
    currency: "INR",
  };

  return await razorpay.orders.create(options);
};

/**
 * Create Razorpay Refund
 * @param {string} paymentId - Razorpay payment ID
 * @param {number|null} amountInPaise - optional (full refund if null)
 */
const createRazorpayRefund = async (paymentId, amountInPaise = null) => {
  const options = {};

  // Partial refund support (optional)
  if (amountInPaise) {
    options.amount = amountInPaise;
  }

  return await razorpay.payments.refund(paymentId, options);
};

module.exports = {
  createRazorpayOrder,
  createRazorpayRefund,
};
