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
    const data = await authRequest("/orders/history");
    setOrders(data || []);
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

          <button onClick={() => navigate(-1)} className="text-blue-600 mb-6">
            ← Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold mb-1">My Orders</h1>
          <p className="text-gray-500 mb-8">Track purchases and delivery</p>

          {loading && <p>Loading...</p>}

          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-gray-100">
                    {order.status}
                  </span>
                </div>

                <div className="sm:text-right">
                  <p className="font-bold text-lg">₹{order.total_amount}</p>
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="text-indigo-600 text-sm mt-1"
                  >
                    View details →
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
