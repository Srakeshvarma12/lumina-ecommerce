import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authRequest } from "../api/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await authRequest("/orders/history");
      setOrders(data || []);   // ✅ your API returns array directly
    } catch (err) {
      console.error("Orders load error:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">

          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 mb-6 hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-500 mb-10">
            Track your purchases and delivery details
          </p>

          {loading && <p>Loading...</p>}

          {!loading && orders.length === 0 && (
            <p className="text-gray-500">You have not placed any orders yet.</p>
          )}

          <div className="space-y-5">
            {orders.map(order => (
              <div
                key={order.id}
                className="border rounded-xl p-5 flex justify-between items-center hover:shadow-sm transition"
              >
                <div>
                  <h2 className="font-semibold text-lg">
                    Order #{order.id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-semibold
                      ${order.status === "PAID" ? "bg-green-100 text-green-700" :
                        order.status === "PLACED" ? "bg-yellow-100 text-yellow-700" :
                        order.status === "REFUNDED" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"}
                    `}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">₹{order.total_amount}</p>

                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="text-indigo-600 text-sm mt-2 hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Orders;
