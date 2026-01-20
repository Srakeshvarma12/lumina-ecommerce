exports.refundTemplate = (name, orderId, amount) => {
  return `
  <div style="font-family:Arial;padding:20px">
    <h2>Refund Processed 🔁</h2>

    <p>Hi ${name},</p>

    <p>Your refund has been successfully processed.</p>

    <p><b>Order ID:</b> #${orderId}</p>
    <p><b>Refund Amount:</b> ₹${amount}</p>

    <p>The amount will reflect in your bank shortly.</p>

    <br/>
    <p>— Lumina Store</p>
  </div>
  `;
};
