import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authRequest } from "../api/api";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await authRequest("/orders/history");
            setOrders(data || []);
        } catch (err) {
            console.error("Load orders error:", err);
            alert("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="bg-white min-h-screen">
                <div className="max-w-6xl mx-auto px-6 py-12">

                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-10">
                        <h1 className="text-4xl font-bold">📦 My Orders</h1>

                        {/* ✅ HARD ROUTE + STOP PROPAGATION */}
                        <button
                            onClick={() => navigate("/products", { replace: true })}
                            className="text-blue-600 hover:underline"
                        >
                            ← Back to products
                        </button>

                    </div>

                    {loading && <p>Loading your orders...</p>}

                    {!loading && orders.length === 0 && (
                        <p className="text-gray-500">You have not placed any orders yet.</p>
                    )}

                    {/* ORDERS */}
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className="border rounded-xl p-6 hover:shadow-md transition cursor-pointer"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                    <div>
                                        <p className="font-semibold text-lg">
                                            Order #{order.id}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Placed on {new Date(order.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-6 text-sm">

                                        <div>
                                            <p className="text-gray-500">Total</p>
                                            <p className="font-semibold">₹{order.total_amount}</p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">Status</p>
                                            <span
                                                className={`font-semibold ${order.status === "PAID"
                                                        ? "text-green-600"
                                                        : order.status === "REFUNDED"
                                                            ? "text-red-600"
                                                            : "text-yellow-600"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
};

export default MyOrders;
