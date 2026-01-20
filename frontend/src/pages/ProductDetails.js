import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiRequest, authRequest } from "../api/api";
import Navbar from "../components/Navbar";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
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
    } catch (err) {
      console.error(err);
      alert("Product not found");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      await authRequest("/cart/add", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity: qty,
        }),
      });
      alert("✅ Added to cart");
    } catch {
      alert("⚠️ Please login to add items");
    }
  };

  const formatCategory = (cat) =>
    cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
          Loading product...
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
          Product not found
        </div>
      </>
    );
  }

  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-screen">

        {/* BREADCRUMBS */}
        <div className="max-w-7xl mx-auto px-6 pt-10 text-sm text-gray-400 flex items-center gap-2">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black">Products</Link>
          {product.category && (
            <>
              <span>/</span>
              <span
                onClick={() =>
                  navigate(`/products?category=${product.category}`)
                }
                className="cursor-pointer hover:text-black"
              >
                {formatCategory(product.category)}
              </span>
            </>
          )}
          <span>/</span>
          <span className="text-gray-700 font-medium line-clamp-1">
            {product.name}
          </span>
        </div>

        {/* MAIN PRODUCT */}
        <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-20">

          {/* IMAGE */}
          <div className="bg-gray-100 rounded-3xl p-12 flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-[480px] object-contain"
            />
          </div>

          {/* DETAILS */}
          <div className="space-y-6">

            {product.category && (
              <p className="text-xs uppercase tracking-wide text-gray-400">
                {formatCategory(product.category)}
              </p>
            )}

            <h1 className="text-4xl font-bold leading-tight">
              {product.name}
            </h1>

            <p className="text-gray-500 leading-relaxed max-w-xl">
              {product.description}
            </p>

            <p className="text-3xl font-semibold">
              ₹ {product.price}
            </p>

            {/* STOCK */}
            <div className="text-sm">
              {product.stock === 0 && (
                <span className="text-red-600 font-semibold">Out of stock</span>
              )}
              {lowStock && (
                <span className="text-yellow-600 font-semibold">
                  Hurry! Only {product.stock} left
                </span>
              )}
              {product.stock > 5 && (
                <span className="text-green-600 font-semibold">In stock</span>
              )}
            </div>

            {/* QUANTITY */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Quantity</span>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      Math.max(
                        1,
                        Math.min(product.stock, Number(e.target.value))
                      )
                    )
                  }
                  className="w-24 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            )}

            {/* ACTION */}
            <button
              disabled={product.stock === 0}
              onClick={addToCart}
              className="mt-4 bg-black text-white px-10 py-4 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-40"
            >
              {product.stock === 0 ? "Out of stock" : "Add to Cart"}
            </button>

          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 pb-24">

            <h2 className="text-3xl font-bold mb-12">
              Related Products
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
              {related.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/products/${item.id}`)}
                  className="cursor-pointer group border rounded-3xl overflow-hidden hover:shadow-xl transition"
                >
                  <div className="bg-gray-100 p-8">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-44 object-contain group-hover:scale-105 transition"
                    />
                  </div>

                  <div className="p-5 space-y-1">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      {formatCategory(item.category)}
                    </p>
                    <p className="font-semibold line-clamp-1">
                      {item.name}
                    </p>
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
