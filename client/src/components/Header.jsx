import { useTheme } from "../contexts/ThemeContext";
import { useNotifications } from "../contexts/NotificationsContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
export default function Header() {
  const { theme, toggle } = useTheme();
  const { items, unread, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="pt-6 pb-2 sticky top-0 z-20 bg-white/80 dark:bg-neutral-950/80 backdrop-blur border-b border-gray-100 dark:border-neutral-800">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* brand */}
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--lb-yellow)" }}
          >
            <span className="font-bold text-black">L</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight">LunchBox</span>
        </div>

        {/* search 
        <div className="flex-1 max-w-xl mx-6 hidden md:flex">
          <label className="w-full relative">
            <input
              className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-neutral-700"
              placeholder="Search recipes, ingredients, or cuisines"
              aria-label="Search"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </label>
        </div> */}
        

        {/* actions */}
        <div className="relative flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => setOpen(o => !o)}
            className="relative p-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            aria-label="Notifications"
          >
            🔔
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-xs grid place-items-center">
                {unread}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 top-11 w-72 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg p-2">
              <div className="flex items-center justify-between px-2 py-1">
                <p className="font-semibold">Notifications</p>
                <button
                  onClick={markAllRead}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Mark all read
                </button>
              </div>
              <ul className="max-h-72 overflow-auto divide-y divide-gray-100 dark:divide-neutral-800">
                {items.map(n => (
                  <li key={n.id} className="px-3 py-2 text-sm">
                    <span className={!n.read ? "font-medium" : ""}>{n.text}</span>
                    {!n.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500" />}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
            aria-label="Toggle theme"
            title="Toggle light/dark"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
           {/* Sign  */}
          <button
            onClick={() => navigate("/signin")}
            className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="p-2 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
          >
            Register
          </button>
        </div>
      </div>
    </header>
  );
}