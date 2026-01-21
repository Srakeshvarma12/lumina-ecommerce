import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import Navbar from "../components/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addToWishlist } from "../api/wishlist";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sort, setSort] = useState("");

  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  /* ================= URL → STATE ================= */

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const q = params.get("search") || "";
    const cat = params.get("category") || "";
    const pr = params.get("price") || "";
    const so = params.get("sort") || "";

    setSearch(q);
    setCategory(cat);
    setPrice(pr);
    setSort(so);

    loadProducts({ q, cat, pr, so });
  }, [location.search]);

  /* ================= INIT ================= */

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= BACKEND ================= */

  const fetchCategories = async () => {
    try {
      const data = await apiRequest("/products/categories");
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Categories fetch failed", err);
    }
  };

  const loadProducts = async ({ q, cat, pr, so }) => {
    try {
      setLoading(true);

      let url = "/products";

      if (cat) {
        url = `/products/category/${cat}`;
      }

      if (q) {
        url = `/products/search?q=${q}`;
      }

      const data = await apiRequest(url);

      let result = data.products || [];

      /* ---------- PRICE FILTER ---------- */
      if (pr === "low") {
        result = result.filter(p => p.price < 1000);
      }
      if (pr === "mid") {
        result = result.filter(p => p.price >= 1000 && p.price <= 10000);
      }
      if (pr === "high") {
        result = result.filter(p => p.price > 10000);
      }

      /* ---------- SORTING ---------- */
      if (so === "price_asc") {
        result.sort((a, b) => a.price - b.price);
      }

      if (so === "price_desc") {
        result.sort((a, b) => b.price - a.price);
      }

      if (so === "newest") {
        result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }

      setProducts(result);

    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= URL UPDATER ================= */

  const updateURL = (changes) => {
    const params = new URLSearchParams(location.search);

    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    navigate(`/products?${params.toString()}`);
  };

  /* ================= CART ================= */

  const addToCart = async (productId) => {
    try {
      await apiRequest("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      alert("Added to cart");
    } catch {
      alert("Please login first");
    }
  };

  /* ================= WISHLIST ================= */
  const handleWishlist = async (id) => {
    await addToWishlist(id);
    alert("Added to wishlist");
  };

  /* ================= UI ================= */

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-screen">

        {/* HEADER */}
        <div className="border-b border-gray-200">
          <div className="container-store py-12">
            <h1 className="text-5xl font-bold mb-3">Products</h1>
            <p className="text-gray-500">
              Explore our curated collection of premium products.
            </p>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="border-b border-gray-100 bg-white">
          <div className="container-store py-6 grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                updateURL({ search: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black"
            />

            <select
              value={category}
              onChange={(e) =>
                updateURL({ category: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={price}
              onChange={(e) =>
                updateURL({ price: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black"
            >
              <option value="">All Prices</option>
              <option value="low">Below ₹1,000</option>
              <option value="mid">₹1,000 – ₹10,000</option>
              <option value="high">Above ₹10,000</option>
            </select>

            <select
              value={sort}
              onChange={(e) =>
                updateURL({ sort: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black"
            >
              <option value="">Sort By</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

          </div>
        </div>

        {/* GRID */}
        <div className="container-store py-14">

          {loading && <p className="text-gray-500">Loading products...</p>}
          {!loading && products.length === 0 && (
            <p className="text-gray-500">No products found.</p>
          )}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="group border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition bg-white"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square bg-gray-50 flex items-center justify-center p-6">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="max-h-full object-contain group-hover:scale-105 transition"
                    />
                  </div>
                </Link>

                <div className="p-5 space-y-2">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {product.category}
                  </p>

                  <h3 className="font-semibold text-lg line-clamp-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold">
                      ₹ {product.price}
                    </span>

                    {/* <button
                      onClick={() => addToCart(product.id)}
                      className="text-sm font-medium px-4 py-2 rounded-full border border-black hover:bg-black hover:text-white transition"
                    >
                      Add
                    </button> */}
                    <button
                      onClick={() => addToCart(product.id)}
                      className="h-11 px-6 rounded-full border border-gray-300 hover:border-black hover:bg-gray-100 transition font-medium"
                    >
                      Add
                    </button>

                    <button
                      onClick={() => handleWishlist(product.id)}
                      className="h-11 w-11 flex items-center justify-center rounded-full border border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition"
                      title="Add to wishlist"
                    >
                      <span className="text-xl text-pink-500">❤️</span>


                    </button>
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

export default Products;
