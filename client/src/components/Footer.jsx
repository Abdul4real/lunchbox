import React from "react";
export default function Footer() {
  return (
    <footer className="mt-14 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-200 dark:border-neutral-800 pt-8">
        <div>
          <h4 className="font-semibold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-neutral-400">
            <li>About Us</li><li>Careers</li><li>Blog</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-neutral-400">
            <li>Contact</li><li>FAQs</li><li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Follow Us</h4>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-neutral-400">
            <li>Instagram</li><li>YouTube</li><li>TikTok</li>
          </ul>
        </div>
        <div className="text-sm text-gray-500 dark:text-neutral-500">
          <p>© 2025 LunchBox.</p>
          <p>All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}