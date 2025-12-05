import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";
import { useAuth } from "../../contexts/AuthContext";

export default function SearchRecipes() {
  const { recipes = [] } = useRecipes();
  const { user } = useAuth();

  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");

  // Build available filters: All, My Recipes, then all tags
  const tagFilters = useMemo(() => {
    const tags = recipes.flatMap((r) => r.tags || []);
    return ["All", "My Recipes", ...new Set(tags)];
  }, [recipes]);

  // Main filtering logic
  const filtered = recipes.filter((r) => {
    const matchesSearch = r.title?.toLowerCase().includes(q.toLowerCase());

    // Correct logged-in user's ID
    const userId = user?.id;

    // Normalize recipe author
    const authorId =
      typeof r.author === "string"
        ? r.author
        : r.author?._id || r.author?.id;

    // My Recipes filter
    const matchesOwner =
      tag !== "My Recipes" ||
      (userId && authorId && String(userId) === String(authorId));

    // Tag filter
    const matchesTag =
      tag === "All" ||
      tag === "My Recipes" ||
      (r.tags || []).includes(tag);

    return matchesSearch && matchesTag && matchesOwner;
  });

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Search & Filter</h1>

      <div className="mt-4 flex gap-3">
        {/* Search Box */}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search recipes..."
          className="rounded-xl border px-3 py-2"
        />

        {/* Dropdown */}
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-xl border px-3 py-2"
        >
          {tagFilters.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Recipe List */}
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Link
            key={r._id}
            to={`/app/recipe/${r._id}`}
            className="rounded-2xl border p-4 hover:shadow-sm"
          >
            <p className="font-semibold">{r.title}</p>
            <p className="text-xs text-gray-500">
              ⏱ {r.time || "N/A"} · {(r.tags || []).join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
