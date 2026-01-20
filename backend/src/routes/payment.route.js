const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const {
  createOrder,
  getKey,
  verifyPayment
} = require("../controllers/payment.controller");

router.get("/key", protect, getKey);
router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment); // ✅ REQUIRED

module.exports = router;
