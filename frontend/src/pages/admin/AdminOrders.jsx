import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { fetchAllOrders } from "../../api/admin";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchAllOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("ADMIN ORDERS ERROR:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-10 py-10">
        <h1 className="text-3xl font-bold mb-2">Admin Orders</h1>
        <p className="text-gray-600 mb-6">All customer orders</p>

        <button
          onClick={() => navigate("/admin")}
          className="text-blue-600 hover:underline mb-4"
        >
          ← Back to Admin Dashboard
        </button>

        {loading && <p>Loading orders...</p>}

        {error && (
          <p className="text-red-600 mt-4">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="bg-white shadow rounded-xl overflow-x-auto mt-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-semibold text-blue-600 hover:underline">
                      <Link to={`/admin/orders/${order.id}`}>#{order.id}</Link>
                    </td>
                    <td className="p-4">{order.name}</td>
                    <td className="p-4">{order.email}</td>
                    <td className="p-4">₹{order.total_amount}</td>
                    <td className="p-4 font-medium">{order.status}</td>
                    <td className="p-4">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
