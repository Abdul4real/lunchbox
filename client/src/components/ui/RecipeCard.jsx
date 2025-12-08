// client/src/components/RecipeCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const FE_BASE = "https://lunchbox-wlgs.vercel.app";
const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "");

export default function RecipeCard({ id, image, title, meta, cta = "View Recipe" }) {
  const navigate = useNavigate();

  let fixedImage = image;

  // 1️⃣ Sample frontend images → serve from Vercel
  if (image?.startsWith("/images/")) {
    fixedImage = FE_BASE + image;
  }

  // 2️⃣ Uploaded images from backend: "uploads/filename.jpg"
  else if (image?.startsWith("uploads/")) {
    fixedImage = `${API_BASE}/${image}`;
  }

  // 3️⃣ Already absolute URL → use as-is
  else if (image?.startsWith("http")) {
    fixedImage = image;
  }

  // 4️⃣ Fallback image
  else {
    fixedImage = FE_BASE + "/images/bowl.jpg";
  }

  return (
    <article className="rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 hover:shadow-sm transition-shadow">
      <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-800">
        <img
          src={fixedImage}
          alt={title}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = FE_BASE + "/images/bowl.jpg";
          }}
        />
      </div>

      <div className="p-3">
        <h3 className="font-semibold leading-snug">{title}</h3>

        {meta && (
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            {meta}
          </p>
        )}

        {id && (
          <button
            onClick={() => navigate("/signin")}
            className="mt-2 text-sm font-medium text-gray-700 dark:text-neutral-200 hover:opacity-80"
          >
            {cta}
          </button>
        )}
      </div>
    </article>
  );
}
