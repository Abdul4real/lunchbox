// src/pages/app/RecipeDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";
import { useAuth } from "../../contexts/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
// 👇 MUST match SignIn.jsx (TOKEN_KEY = "lb_token")
const TOKEN_KEY = "lb_token";

const getToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";

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

  // separate state for review + comment submit
  const [reviewStars, setReviewStars] = useState(5);
  const [commentText, setCommentText] = useState("");
  const [reviewErr, setReviewErr] = useState("");
  const [commentErr, setCommentErr] = useState("");

  // local copies of reviews/comments so edits & deletes update instantly
  const [localReviews, setLocalReviews] = useState([]);
  const [localComments, setLocalComments] = useState([]);

  // sync comments from recipe document
  useEffect(() => {
    setLocalComments(Array.isArray(r.comments) ? r.comments : []);
  }, [r]);

  // fetch reviews from backend so we always have the latest
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API}/api/users/recipes/${r.id}/reviews`);
        const data = await res.json();
        if (!res.ok) {
          console.error(
            data?.error || data?.message || "Failed to load reviews"
          );
          return;
        }
        setLocalReviews(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load reviews", e);
      }
    };

    if (r?.id) fetchReviews();
  }, [r.id]);

  // average rating displayed next to the yellow star
  const avgRating = useMemo(() => {
    const nums = (localReviews || [])
      .map((rev) =>
        typeof rev.rating === "number"
          ? rev.rating
          : typeof rev.stars === "number"
          ? rev.stars
          : null
      )
      .filter((v) => typeof v === "number" && !Number.isNaN(v));

    if (!nums.length) return 0;
    const sum = nums.reduce((a, b) => a + b, 0);
    return Number(sum / nums.length).toFixed(1); // e.g. "4.5"
  }, [localReviews]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewErr("");

    try {
      const result = await addReview(r.id, { stars: reviewStars, text: "" });

      // add new review locally, so rating & list update immediately
      if (result?.review) {
        setLocalReviews((prev) => [result.review, ...(prev || [])]);
      } else {
        // fallback: refetch reviews
        try {
          const res = await fetch(`${API}/api/users/recipes/${r.id}/reviews`);
          const data = await res.json();
          if (res.ok && Array.isArray(data)) setLocalReviews(data);
        } catch {}
      }

      alert("Your review was submitted!");
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
      await addComment(r.id, commentText.trim());

      await refresh(); // refresh recipe to get latest comments from DB

      alert("Your comment was submitted!");
      setCommentText("");
    } catch (e) {
      setCommentErr(e.message || "Failed to submit comment");
    }
  };

  const currentUserId = user?._id || user?.id;
  const currentUserEmail = user?.email || "";

  // Helpers: detect if current user owns review/comment
  const isReviewOwner = (rev) => {
    const author = rev.author || {};
    if (author.userId && currentUserId) {
      if (String(author.userId) === String(currentUserId)) return true;
    }
    if (author.email && currentUserEmail) {
      if (author.email === currentUserEmail) return true;
    }
    if (author.username && user?.name && author.username === user.name)
      return true;
    return false;
  };

  const isCommentOwner = (c) => {
    if (c.userId && currentUserId) {
      if (String(c.userId) === String(currentUserId)) return true;
    }
    if (c.email && currentUserEmail) {
      if (c.email === currentUserEmail) return true;
    }
    if (c.name && user?.name && c.name === user.name) return true;
    return false;
  };

  // helper to build headers with optional token
  const authHeaders = (extra = {}) => {
    const token = getToken();
    return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
  };

  // EDIT handler – updates backend then local state only (no navigation)
  const handleEditEntry = async (entry) => {
    const newText = window.prompt("Edit your text:", entry.text || "");
    if (newText == null) return; // cancelled
    if (!newText.trim()) {
      alert("Text cannot be empty.");
      return;
    }

    try {
      if (entry.type === "comment") {
        const res = await fetch(
          `${API}/api/users/recipes/${r.id}/comments/${entry.id}`,
          {
            method: "PUT",
            headers: authHeaders({
              "Content-Type": "application/json",
            }),
            body: JSON.stringify({ text: newText }),
          }
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data?.error || data?.message || "Failed to update comment"
          );

        // update local comments immediately
        setLocalComments((prev) =>
          prev.map((c) =>
            String(c._id || c.id) === String(entry.id)
              ? { ...c, text: newText }
              : c
          )
        );
      } else {
        const res = await fetch(`${API}/api/users/reviews/${entry.id}`, {
          method: "PUT",
          headers: authHeaders({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ comment: newText }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(
            data?.error || data?.message || "Failed to update review"
          );

        // update local reviews immediately
        setLocalReviews((prev) =>
          prev.map((rev) =>
            String(rev._id || rev.id) === String(entry.id)
              ? { ...rev, comment: newText, text: newText }
              : rev
          )
        );
      }

      alert("Updated successfully!");
    } catch (e) {
      alert(e.message || "Failed to update");
    }
  };

  // DELETE handler – remove from backend then local state only
  const handleDeleteEntry = async (entry) => {
    const ok = window.confirm("Are you sure you want to delete this?");
    if (!ok) return;

    try {
      if (entry.type === "comment") {
        const res = await fetch(
          `${API}/api/users/recipes/${r.id}/comments/${entry.id}`,
          {
            method: "DELETE",
            headers: authHeaders(),
          }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok)
          throw new Error(
            data?.error || data?.message || "Failed to delete comment"
          );

        setLocalComments((prev) =>
          prev.filter((c) => String(c._id || c.id) !== String(entry.id))
        );
      } else {
        const res = await fetch(`${API}/api/users/reviews/${entry.id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok)
          throw new Error(
            data?.error || data?.message || "Failed to delete review"
          );

        setLocalReviews((prev) =>
          prev.filter((rev) => String(rev._id || rev.id) !== String(entry.id))
        );
      }

      alert("Deleted successfully!");
    } catch (e) {
      alert(e.message || "Failed to delete");
    }
  };

  // Build structured entries from local state
  const reviewEntries = (localReviews || []).map((rev) => ({
    type: "review",
    id: rev._id || rev.id,
    by:
      rev.by?.name ||
      rev.by ||
      rev.author?.username ||
      rev.author?.name ||
      "Anonymous",
    stars: rev.stars ?? rev.rating ?? null,
    text: rev.text ?? rev.comment ?? "",
    isOwner: isReviewOwner(rev),
  }));

  const commentEntries = (localComments || []).map((c) => ({
    type: "comment",
    id: c._id || c.id,
    by: c.name || c.email || "Anonymous",
    stars:
      typeof c.rating === "number" && !Number.isNaN(c.rating)
        ? c.rating
        : null,
    text: c.text || "",
    isOwner: isCommentOwner(c),
  }));

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
          ⏱ {r.time} · ⭐ {avgRating}
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

        {/* ================= REVIEWS SUBMIT + LIST ================= */}
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

        {/* Reviews list */}
        <ul className="mt-3 space-y-2">
          {reviewEntries.length > 0 ? (
            reviewEntries.map((rev, ix) => (
              <li key={ix} className="rounded-lg border px-3 py-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <b>{rev.by}</b> — {rev.stars}★
                    {rev.text && <p className="text-sm">{rev.text}</p>}
                  </div>

                  {rev.isOwner && (
                    <div className="flex flex-col items-end gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => handleEditEntry(rev)}
                        className="px-2 py-1 border rounded-md hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(rev)}
                        className="px-2 py-1 border rounded-md text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">No reviews yet.</li>
          )}
        </ul>

        {/* ================= COMMENTS SUBMIT + LIST ================= */}
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

        <ul className="mt-3 space-y-2">
          {commentEntries.length > 0 ? (
            commentEntries.map((c, ix) => (
              <li key={ix} className="rounded-lg border px-3 py-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <b>{c.by}</b>
                    {c.text && <p className="text-sm">{c.text}</p>}
                  </div>

                  {c.isOwner && (
                    <div className="flex flex-col items-end gap-1 text-xs">
                      <button
                        type="button"
                        onClick={() => handleEditEntry(c)}
                        className="px-2 py-1 border rounded-md hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(c)}
                        className="px-2 py-1 border rounded-md text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500">No comments yet.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
