import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import SignIn from "./pages/SignIn.jsx";
import Register from "./pages/Register.jsx";
import "./index.css";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<App />} />
  <Route path="/signin" element={<SignIn />} />
  <Route path="/register" element={<Register />} />
  <Route path="/adminlogin" element={<AdminLogin />} />
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Routes>
    </BrowserRouter>
  </React.StrictMode>
);
