import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authRequest } from "../api/api";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await authRequest("/wishlist");
      setItems(data || []);
    } catch (err) {
      console.error("Wishlist load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REMOVE ---------------- */

  const removeFromWishlist = async (productId) => {
    try {
      await authRequest(`/wishlist/${productId}`, { method: "DELETE" });
      setItems(items.filter(i => i.id !== productId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  /* ---------------- MOVE TO CART ---------------- */

  const moveToCart = async (productId) => {
  try {
    await authRequest("/cart", {
      method: "POST",
      body: JSON.stringify({
        productId: Number(productId),
        quantity: 1
      })
    });

    await authRequest(`/wishlist/${productId}`, {
      method: "DELETE"
    });

    setItems(prev => prev.filter(i => i.id !== productId));

  } catch (err) {
    console.error("MOVE TO CART ERROR:", err);
    alert(err.message || "Move to cart failed");
  }
};

  /* ---------------- UI ---------------- */

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-10">

          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 mb-6 hover:underline"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold mb-10">❤️ My Wishlist</h1>

          {loading && <p>Loading...</p>}

          {!loading && items.length === 0 && (
            <p className="text-gray-500">Your wishlist is empty.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

            {items.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col"
              >
                {/* ✅ FIXED IMAGE FIELD */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-52 object-contain mb-4"
                />

                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-indigo-500 font-bold mb-4">₹{product.price}</p>

                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => moveToCart(product.id)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold"
                  >
                    Move to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold"
                  >
                    Remove
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

export default Wishlist;
