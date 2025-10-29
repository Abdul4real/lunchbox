import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Welcome, {adminInfo?.admin?.name || "Admin"} 👋
        </h1>
        <p className="text-gray-600 mb-6">
          You are now in the Admin Dashboard.
        </p>

        {/* Example Dashboard Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/admin/manage-users")}
            className="w-full py-2 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate("/admin/manage-content")}
            className="w-full py-2 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
          >
            Manage Content
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
