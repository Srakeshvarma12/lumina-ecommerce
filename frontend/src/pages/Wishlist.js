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

  const removeFromWishlist = async (productId) => {
    await authRequest(`/wishlist/${productId}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const moveToCart = async (productId) => {
    try {
      await authRequest("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      await authRequest(`/wishlist/${productId}`, { method: "DELETE" });

      setItems((prev) => prev.filter((i) => i.id !== productId));
    } catch (err) {
      console.error(err);
      alert("Move to cart failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 mb-6"
          >
            ← Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold mb-6">❤️ My Wishlist</h1>

          {loading && <p>Loading...</p>}

          {!loading && items.length === 0 && (
            <p className="text-gray-500">Your wishlist is empty.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border p-4 flex flex-col hover:shadow-lg transition"
              >
                <div className="bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-44 object-contain"
                  />
                </div>

                <h3 className="font-semibold mt-4 line-clamp-1">
                  {product.name}
                </h3>

                <p className="font-bold text-indigo-600 mt-1">
                  ₹{product.price}
                </p>

                <div className="mt-auto pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => moveToCart(product.id)}
                    className="bg-black text-white py-2 rounded-xl font-semibold"
                  >
                    Move to Cart
                  </button>

                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="border py-2 rounded-xl font-semibold text-red-600"
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
