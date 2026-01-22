import { adminRequest } from "./api";

/* 📊 Dashboard stats */
export const fetchDashboardStats = () => {
  return adminRequest("/dashboard");
};

/* 📦 All orders */
export const fetchAllOrders = () => {
  return adminRequest("/orders");
};

/* 🕒 Recent orders */
export const fetchRecentOrders = () => {
  return adminRequest("/orders/recent");
};

/* 📄 Single order details */
export const fetchOrderDetails = (orderId) => {
  return adminRequest(`/orders/${orderId}`);
};

/* 📦 Inventory */
export const fetchInventory = () => {
  return adminRequest("/inventory");
};

/* ⚠️ Low stock products */
export const fetchLowStockProducts = () => {
  return adminRequest("/low-stock");
};

/* ➕ Create product */
export const adminCreateProduct = (productData) => {
  return adminRequest("/products", {
    method: "POST",
    body: productData,
  });
};

/* 💸 Refund order */
export const refundOrder = (orderId) => {
  return adminRequest("/refunds/refund", {
    method: "POST",
    body: { orderId },
  });
};
