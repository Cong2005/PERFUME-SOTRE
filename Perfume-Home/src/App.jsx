import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BulkImport from "./pages/BulkImport";
import ProductDetail from "./pages/ProductDetail";   
import Cart from "./pages/Cart"
import PrivateRoute from "./PrivateRoute";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/manage/import" element={<PrivateRoute><BulkImport /></PrivateRoute>} />
        <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/home" element={<Home />} />
        <Route path="/manage/import" element={<BulkImport />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />


      </Routes>
    </BrowserRouter>
  );
}
