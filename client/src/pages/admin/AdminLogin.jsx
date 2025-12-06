// client/src/pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = "http://localhost:5000";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password.trim(),
      };

      console.log("Admin login submit:", payload);

      // Call backend admin login API
      const res = await axios.post(
        `${API_BASE}/api/admin/login`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Admin login response:", res.data);
      // res.data = { message, token, admin }

      const { token, admin } = res.data;

      // AuthContext expects an object { token, user }
      loginAdmin({ token, user: admin });

      // Navigate to admin dashboard
      navigate("/admin", { replace: true });

      // Hard fallback in case router guard interferes
      window.location.href = "/admin";
    } catch (err) {
      console.error("Admin login error:", err);
      alert(
        err?.response?.data?.message ||
          err.message ||
          "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-white dark:bg-neutral-950 dark:text-neutral-100 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4"
      >
        <div className="flex items-center gap-2">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ background: "var(--lb-yellow)" }}
          >
            <span className="font-bold text-black">L</span>
          </div>
          <h1 className="text-xl font-extrabold">Admin Login</h1>
        </div>

        <label className="block">
          <span className="text-sm font-medium">Admin Email</span>
          <input
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Password</span>
          <input
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full py-2 rounded-xl border mt-2 border-gray-200 dark:border-neutral-700"
        >
          <b>Back to Home</b>
        </button>
      </form>
    </div>
  );
}
