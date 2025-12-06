// client/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const Card = ({ title, count, to, emoji, loading }) => (
  <Link
    to={to}
    className="rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900 hover:shadow-sm transition"
  >
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      <span className="text-2xl">{emoji}</span>
    </div>
    <p className="mt-4 text-3xl font-extrabold">
      {loading ? "…" : count}
    </p>
    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
      View details →
    </p>
  </Link>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    recipes: 0,
    reports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        // matches your backend: GET /api/admin/dashboard
        const res = await axios.get(`${API_BASE}/api/admin/dashboard`);
        setStats({
          users: res.data.users ?? 0,
          recipes: res.data.recipes ?? 0,
          reports: res.data.reports ?? 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard overview:", err);
        alert("Failed to load admin overview");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-neutral-400">
          • View system overview • Navigate to Users / Recipes / Reports
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="Users"
          count={stats.users}
          to="/admin/users"
          emoji="👥"
          loading={loading}
        />
        <Card
          title="Recipes"
          count={stats.recipes}
          to="/admin/recipes"
          emoji="🍲"
          loading={loading}
        />
        <Card
          title="Reports"
          count={stats.reports}
          to="/admin/reports"
          emoji="🚩"
          loading={loading}
        />
      </div>
    </section>
  );
}
