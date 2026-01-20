import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import OrderDetails from "./pages/OrderDetails";
import Wishlist from "./pages/Wishlist";
import MyOrders from "./pages/MyOrders";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminInventory from "./pages/admin/AdminInventory";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminAddProduct from "./pages/admin/AdminAddProduct";

function App() {
  return (
    <Routes>

      {/* USER ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      <Route path="/wishlist" element={<Wishlist/>} />
      <Route path="/orders" element={<MyOrders />} />

      {/* ✅ ADMIN ROUTES */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AdminAddProduct />} />
      </Route>

    </Routes>
  );
}

export default App;
