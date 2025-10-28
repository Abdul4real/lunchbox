import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import React from "react";
const navLink =
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-neutral-800";

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 p-4 sticky top-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: "var(--lb-yellow)" }}>
                <span className="font-bold text-black">L</span>
              </div>
              <p className="font-extrabold">LunchBox Admin</p>
            </div>

            <nav className="space-y-1">
              <NavLink to="/admin" end className={({isActive}) => `${navLink} ${isActive ? "bg-gray-100 dark:bg-neutral-800 font-semibold" : ""}`}>🏠 Dashboard</NavLink>
              <NavLink to="/admin/users" className={({isActive}) => `${navLink} ${isActive ? "bg-gray-100 dark:bg-neutral-800 font-semibold" : ""}`}>👥 Users</NavLink>
              <NavLink to="/admin/recipes" className={({isActive}) => `${navLink} ${isActive ? "bg-gray-100 dark:bg-neutral-800 font-semibold" : ""}`}>🍲 Recipes</NavLink>
              <NavLink to="/admin/reports" className={({isActive}) => `${navLink} ${isActive ? "bg-gray-100 dark:bg-neutral-800 font-semibold" : ""}`}>🚩 Reports</NavLink>
            </nav>

            <button onClick={logout} className="mt-6 w-full text-left px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700">
              ⎋ Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9 lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
