import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { authRequest } from "../api/api";

const Cart = () => {
  const [items, setItems] = useState([]);
 
  const [processing, setProcessing] = useState(false);

  const [address, setAddress] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const loadCart = useCallback(async () => {
  try {
    const res = await authRequest("/cart");
    setItems(res.cart.items || []);
  } catch {
    alert("Session expired. Please login again.");
  }
}, []);

useEffect(() => {
  loadCart();
}, [loadCart]);


  const removeItem = async (productId) => {
    await authRequest(`/cart/${productId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const total = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const checkout = async () => {
    if (!items.length) return alert("Cart is empty");

    const { full_name, phone, address_line, city, state, pincode } = address;
    if (!full_name || !phone || !address_line || !city || !state || !pincode)
      return alert("Fill complete delivery address");

    try {
      setProcessing(true);

      const order = await authRequest("/orders", {
        method: "POST",
        body: JSON.stringify(address),
      });

      const payment = await authRequest("/payment/create-order", {
        method: "POST",
        body: JSON.stringify({
          amount: order.totalAmount,
          orderId: order.orderId,
        }),
      });

      const keyRes = await authRequest("/payment/key");

      new window.Razorpay({
        key: keyRes.key,
        amount: payment.amount,
        currency: "INR",
        name: "Lumina",
        order_id: payment.razorpayOrderId,
        handler: async function (response) {
          await authRequest("/payment/verify", {
            method: "POST",
            body: JSON.stringify(response),
          });
          alert("Payment successful");
          setItems([]);
        },
        modal: { ondismiss: () => setProcessing(false) },
      }).open();
    } catch {
      alert("Checkout failed");
      setProcessing(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">Your Cart</h1>
          <p className="text-gray-500 mb-8">Review items and checkout</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((i) => (
                <div
                  key={i.product_id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 border rounded-xl p-4"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={i.image_url}
                      alt={i.name}
                      className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                    />
                    <div>
                      <p className="font-semibold">{i.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{i.price} × {i.quantity}
                      </p>
                      <button
                        onClick={() => removeItem(i.product_id)}
                        className="text-red-500 text-sm mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="sm:ml-auto font-semibold text-lg">
                    ₹{(i.price * i.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-gray-50 border rounded-2xl p-5 space-y-3 h-fit">
              <h2 className="text-lg font-semibold">Delivery Address</h2>

              {["full_name", "phone", "address_line", "city", "state", "pincode"].map((f) => (
                <input
                  key={f}
                  name={f}
                  value={address[f]}
                  onChange={handleChange}
                  placeholder={f.replace("_", " ").toUpperCase()}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              ))}

              <div className="flex justify-between text-lg font-semibold pt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                disabled={processing}
                onClick={checkout}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold"
              >
                {processing ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
