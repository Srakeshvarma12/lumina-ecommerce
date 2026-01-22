import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Session expired. Please login again.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/admin/inventory", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          setError("Session expired. Please login again.");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load inventory");
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Inventory error:", err);
        setError("Unable to load inventory");
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-10 py-10">
        <h1 className="text-3xl font-bold mb-2">Inventory</h1>
        <p className="text-gray-600 mb-6">
          Live product stock after orders & refunds
        </p>

        <button
          onClick={() => navigate("/admin")}
          className="text-blue-600 hover:underline mb-4"
        >
          ← Back to Admin Dashboard
        </button>

        {loading && <p>Loading inventory...</p>}

        {error && (
          <div className="text-red-600">
            {error}
            <div>
              <button
                onClick={() => navigate("/login")}
                className="mt-2 text-blue-600 underline"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Product</th>
                  <th className="p-4 text-center">Price</th>
                  <th className="p-4 text-center">Stock</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-4">{p.name}</td>
                    <td className="p-4 text-center">₹{p.price}</td>
                    <td
                      className={`p-4 text-center font-semibold ${
                        p.stock <= 5 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {p.stock}
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminInventory;
