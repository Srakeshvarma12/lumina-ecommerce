import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/login");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <Link to="/" className="text-xl sm:text-2xl font-bold">
          Lumina
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link to="/products">Products</Link>
          <Link to="/orders">My Orders</Link>
          {token && <Link to="/wishlist">Wishlist</Link>}
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="text-sm font-medium">
            Cart
          </Link>

          {!token ? (
            <Link
              to="/login"
              className="hidden sm:block bg-black text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={logout}
              className="hidden sm:block bg-black text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              Logout
            </button>
          )}

          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <nav className="flex flex-col p-6 gap-5 text-base font-medium">
            <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
            <Link to="/orders" onClick={() => setOpen(false)}>My Orders</Link>
            {token && <Link to="/wishlist" onClick={() => setOpen(false)}>Wishlist</Link>}
            {user?.role === "admin" && <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>}

            <div className="pt-4 border-t">
              {!token ? (
                <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              ) : (
                <button onClick={logout} className="text-left w-full">Logout</button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
