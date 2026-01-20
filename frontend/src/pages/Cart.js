import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { authRequest } from "../api/api";

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // ✅ Address state
  const [address, setAddress] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await authRequest("/cart");
      setItems(res.cart.items || []);
    } catch (e) {
      console.error(e);
      alert("Session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await authRequest(`/cart/${productId}`, { method: "DELETE" });
      setItems(prev => prev.filter(i => i.product_id !== productId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  const total = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  // ✅ Handle input change
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // ✅ Checkout
  const checkout = async () => {
    if (!items.length) return alert("Cart is empty");

    const { full_name, phone, address_line, city, state, pincode } = address;
    if (!full_name || !phone || !address_line || !city || !state || !pincode) {
      return alert("Please fill complete delivery address");
    }

    try {
      setProcessing(true);

      // 🔥 SEND ADDRESS TO BACKEND
      const order = await authRequest("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });

      const payment = await authRequest("/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: order.totalAmount,
          orderId: order.orderId
        })
      });

      const keyRes = await authRequest("/payment/key");

      const options = {
        key: keyRes.key,
        amount: payment.amount,
        currency: "INR",
        name: "Lumina",
        description: "Secure Checkout",
        order_id: payment.razorpayOrderId,

        handler: async function (response) {
          await authRequest("/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          alert("Payment successful");

          // ✅ clear cart UI
          setItems([]);

          // ✅ clear address form
          setAddress({
            full_name: "",
            phone: "",
            address_line: "",
            city: "",
            state: "",
            pincode: "",
            country: "India",
          });

          setProcessing(false);

          // ✅ optional (recommended)
          // window.location.href = "/orders";
        },


        modal: { ondismiss: () => setProcessing(false) },
        theme: { color: "#4f46e5" }
      };

      new window.Razorpay(options).open();

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
      setProcessing(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-500">Review your order & delivery details</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* CART */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((i) => (
              <div
                key={i.product_id}
                className="flex items-center justify-between gap-6 border p-5 rounded-xl"
              >
                {/* LEFT SIDE */}
                <div className="flex items-center gap-5">
                  {/* ✅ PRODUCT IMAGE */}
                  <img
                    src={i.image_url}
                    alt={i.name}
                    className="w-24 h-24 object-contain rounded-lg bg-white"
                  />

                  {/* TEXT */}
                  <div>
                    <h2 className="font-semibold text-lg">{i.name}</h2>
                    <p className="text-sm text-gray-500">
                      ₹{i.price} × {i.quantity}
                    </p>

                    <button
                      onClick={() => removeItem(i.product_id)}
                      className="text-red-500 text-sm mt-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <p className="font-semibold text-lg">
                  ₹{(i.price * i.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* SUMMARY + ADDRESS */}
          <div className="bg-gray-50 border rounded-2xl p-6 h-fit">

            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>

            {["full_name", "phone", "address_line", "city", "state", "pincode"].map((f) => (
              <input
                key={f}
                name={f}
                value={address[f]}
                onChange={handleChange}
                placeholder={f.replace("_", " ").toUpperCase()}
                className="w-full mb-3 p-3 border rounded-lg"
              />
            ))}

            <div className="flex justify-between text-lg font-semibold mt-4">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              disabled={processing}
              onClick={checkout}
              className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
            >
              {processing ? "Processing..." : "Place Order & Pay"}
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
