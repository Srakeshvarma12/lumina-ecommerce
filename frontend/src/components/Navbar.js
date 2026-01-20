import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-semibold tracking-wide text-gray-900">
          Lumina
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-12 text-sm font-medium text-gray-700">
          <Link to="/products" className="hover:text-black">
            Products
          </Link>

          {/* ✅ WISHLIST */}
          {token && (
            <Link to="/wishlist" className="hover:text-black">
              Wishlist
            </Link>
          )}

          <Link to="/orders" className="hover:text-black">
            My Orders
          </Link>

          {/* ✅ ADMIN */}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-black">
              Admin
            </Link>
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">
          {token && (
            <Link
              to="/wishlist"
              className="text-sm font-medium text-gray-700 hover:text-black md:hidden"
            >
              Wishlist
            </Link>
          )}

          <Link to="/cart" className="text-sm font-medium text-gray-700 hover:text-black">
            Cart
          </Link>

          {!token ? (
            <Link
              to="/login"
              className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold"
            >
              Logout
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
