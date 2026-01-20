import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const loadInventory = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/admin/inventory", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false);
    };

    loadInventory();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-10 py-10">
        <h1 className="text-3xl font-bold mb-2">Inventory</h1>
        <p className="text-gray-600 mb-6">Live product stock after orders & refunds</p>

        <button
            onClick={() => navigate("/admin")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Admin Dashboard
          </button>

        {loading ? (
          <p>Loading inventory...</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                </tr>
              </thead>

              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-t">
                    <td className="p-4">{p.name}</td>
                    <td className="p-4 text-center">₹{p.price}</td>
                    <td className={`p-4 text-center font-semibold ${p.stock <= 5 ? "text-red-600" : "text-green-600"}`}>
                      {p.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminInventory;
