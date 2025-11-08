// src/pages/app/RecipeDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";
import { useAuth } from "../../contexts/AuthContext";

export default function RecipeDetails() {
  const { id } = useParams();
  const { recipes, loading, err, refresh, addReview, toggleBookmark } = useRecipes();
  const { user } = useAuth();

  // Ensure we have data when landing directly on this page
  useEffect(() => {
    if (!loading && (!recipes || recipes.length === 0)) {
      refresh();
    }
  }, [recipes, loading, refresh]);

  // global states first
  if (loading) return <p>Loading recipes…</p>;
  if (err) return <p className="text-red-600">Error: {err}</p>;
  if (!recipes || recipes.length === 0)
    return <p>No recipes yet. Be the first to add one!</p>;

  // find the recipe
  const r = useMemo(
    () => recipes.find((x) => String(x.id) === String(id)),
    [recipes, id]
  );

  if (!r) {
    return (
      <div className="space-y-3">
        <p>Recipe not found.</p>
        <Link to="/app" className="text-[var(--lb-yellow)] underline">Back to feed</Link>
      </div>
    );
  }

  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");
  const [localErr, setLocalErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLocalErr("");
    try {
      await addReview(r.id, { stars, text });
      setText("");
      setStars(5);
    } catch (e) {
      setLocalErr(e.message || "Failed to submit review");
    }
  };

  // Normalize reviews from server/local
  const reviews = (r.reviews || []).map((rev) => ({
    by:
      rev.by?.name ||
      rev.by ||
      rev.author?.username ||
      rev.author?.name ||
      "Anonymous",
    stars: rev.stars ?? rev.rating ?? 5,
    text: rev.text ?? rev.comment ?? "",
  }));

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <img src={r.image} alt={r.title} className="w-full object-cover" />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">{r.title}</h1>
          <button
            onClick={() => toggleBookmark(r.id)}
            className="px-3 py-1 rounded-lg border"
          >
            {r.bookmarked ? "Unbookmark" : "Bookmark"}
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          ⏱ {r.time} · ⭐ {r.rating}
        </p>

        <h3 className="mt-4 font-semibold">Ingredients</h3>
        <ul className="list-disc ml-5 text-sm">
          {(r.ingredients || []).map((i, ix) => (
            <li key={ix}>{i}</li>
          ))}
        </ul>

        <h3 className="mt-4 font-semibold">Steps</h3>
        <ol className="list-decimal ml-5 text-sm space-y-1">
          {(r.steps || []).map((s, ix) => (
            <li key={ix}>{s}</li>
          ))}
        </ol>

        <h3 className="mt-6 font-semibold">Reviews</h3>

        {localErr && (
          <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {localErr}
          </p>
        )}

        <form onSubmit={submit} className="mt-2 flex items-center gap-2">
          <select
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
            className="rounded-lg border px-2 py-1"
          >
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s}★
              </option>
            ))}
          </select>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment"
            className="flex-1 rounded-lg border px-3 py-2"
          />
          <button className="px-3 py-2 rounded-lg bg-[var(--lb-yellow)] font-semibold">
            Submit
          </button>
        </form>

        <ul className="mt-3 space-y-2">
          {reviews.map((rev, ix) => (
            <li key={ix} className="rounded-lg border px-3 py-2">
              <b>{rev.by}</b> — {rev.stars}★
              <p className="text-sm">{rev.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
