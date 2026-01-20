const {
  addItemToCart,
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
} = require("../models/cart.model");

/**
 * ADD TO CART
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid productId or quantity" });
    }

    const cartItem = await addItemToCart(req.user.id, productId, quantity);
    res.status(201).json({ message: "Item added", cartItem });

  } catch (e) {
    console.error("ADD CART ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET CART
 */
exports.getCart = async (req, res) => {
  try {
    const items = await getCartItems(req.user.id);
    res.json({ cart: { items } });
  } catch (e) {
    console.error("GET CART ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * UPDATE CART
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const item = await updateCartItemQuantity(
      req.user.id,
      productId,
      quantity
    );

    res.json({ item });
  } catch (e) {
    console.error("UPDATE CART ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * REMOVE ITEM ✅
 */
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const removed = await removeCartItem(req.user.id, id);

    if (!removed) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({ message: "Item removed" });

  } catch (e) {
    console.error("REMOVE ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * CLEAR CART
 */
exports.clearCart = async (req, res) => {
  try {
    await clearCart(req.user.id);
    res.json({ message: "Cart cleared" });
  } catch (e) {
    console.error("CLEAR CART ERROR:", e);
    res.status(500).json({ error: "Server error" });
  }
};
