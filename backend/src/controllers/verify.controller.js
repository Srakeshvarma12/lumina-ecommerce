const crypto = require("crypto");
const { getCartItems, clearCart } = require("../models/cart.model");
const { createOrder, createOrderItems } = require("../models/order.model");
const { reduceProductStock } = require("../models/product.model");

const verifyPaymentController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Get cart items
    const cartItems = await getCartItems(userId);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // Create order
    const order = await createOrder(userId, totalAmount);

    // Create order items
    await createOrderItems(order.id, cartItems);

    // Reduce stock
    for (const item of cartItems) {
      await reduceProductStock(item.product_id, item.quantity);
    }

    // Clear cart
    await clearCart(userId);

    return res.status(201).json({
      message: "Payment verified & order placed successfully",
      orderId: order.id,
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

module.exports = {
  verifyPaymentController,
};
