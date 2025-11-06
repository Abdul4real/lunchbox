import React from "react";
import { Link } from "react-router-dom";
export default function AuthLayout({ title, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-center mb-6">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ background: "var(--lb-yellow)" }}
          >
            <span className="font-bold">L</span>
          </div>
          <span className="ml-2 text-2xl font-extrabold">LunchBox</span>
        </div>

        <h1 className="text-xl font-bold text-center mb-4">{title}</h1>

        {children}

        <p className="text-sm text-center text-gray-600 dark:text-neutral-400 mt-6">
          {footerText}{" "}
          <Link to={footerLink} className="text-[var(--lb-yellow)] hover:underline font-medium">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
