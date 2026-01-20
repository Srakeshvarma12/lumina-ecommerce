import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { authRequest } from "../../api/api";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    orders: 0,
    products: 0,
    users: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await authRequest("/admin/dashboard");

      console.log("DASHBOARD RESPONSE:", res); // <-- keep once to verify

      setStats({
        totalRevenue: res?.stats?.totalRevenue || 0,
        orders: res?.stats?.orders || 0,
        products: res?.stats?.products || 0,
        users: res?.stats?.users || 0,
      });

      setRecentOrders(res?.recentOrders || []);

    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-10">
            Overview of store performance and activity
          </p>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} />
            <StatCard title="Total Orders" value={stats.orders} />
            <StatCard title="Total Products" value={stats.products} />
            <StatCard title="Total Users" value={stats.users} />
          </div>

          {/* QUICK LINKS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            <QuickCard title="Manage Products" onClick={() => navigate("/admin/products")} />
            <QuickCard title="View Orders" onClick={() => navigate("/admin/orders")} />
            <QuickCard title="Inventory" onClick={() => navigate("/admin/inventory")} />
            <QuickCard title="Add Product" onClick={() => navigate("/admin/products/new")} />
          </div>

          {/* RECENT ORDERS */}
          <div className="bg-white border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <button
                onClick={() => navigate("/admin/orders")}
                className="text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>

            {loading && <p className="text-gray-400">Loading...</p>}

            {!loading && recentOrders.length === 0 && (
              <p className="text-gray-500">No recent orders.</p>
            )}

            <div className="divide-y">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-4 flex justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {order.customer_name}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{order.total_amount}</p>
                    <p className="text-sm text-gray-500">{order.status}</p>
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

/* ---------- UI PARTS ---------- */

const StatCard = ({ title, value }) => (
  <div className="bg-white border rounded-2xl p-6">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const QuickCard = ({ title, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white border rounded-2xl p-6 text-left hover:shadow-lg transition"
  >
    <p className="font-semibold text-lg">{title}</p>
    <p className="text-sm text-gray-500 mt-1">Open →</p>
  </button>
);

export default AdminDashboard;
