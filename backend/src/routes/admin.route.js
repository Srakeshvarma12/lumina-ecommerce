const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/auth.middleware");

const {
  getDashboardStatsController,
  getRecentOrdersController,
  getLowStockProductsController,
  adminGetAllOrdersController,
  adminGetOrderDetailsController,
  getInventoryController,
  adminCreateProductController
} = require("../controllers/admin.controller");

/* DASHBOARD */
router.get("/dashboard", protect, adminOnly, getDashboardStatsController);

/* ORDERS */
router.get("/orders", protect, adminOnly, adminGetAllOrdersController);
router.get("/orders/recent", protect, adminOnly, getRecentOrdersController);
router.get("/orders/:orderId", protect, adminOnly, adminGetOrderDetailsController);

/* INVENTORY */
router.get("/inventory", protect, adminOnly, getInventoryController);
router.get("/low-stock", protect, adminOnly, getLowStockProductsController);

/* PRODUCTS */
router.post("/products", protect, adminOnly, adminCreateProductController);

module.exports = router;
