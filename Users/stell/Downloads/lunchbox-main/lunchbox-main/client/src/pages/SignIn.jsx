import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // from your context
// expects AuthContext to expose: loginUser({ token, user })

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function SignIn() {
  const nav = useNavigate();
  const { loginUser } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Sign in failed");

      // persist token if "remember me" checked
      if (remember) localStorage.setItem("lb_token", data.token);
      loginUser({ token: data.token, user: data.user }); // update context
      nav("/app"); // go to user dashboard
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        {/* Back */}
        <button
          onClick={() => nav("/")}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400 mb-3 hover:text-gray-900 dark:hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Brand */}
        <div className="flex items-center justify-center mb-5">
          <div className="h-10 w-10 rounded-lg grid place-items-center" style={{ background: "var(--lb-yellow)" }}>
            <span className="font-bold">L</span>
          </div>
          <span className="ml-2 text-2xl font-extrabold">LunchBox</span>
        </div>

        <h1 className="text-xl font-bold text-center">Sign in to your account</h1>
        {err && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {err}
          </p>
        )}

        <form onSubmit={submit} className="mt-4 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:ring-2 focus:ring-[var(--lb-yellow)] outline-none"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">Password</span>
            <div className="mt-1 relative">
              <input
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 pr-10 focus:ring-2 focus:ring-[var(--lb-yellow)] outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-gray-300"
              />
              Remember me
            </label>
            <button type="button" className="text-sm text-gray-600 dark:text-neutral-400 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-neutral-400 mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[var(--lb-yellow)] font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}