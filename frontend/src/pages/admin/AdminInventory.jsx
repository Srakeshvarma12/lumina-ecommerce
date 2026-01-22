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
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/admin/inventory", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          setError("Session expired. Please login again.");
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Inventory fetch failed");

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("INVENTORY ERROR:", err);
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
          <p className="text-red-600 mt-4">
            {error}{" "}
            <span
              className="underline cursor-pointer text-blue-600"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </span>
          </p>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow overflow-x-auto mt-4">
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
