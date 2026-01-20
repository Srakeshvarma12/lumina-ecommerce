const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const { refundOrderController } = require("../controllers/refund.controller");

router.post("/:orderId", protect, adminOnly, refundOrderController);

module.exports = router;
