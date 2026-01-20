const express = require("express");
const { razorpayWebhookController } = require("../controllers/webhook.controller");
const router = express.Router();

// ⚠️ RAW BODY REQUIRED
router.post(
  "/razorpay",
  express.raw({ type: "application/json" }),
  razorpayWebhookController
);

module.exports = router;
