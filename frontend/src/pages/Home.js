import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [latestRes, categoriesRes] = await Promise.all([
        apiRequest("/products/latest"),
        apiRequest("/products/categories"),
      ]);

      setLatest(latestRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (err) {
      console.error("Home fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCategory = (cat) =>
  String(cat).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <Navbar />

      <div className="bg-white text-gray-900">

        {/* ================= HERO ================= */}
        <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <h1 className="text-6xl font-bold leading-tight mb-6">
              Your Daily Destination for Everything Quality.
            </h1>

            <p className="text-gray-500 text-lg mb-10 max-w-lg">
              Curated collection of timeless products for modern living.
              Quality meets simplicity.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition font-semibold"
            >
              Shop Now →
            </Link>
          </div>

          {/* RIGHT */}
          <div className="bg-gray-100 rounded-3xl overflow-hidden h-[520px] w-full">
            <img
              src="/Lumina2.png"
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>

        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t">

          <h2 className="text-3xl font-bold mb-12">Shop by Category</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/products?category=${cat.name}`)}
                className="cursor-pointer border rounded-2xl p-8 text-center hover:shadow-lg transition"
              >
                <p className="font-semibold text-lg">
                  {formatCategory(cat.name)}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* ================= LATEST ================= */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t">

          <h2 className="text-3xl font-bold mb-12">Latest Arrivals</h2>

          {loading && <p className="text-gray-400">Loading...</p>}

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
            {latest.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group border rounded-3xl overflow-hidden hover:shadow-xl transition"
              >
                <div className="bg-gray-100 p-8">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-52 object-contain group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-5 space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {formatCategory(product.category)}
                  </p>

                  <h3 className="font-semibold line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="font-bold">₹ {product.price}</p>
                </div>
              </Link>
            ))}
          </div>

        </section>

      </div>
    </>
  );
};

export default Home;
