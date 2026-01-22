import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import Navbar from "../components/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { addToWishlist } from "../api/wishlist";

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

  const fetchCategories = async () => {
    const data = await apiRequest("/products/categories");
    setCategories(data.categories || []);
  };

  const loadProducts = async ({ q, cat, pr, so }) => {
    try {
      setLoading(true);
      let url = "/products";

      if (cat) url = `/products/category/${cat}`;
      if (q) url = `/products/search?q=${q}`;

      const data = await apiRequest(url);
      let result = data.products || [];

      if (pr === "low") result = result.filter(p => p.price < 1000);
      if (pr === "mid") result = result.filter(p => p.price >= 1000 && p.price <= 10000);
      if (pr === "high") result = result.filter(p => p.price > 10000);

      if (so === "price_asc") result.sort((a, b) => a.price - b.price);
      if (so === "price_desc") result.sort((a, b) => b.price - a.price);
      if (so === "newest")
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setProducts(result);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (changes) => {
    const params = new URLSearchParams(location.search);
    Object.entries(changes).forEach(([k, v]) =>
      v ? params.set(k, v) : params.delete(k)
    );
    navigate(`/products?${params.toString()}`);
  };

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

  // const handleWishlist = async (id) => {
  //   await addToWishlist(id);
  //   alert("Added to wishlist");
  // };

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-screen">
        {/* HEADER */}
        <div className="border-b">
          <div className="container-store py-12">
            <h1 className="text-5xl font-bold mb-3">Products</h1>
            <p className="text-gray-500">
              Explore our curated collection of premium products.
            </p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="border-b bg-white">
          <div className="container-store py-6">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-4 max-w-full overflow-hidden">

              <input
                value={search}
                onChange={(e) => updateURL({ search: e.target.value })}
                placeholder="Search products..."
                className="border rounded-xl px-4 py-3"
              />

              <select
                value={category}
                onChange={(e) => updateURL({ category: e.target.value })}
                className="border rounded-xl px-4 py-3"
              >
                <option value="">All Categories</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>
                    {c.replace(/-/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                value={price}
                onChange={(e) => updateURL({ price: e.target.value })}
                className="border rounded-xl px-4 py-3"
              >
                <option value="">All Prices</option>
                <option value="low">Below ₹1,000</option>
                <option value="mid">₹1,000 – ₹10,000</option>
                <option value="high">Above ₹10,000</option>
              </select>

              <select
                value={sort}
                onChange={(e) => updateURL({ sort: e.target.value })}
                className="border rounded-xl px-4 py-3"
              >
                <option value="">Sort By</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="container-store py-14">
          {loading && <p>Loading...</p>}

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 lg:gap-8">            {products.map((product) => (
            <div
              key={product.id}
              className="group border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition bg-white flex flex-col"
            >
              <Link to={`/products/${product.id}`}>
                <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 sm:p-6">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="max-h-full object-contain group-hover:scale-105 transition"
                  />
                </div>
              </Link>

              {/* CONTENT */}
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <p className="text-[10px] sm:text-xs uppercase tracking-wide text-gray-400">
                  {product.category}
                </p>

                <h3 className="font-semibold text-sm sm:text-lg line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* PUSH BOTTOM */}
                <div className="mt-auto">
                  <span className="text-base sm:text-lg font-bold block mb-3">
                    ₹ {product.price}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(product.id)}
                      className="flex-1 h-10 rounded-full border border-gray-300 hover:border-black hover:bg-gray-100 transition font-medium text-sm"
                    >
                      Add
                    </button>

                    {/* <button
          onClick={() => handleWishlist(product.id)}
          className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition"
          title="Add to wishlist"
        >
          <span className="text-lg text-pink-500">❤️</span>
        </button> */}
                  </div>
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
