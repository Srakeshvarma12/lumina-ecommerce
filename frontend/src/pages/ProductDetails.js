import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, authRequest } from "../api/api";
import Navbar from "../components/Navbar";
import { addToWishlist } from "../api/wishlist";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  const fetchProduct = useCallback(async () => {
    try {
      const data = await apiRequest(`/products/${id}`);
      const prod = data.product || data;
      setProduct(prod);

      if (prod?.category) {
        const relatedData = await apiRequest(
          `/products/related/${prod.category}/${prod.id}`
        );
        setRelated(relatedData.products || []);
      }
    } catch {
      alert("Product not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [fetchProduct]);

  const handleWishlist = async (id) => {
    await addToWishlist(id);
    alert("Added to wishlist");
  };

  const addToCart = async () => {
    try {
      await authRequest("/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity: qty }),
      });
      alert("Added to cart");
    } catch (error) {
      alert("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-screen flex items-center justify-center text-gray-500">
          Loading product...
        </div>
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <Navbar />



      <div className="bg-white min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="text-black-600 mb-6"
        >
          ← Back
        </button>
        {/* PRODUCT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">


          <div className="bg-gray-100 rounded-3xl p-6 sm:p-10 flex justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-[420px] object-contain"
            />
          </div>

          <div className="space-y-5">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              {product.category}
            </p>

            <h1 className="text-2xl sm:text-4xl font-bold">{product.name}</h1>

            <p className="text-gray-500 leading-relaxed">
              {product.description}
            </p>

            <p className="text-2xl sm:text-3xl font-semibold">
              ₹ {product.price}
            </p>

            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm">Qty</span>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="w-24 border rounded-lg px-3 py-2"
                />
              </div>
            )}

            <button
              onClick={() => handleWishlist(product.id)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border hover:bg-pink-50"
              title="Add to wishlist"
            >
              ❤️
            </button>
            <button
              disabled={product.stock === 0}
              onClick={addToCart}
              className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-xl font-semibold disabled:opacity-40"
            >
              {product.stock === 0 ? "Out of stock" : "Add to Cart"}
            </button>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Related Products
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {related.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/products/${item.id}`)}
                  className="cursor-pointer border rounded-2xl overflow-hidden hover:shadow-lg transition"
                >
                  <div className="bg-gray-100 p-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-36 mx-auto object-contain"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-xs uppercase text-gray-400">
                      {item.category}
                    </p>
                    <p className="font-semibold line-clamp-1">{item.name}</p>
                    <p className="font-bold">₹ {item.price}</p>
                  </div>
                </div>
              ))}
            </div>

          </section>
        )}

      </div>
    </>
  );
};

export default ProductDetails;
