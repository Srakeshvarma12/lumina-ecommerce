exports.orderPlacedTemplate = (name, orderId, amount) => {
  return `
  <div style="font-family:Arial;padding:20px">
    <h2>Hi ${name}, 👋</h2>
    <p>Your order has been placed successfully.</p>

    <p><b>Order ID:</b> #${orderId}</p>
    <p><b>Total:</b> ₹${amount}</p>

    <p>We’ll notify you once payment is confirmed.</p>

    <br/>
    <p>— Lumina Store</p>
  </div>
  `;
};
