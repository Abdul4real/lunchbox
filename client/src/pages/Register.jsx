import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      console.log("✅ Registered user:", data);
      navigate("/signin");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create Your Account ✨"
      footerText="Already have an account?"
      footerLink="/signin"
      footerLinkText="Sign In"
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
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
        />
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
        <InputField
          label="Confirm Password"
          name="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black hover:opacity-90 transition"
        >
          Register
        </button>
      </form>
    </AuthLayout>
  );
}
