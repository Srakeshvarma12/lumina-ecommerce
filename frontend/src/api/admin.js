import { authRequest } from "./api";

/* 📊 Dashboard stats */
export const fetchDashboardStats = () => {
  return authRequest("/admin/dashboard");
};

/* 📦 All orders */
export const fetchAllOrders = () => {
  return authRequest("/admin/orders");
};

/* ⚠️ Low stock products */
export const fetchLowStockProducts = () => {
  return authRequest("/admin/low-stock");
};

/* 💸 Refund order */
export const refundOrder = (orderId) => {
  return authRequest("/refunds/refund", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
};
