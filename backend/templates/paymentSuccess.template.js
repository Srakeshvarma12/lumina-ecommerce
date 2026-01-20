exports.paymentSuccessTemplate = (name, orderId, amount) => {
  return `
  <div style="font-family:Arial;padding:20px">
    <h2>Payment Successful ✅</h2>

    <p>Hi ${name},</p>

    <p>Your payment has been confirmed.</p>

    <p><b>Order ID:</b> #${orderId}</p>
    <p><b>Amount Paid:</b> ₹${amount}</p>

    <p>Your order will be shipped soon 🚚</p>

    <br/>
    <p>Thanks for shopping with Lumina.</p>
  </div>
  `;
};
