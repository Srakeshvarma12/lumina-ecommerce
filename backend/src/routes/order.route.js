const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const pool = require("../config/db");

const { 
  placeOrderFromCart,
  getOrderDetails 
} = require("../controllers/order.controller");

/* =========================
   CREATE ORDER
========================= */
router.post("/", protect, placeOrderFromCart);

/* =========================
   USER ORDER HISTORY ✅
========================= */
router.get("/history", protect, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, total_amount, status, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Order history error:", error);
    res.status(500).json({ error: "Failed to load order details" });
  }
});

/* =========================
   SINGLE ORDER DETAILS
========================= */
router.get("/:id", protect, getOrderDetails);

module.exports = router;
