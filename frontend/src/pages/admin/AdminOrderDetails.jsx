import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refundLoading, setRefundLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/admin/orders/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrder(data.order);
      setItems(data.items);
      setAddress(data.address);
    } catch {
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  /* ---------------- REFUND ---------------- */

  const handleRefund = async () => {
    if (!window.confirm("Are you sure you want to refund this order?")) return;

    try {
      setRefundLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/refunds/${order.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert("✅ Order refunded successfully");
      fetchOrder();
    } catch (err) {
      alert(err.message || "Refund failed");
    } finally {
      setRefundLoading(false);
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10 text-red-600">{error}</p>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-10 py-10">

        <button
          onClick={() => navigate("/admin/orders")}
          className="text-blue-600 mb-6"
        >
          ← Back to orders
        </button>

        <h1 className="text-3xl font-bold mb-2">Order #{order.id}</h1>
        <p className="text-gray-600 mb-6">
          {order.name} • {order.email}
        </p>

        {/* ORDER SUMMARY */}
        <div className="bg-white shadow rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <p className="font-semibold">{order.status}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Total Amount</p>
            <p className="font-semibold">₹{order.total_amount}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Payment ID</p>
            <p className="font-semibold">{order.payment_id || "—"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Date</p>
            <p className="font-semibold">
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* ✅ SHIPPING ADDRESS */}
        {address && (
          <div className="bg-white shadow rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">📦 Shipping Address</h2>

            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{address.full_name}</p>
              <p>📞 {address.phone}</p>
              <p>{address.address_line}</p>
              <p>{address.city}, {address.state}</p>
              <p>{address.pincode}, {address.country}</p>
            </div>
          </div>
        )}

        {/* REFUND */}
        {order.status === "PAID" && (
          <div className="mb-8">
            <button
              onClick={handleRefund}
              disabled={refundLoading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-60"
            >
              {refundLoading ? "Processing refund..." : "Refund Order"}
            </button>
          </div>
        )}

        {order.status === "REFUNDED" && (
          <p className="mb-8 text-green-600 font-medium">
            ✅ This order has been refunded
          </p>
        )}

        {/* ITEMS */}
        <div className="bg-white shadow rounded-xl overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">₹{item.price}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
};

export default AdminOrderDetails;
