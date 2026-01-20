import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

const CategorySidebar = ({ onSelect }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await apiRequest("/products");
      const unique = [...new Set(data.products.map(p => p.category))];
      setCategories(unique.filter(Boolean));
    } catch (err) {
      console.error("Category load failed", err);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-5 border border-white/10">
      <h3 className="font-semibold mb-4 text-indigo-400">Categories</h3>

      <div className="space-y-2">
        <button
          onClick={() => onSelect(null)}
          className="block text-left w-full hover:text-indigo-400"
        >
          All Products
        </button>

        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => onSelect(cat)}
            className="block text-left w-full hover:text-indigo-400 capitalize"
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;
