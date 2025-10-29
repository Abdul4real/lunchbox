import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation

export default function Footer() {
  return (
    <footer className="mt-14 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 dark:border-neutral-800 pt-8">
        
        {/* Company Section */}
        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-neutral-400">
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h4 className="font-semibold">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-neutral-400">
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Us Section */}
        <div>
          <h4 className="font-semibold">Follow Us</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-neutral-400">
            <li>
              <a href="#" className="hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                YouTube
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                TikTok
              </a>
            </li>
          </ul>
        </div>

        {/* Copyright Section */}
        <div className="text-sm text-gray-500 dark:text-neutral-500">
          <p>© 2025 LunchBox.</p>
          <p>All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
