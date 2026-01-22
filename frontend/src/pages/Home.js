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

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
              Your Daily Destination for Everything Quality.
            </h1>

            <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-xl">
              Curated collection of timeless products for modern living.
              Quality meets simplicity.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-black text-white px-7 py-4 rounded-xl hover:bg-gray-800 transition font-semibold"
            >
              Shop Now →
            </Link>
          </div>

          <div className="bg-gray-100 rounded-3xl overflow-hidden w-full h-[260px] sm:h-[420px] lg:h-[520px]">
            <img
              src="/Lumina2.png"
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>

        </section>

        {/* CATEGORIES */}
        {/* <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 border-t">

          <h2 className="text-2xl sm:text-3xl font-bold mb-10">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/products?category=${cat.name}`)}
                className="cursor-pointer border rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition bg-white"
              >
                <p className="font-semibold text-sm sm:text-lg">
                  {formatCategory(cat.name)}
                </p>
              </div>
            ))}
          </div>

        </section> */}

        {/* LATEST */}
        <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 border-t">

          <h2 className="text-2xl sm:text-3xl font-bold mb-10">
            Latest Arrivals
          </h2>

          {loading && <p className="text-gray-400">Loading...</p>}

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
            {latest.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group border rounded-3xl overflow-hidden hover:shadow-xl transition bg-white"
              >
                <div className="bg-gray-100 p-5 sm:p-8">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-36 sm:h-52 object-contain group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-4 sm:p-5 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {formatCategory(product.category)}
                  </p>

                  <h3 className="font-semibold line-clamp-1 text-sm sm:text-base">
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
