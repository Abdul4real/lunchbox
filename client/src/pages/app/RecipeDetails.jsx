// client/src/pages/app/RecipeDetails.jsx
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";
import { useAuth } from "../../contexts/AuthContext";

const API = import.meta.env.VITE_API_URL;
const API_BASE = API.replace("/api", "");


export default function RecipeDetails() {
  const { id } = useParams();
  const { recipes, addReview, toggleBookmark } = useRecipes();
  const { user } = useAuth();

  const r = recipes.find((x) => x._id === id);
  if (!r) return <p className="text-center mt-10">Recipe not found.</p>;

  // Build proper image URL
const displayImage =
  image.startsWith("/images/")
    ? image // load from frontend (Vercel)
    : image.startsWith("http")
    ? image // external URL
    : `${API_BASE}/uploads/${image}`; // backend uploads


  // ---- OWNER CHECK ----
  const userId = user?._id || user?.id;
  let authorId = r.author;
  if (authorId && typeof authorId === "object") {
    authorId = authorId._id || authorId.id;
  }
  const isOwner = userId && authorId && String(userId) === String(authorId);

  const ingredients = r.ingredients || [];
  const steps = r.steps || [];
  const reviews = r.reviews || [];
  const bookmarked = r.bookmarked || false;

  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");

  const submitReview = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    addReview(r._id, { by: user?.name || "You", stars, text });
    setText("");
    setStars(5);
  };

  return (
    <section className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto p-5">
      {/* Recipe Image */}
      <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <img
            src={displayImage}
            onError={e => (e.currentTarget.src = "/images/Sushi.jpg")}
          />

      </div>


      {/* Recipe Details */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold">{r.title}</h1>

          <button
            onClick={() => toggleBookmark(r._id)}
            className="px-3 py-1 rounded-lg border"
          >
            {bookmarked ? "Unbookmark" : "Bookmark"}
          </button>

          {isOwner && (
            <Link
              to={`/app/recipe/${r._id}/edit`}
              className="px-3 py-1 rounded-lg border bg-[var(--lb-yellow)] font-semibold"
            >
              Edit
            </Link>
          )}
        </div>

        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
          ⏱ {r.time || "N/A"} · ⭐ {r.ratingAvg?.toFixed?.(1) || "N/A"}
        </p>

        {/* Ingredients */}
        <h3 className="mt-4 font-semibold">Ingredients</h3>
        <ul className="list-disc ml-5 text-sm">
          {ingredients.length
            ? ingredients.map((i, ix) => <li key={ix}>{i}</li>)
            : <li>No ingredients listed.</li>}
        </ul>

        {/* Steps */}
        <h3 className="mt-4 font-semibold">Steps</h3>
        <ol className="list-decimal ml-5 text-sm space-y-1">
          {steps.length
            ? steps.map((s, ix) => <li key={ix}>{s}</li>)
            : <li>No steps listed.</li>}
        </ol>

        {/* Add Review */}
        <h3 className="mt-6 font-semibold">Reviews</h3>
        <form onSubmit={submitReview} className="mt-2 flex items-center gap-2">
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

        {/* Existing Reviews */}
        <ul className="mt-3 space-y-2">
          {reviews.length
            ? reviews.map((rev, ix) => (
                <li key={ix} className="rounded-lg border px-3 py-2">
                  <b>{rev.by}</b> — {rev.stars}★
                  <p className="text-sm">{rev.text}</p>
                </li>
              ))
            : <p>No reviews yet.</p>}
        </ul>
      </div>
    </section>
  );
}
