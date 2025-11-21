// src/pages/app/RecipeDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";
import { useAuth } from "../../contexts/AuthContext";

export default function RecipeDetails() {
  const { id } = useParams();

  const {
    recipes,
    loading,
    err,
    refresh,
    addReview,
    addComment,
    toggleBookmark,
    PLACEHOLDER,
  } = useRecipes();
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
        <Link to="/app" className="text-[var(--lb-yellow)] underline">
          Back to feed
        </Link>
      </div>
    );
  }

  // separate state for review + comment
  const [reviewStars, setReviewStars] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [reviewErr, setReviewErr] = useState("");
  const [commentErr, setCommentErr] = useState("");

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewErr("");

    try {
      // 1) send review to backend
      await addReview(r.id, { stars: reviewStars, text: "" });

      // 2) refresh recipes so this page shows the new rating/review
      await refresh();

      // 3) notify user
      alert("Your review was submitted!");

      // 4) reset stars
      setReviewStars(5);
    } catch (e) {
      setReviewErr(e.message || "Failed to submit review");
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    setCommentErr("");

    if (!commentText.trim()) {
      setCommentErr("Comment cannot be empty.");
      return;
    }

    try {
      // 1) send comment to backend
      await addComment(r.id, commentText.trim());

      // 2) refresh recipes so this page shows the new comment
      await refresh();

      // 3) notify user
      alert("Your comment was submitted!");

      // 4) reset input
      setCommentText("");
    } catch (e) {
      setCommentErr(e.message || "Failed to submit comment");
    }
  };

  // Combine reviews + comments into one list for display
  const entries = [
    ...(r.reviews || []).map((rev) => ({
      by:
        rev.by?.name ||
        rev.by ||
        rev.author?.username ||
        rev.author?.name ||
        "Anonymous",
      stars: rev.stars ?? rev.rating ?? null,
      text: rev.text ?? rev.comment ?? "",
    })),
    ...(r.comments || []).map((c) => ({
      by: c.name || c.email || "Anonymous",
      stars:
        typeof c.rating === "number" && !Number.isNaN(c.rating)
          ? c.rating
          : null,
      text: c.text || "",
    })),
  ];

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <img
          src={r.image || PLACEHOLDER}
          alt={r.title}
          className="w-full object-cover"
          onError={(e) => {
            e.target.src = PLACEHOLDER;
          }}
        />
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

        {/* ================= REVIEWS ================= */}
        <h3 className="mt-6 font-semibold">Reviews</h3>

        {reviewErr && (
          <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {reviewErr}
          </p>
        )}

        <form onSubmit={submitReview} className="mt-2 flex items-center gap-2">
          <select
            value={reviewStars}
            onChange={(e) => setReviewStars(Number(e.target.value))}
            className="rounded-lg border px-2 py-1"
          >
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>
                {s}★
              </option>
            ))}
          </select>
          <button className="px-3 py-2 rounded-lg bg-[var(--lb-yellow)] font-semibold">
            Submit review
          </button>
        </form>

        {/* ================= COMMENTS ================= */}
        <h3 className="mt-6 font-semibold">Comments</h3>

        {commentErr && (
          <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {commentErr}
          </p>
        )}

        <form onSubmit={submitComment} className="mt-2 flex items-center gap-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment"
            className="flex-1 rounded-lg border px-3 py-2"
          />
          <button className="px-3 py-2 rounded-lg bg-[var(--lb-yellow)] font-semibold">
            Submit comment
          </button>
        </form>

        {/* ================= LIST ================= */}
        <ul className="mt-3 space-y-2">
          {entries.map((rev, ix) => (
            <li key={ix} className="rounded-lg border px-3 py-2">
              <b>{rev.by}</b>
              {rev.stars != null ? <> — {rev.stars}★</> : null}
              {rev.text && <p className="text-sm">{rev.text}</p>}
            </li>
          ))}
          {entries.length === 0 && (
            <li className="text-sm text-gray-500">
              No reviews or comments yet.
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
