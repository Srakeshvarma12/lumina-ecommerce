require("dotenv").config();
const express = require("express");
const cors = require("cors");

const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.route");
const paymentRoutes = require("./routes/payment.route");
const webhookRoutes = require("./routes/webhook.route");
const refundRoutes = require("./routes/refund.route");
const testRoutes = require("./routes/test.route"); // ✅ MAIL TEST ROUTE
const wishlistRoutes = require("./routes/wishlist.route");
const app = express();

/* =========================
   🔔 WEBHOOK (RAW BODY)
========================= */
app.use("/api/webhooks", webhookRoutes);

/* =========================
   🌐 MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json()); // must be AFTER webhook route

/* =========================
   🧪 TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("API running...");
});

/* =========================
   🚦 ROUTES
========================= */
app.use("/api/test", testRoutes);        // ✅ MAIL TEST
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/refunds", refundRoutes);
app.use("/api/wishlist", wishlistRoutes);

/* =========================
   🚀 SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});

