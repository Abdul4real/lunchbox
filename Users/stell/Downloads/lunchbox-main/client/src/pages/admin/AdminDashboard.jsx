import React from "react";
import users from "../../data/admin/users.json";
import recipes from "../../data/admin/recipes.json";
import reports from "../../data/admin/reports.json";
import { Link } from "react-router-dom";

const Card = ({ title, count, to, emoji }) => (
  <Link to={to} className="rounded-2xl border border-gray-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-900 hover:shadow-sm transition">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      <span className="text-2xl">{emoji}</span>
    </div>
    <p className="mt-4 text-3xl font-extrabold">{count}</p>
    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">View details →</p>
  </Link>
);

export default function AdminDashboard() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-neutral-400">
          • View system overview • Navigate to Users / Recipes / Reports
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Users"   count={users.length}   to="/admin/users"   emoji="👥" />
        <Card title="Recipes" count={recipes.length} to="/admin/recipes" emoji="🍲" />
        <Card title="Reports" count={reports.length} to="/admin/reports" emoji="🚩" />
      </div>
    </section>
  );
}