import { useEffect, useState } from "react";
import { authRequest } from "../api/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await authRequest("/orders/admin");
      setOrders(res.orders);
    } catch {
      setMsg("❌ Failed to load admin orders");
    } finally {
      setLoading(false);
    }
  };

  const refundOrder = async (orderId) => {
    if (!window.confirm("Refund this order?")) return;

    try {
      await authRequest("/refunds/refund", {
        method: "POST",
        body: JSON.stringify({ orderId }),
      });

      setMsg("✅ Refund successful");
      fetchOrders();
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  if (loading) return <h3>Loading orders...</h3>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>📦 Admin Orders</h2>
      <p>{msg}</p>

      {orders.map((o) => (
        <div
          key={o.order_id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "20px",
            padding: "15px",
          }}
        >
          <strong>Order #{o.order_id}</strong>
          <p>User: {o.user_id}</p>
          <p>Status: {o.status}</p>
          <p>Total: ₹ {o.total_amount}</p>

          <ul>
            {o.items.map((i, idx) => (
              <li key={idx}>
                {i.name} — ₹{i.price} × {i.quantity}
              </li>
            ))}
          </ul>

          {o.status === "PAID" && (
            <button onClick={() => refundOrder(o.order_id)}>
              Refund
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
