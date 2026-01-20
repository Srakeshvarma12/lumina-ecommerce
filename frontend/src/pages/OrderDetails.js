import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authRequest } from "../api/api";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line
  }, []);

  const fetchDetails = async () => {
    try {
      const res = await authRequest(`/orders/${id}`);
      setOrder(res.order);
      setItems(res.items);
      setAddress(res.address);
    } catch (err) {
      console.error(err);
      alert("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="p-10">Loading...</p>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <p className="p-10 text-red-500">Order not found.</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ✅ FIXED BACK BUTTON */}
        <button
          onClick={() => navigate("/orders", { replace: true })}
          className="text-blue-600 hover:underline"
        >
          ← Back to orders
        </button>

        <h1 className="text-3xl font-bold mt-4 mb-1">
          Order #{order.id}
        </h1>

        <p className="text-gray-500 mb-8">
          {new Date(order.created_at).toLocaleString()} • {order.status}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex gap-5 border rounded-xl p-5 items-center bg-white"
              >
                {/* PRODUCT IMAGE */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-28 h-28 object-contain rounded-lg border"
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-gray-500">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* ADDRESS */}
          {address && (
            <div className="border rounded-xl p-6 bg-white h-fit">
              <h2 className="text-lg font-semibold mb-4">
                Delivery Address
              </h2>

              <p>{address.full_name}</p>
              <p>{address.phone}</p>
              <p>{address.address_line}</p>
              <p>{address.city}, {address.state}</p>
              <p>{address.pincode}</p>
              <p>{address.country}</p>

              <div className="flex justify-between font-semibold text-lg mt-5 pt-4 border-t">
                <span>Total</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default OrderDetails;
