import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import Auction from "../pages/Auction";
import ProductDetails from "../pages/ProductDetails";
import AddProduct from "../pages/AddProduct";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/products" element={<Products />} />

      <Route path="/products/:id" element={<ProductDetails />} />

      <Route path="/auction" element={<Auction />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/add-product" element={<AddProduct />} />
    </Routes>
  );
}

export default AppRoutes;