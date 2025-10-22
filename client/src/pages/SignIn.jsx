import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InputField from "../components/InputField";
import AuthLayout from "../components/AuthLayout";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    console.log("Sign in:", form);
  };

  const navigate = useNavigate(); // 

  return (
    <AuthLayout
      title="Welcome Back 👋"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Sign Up"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400 mb-4 hover:text-gray-900 dark:hover:text-white"
      >
        <b>Back</b>
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="••••••••"
        />
        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black hover:opacity-90 transition"
        >
          Sign In
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-sm text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200"
        >
          Forgot Password?
        </button>
      </div>
    </AuthLayout>
  );
}