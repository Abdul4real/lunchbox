
import React from "react"; 
import { Link } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";

export default function UserHome() {
  const { recipes, toggleBookmark } = useRecipes();

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Latest Recipes</h1>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map(r => (
          <article
            key={r._id}
            className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900"
          >
            <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-800">
              <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{r.title}</h3>

                <button
                  onClick={() => toggleBookmark(r._id)}
                  title="Bookmark"
                  className="text-xl"
                >
                  {r.bookmarked ? "🔖" : "📑"}
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                ⏱ {r.time} · ⭐ {r.rating}
              </p>

              <div className="mt-3 flex gap-2">
                <Link to={`/app/recipe/${r._id}`} className="px-3 py-1 rounded-lg border">
                  View
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
