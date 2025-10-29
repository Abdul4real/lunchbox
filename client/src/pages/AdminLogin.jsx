import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import AuthLayout from "../components/AuthLayout";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Store admin info
      localStorage.setItem("adminInfo", JSON.stringify(data));

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Admin Login 👋"
      footerText="Back to User Login?"
      footerLink="/signin"
      footerLinkText="Sign In"
    >
      {/* Optional: Back button to home */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4 hover:text-gray-900"
      >
        <b>Back</b>
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Admin Email"
          name="email"
          type="email"
          placeholder="admin@lunchbox.com"
          value={form.email}
          onChange={handleChange}
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="********"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black hover:opacity-90 transition"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </AuthLayout>
  );
}
