import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { authRequest } from "../../api/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const res = await authRequest("/admin/dashboard");
    setStats(res.stats || {});
    setRecentOrders(res.recentOrders || []);
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          <h1 className="text-3xl sm:text-4xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-gray-500 mb-8">Store overview</p>

          {/* STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Stat title="Revenue" value={`₹${stats.totalRevenue || 0}`} />
            <Stat title="Orders" value={stats.orders || 0} />
            <Stat title="Products" value={stats.products || 0} />
            <Stat title="Users" value={stats.users || 0} />
          </div>

          {/* QUICK LINKS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <Quick title="Products" onClick={() => navigate("/admin/products")} />
            <Quick title="Orders" onClick={() => navigate("/admin/orders")} />
            <Quick title="Inventory" onClick={() => navigate("/admin/inventory")} />
            <Quick title="Add Product" onClick={() => navigate("/admin/products/new")} />
          </div>

          {/* RECENT */}
          <div className="bg-white border rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Recent Orders</h2>

            <div className="space-y-3">
              {recentOrders.map(order => (
                <div
                  key={order.id}
                  className="flex justify-between border-b pb-3 last:border-none"
                >
                  <div>
                    <p className="font-medium">#{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{order.total_amount}</p>
                    <p className="text-xs text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

const Stat = ({ title, value }) => (
  <div className="bg-white border rounded-xl p-4">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Quick = ({ title, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white border rounded-xl p-4 text-left hover:shadow transition"
  >
    <p className="font-semibold">{title}</p>
    <p className="text-xs text-gray-500">Open →</p>
  </button>
);

export default AdminDashboard;
