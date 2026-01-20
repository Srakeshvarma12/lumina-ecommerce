import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { authRequest } from "../../api/api";

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image_url: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authRequest("/admin/products", "POST", form);
      alert("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("Add product error:", err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-10">

          <button
            onClick={() => navigate("/admin")}
            className="text-blue-600 hover:underline mb-6"
          >
            ← Back to dashboard
          </button>

          <h1 className="text-3xl font-bold mb-2">Add New Product</h1>
          <p className="text-gray-500 mb-8">Create a new product for the store</p>

          <form
            onSubmit={handleSubmit}
            className="bg-white border rounded-2xl p-8 space-y-6"
          >

            <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required />
            <Input label="Price" name="price" type="number" value={form.price} onChange={handleChange} required />
            <Input label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} required />
            <Input label="Category" name="category" value={form.category} onChange={handleChange} required />
            <Input label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} />

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring"
              />
            </div>

            <button
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <input
      {...props}
      className="w-full border rounded-xl px-4 py-2 mt-1 focus:outline-none focus:ring"
    />
  </div>
);

export default AdminAddProduct;
