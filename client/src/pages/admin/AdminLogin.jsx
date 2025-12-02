import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(form);
      navigate("/admin");
    } catch (err) {
      alert(err.message || "Login failed");
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
            onChange={handleChange}
            required
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black"
        >
          Sign In
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
