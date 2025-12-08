import React from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

export default function RecipeCard({ id, image, title, meta, cta = "View Recipe" }) {
  const nav = useNavigate();
//new code
  // Fix the image URL
  const fixedImage = image?.startsWith("http")
    ? image
    : image?.startsWith("/")
    ? image
    : "/" + image;

  return (
    <article className="rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900 hover:shadow-sm transition-shadow">
      <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-800">
        <img src={fixedImage} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold leading-snug">{title}</h3>
        {meta && <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{meta}</p>}
        <button
          onClick={() => nav(`/recipes/${id}`)}
          className="mt-2 text-sm font-medium text-gray-700 dark:text-neutral-200 hover:opacity-80"
        >
          {cta}
        </button>
      </div>
    </article>
  );
}
