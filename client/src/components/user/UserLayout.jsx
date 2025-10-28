import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const link = "px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-neutral-800";

export default function UserLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 dark:text-neutral-100">
      <header className="border-b border-gray-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg grid place-items-center" style={{background:"var(--lb-yellow)"}}><span className="font-bold">L</span></div>
            <span className="font-extrabold">LunchBox</span>
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/app" end className={({isActive}) => `${link} ${isActive ? "bg-gray-100 dark:bg-neutral-800" : ""}`}>Feed</NavLink>
            <NavLink to="/app/add" className={({isActive}) => `${link} ${isActive ? "bg-gray-100 dark:bg-neutral-800" : ""}`}>Add</NavLink>
            <NavLink to="/app/search" className={({isActive}) => `${link} ${isActive ? "bg-gray-100 dark:bg-neutral-800" : ""}`}>Search</NavLink>
            <NavLink to="/app/profile" className={({isActive}) => `${link} ${isActive ? "bg-gray-100 dark:bg-neutral-800" : ""}`}>Profile</NavLink>
          </nav>
          <div className="text-sm">Hi, <b>{user?.name ?? "User"}</b> <button onClick={logout} className="ml-3 underline">Log out</button></div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

