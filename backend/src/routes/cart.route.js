const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require("../controllers/cart.controller");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/", protect, updateCartItem);
router.delete("/:id", protect, removeFromCart);
router.delete("/", protect, clearCart);

module.exports = router;
