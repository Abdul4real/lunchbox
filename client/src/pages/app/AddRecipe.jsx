import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddRecipe() {
  const nav = useNavigate();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const TOKEN_KEY = "lb_token";

  const [form, setForm] = useState({
    title: "",
    time: "",
    imageFile: null,     // File
    ingredients: "",
    steps: "",
    tags: "",
    category: "",
    description: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.title.trim()) return setErr("Title is required");
    if (!form.imageFile) return setErr("Please select an image");

    const data = new FormData();
    data.append("title", form.title.trim());
    data.append("description", form.description || "");
    data.append("category", form.category || "");

    const ingredients = form.ingredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    const instructions = form.steps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    data.append("ingredients", JSON.stringify(ingredients));
    data.append("instructions", JSON.stringify(instructions));
    // keep it simple: store 'time' as prepTime; you can extend later
    data.append("metadata", JSON.stringify({ prepTime: Number(form.time) || 20, tags: form.tags ? form.tags.split(",").map(t=>t.trim()).filter(Boolean) : [] }));

    data.append("image", form.imageFile);

    try {
      setLoading(true);
      const token = localStorage.getItem(TOKEN_KEY); // <-- matches SignIn storage
      const res = await fetch(`${API}/api/users/recipes`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || json?.error || "Failed to add recipe");

      alert("Recipe added!");
      nav("/app");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-extrabold">Add Recipe</h1>

      {err && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {err}
        </p>
      )}

      <form onSubmit={submit} className="mt-4 space-y-3">
        {/* Title */}
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        {/* Prep time (minutes) */}
        <label className="block">
          <span className="text-sm font-medium">Prep Time (minutes)</span>
          <input
            name="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        {/* Category (optional) */}
        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <input
            name="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        {/* Description (optional) */}
        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            rows={3}
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        {/* Image file (required) */}
        <label className="block">
          <span className="text-sm font-medium">Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        {/* Ingredients */}
        <label className="block">
          <span className="text-sm font-medium">Ingredients (comma-separated)</span>
          <input
            name="ingredients"
            value={form.ingredients}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        {/* Steps */}
        <label className="block">
          <span className="text-sm font-medium">Steps (one per line)</span>
          <textarea
            rows={4}
            name="steps"
            value={form.steps}
            onChange={(e) => setForm({ ...form, steps: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        {/* Tags (optional) */}
        <label className="block">
          <span className="text-sm font-medium">Tags (comma-separated)</span>
          <input
            name="tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"
          />
        </label>

        <button
          className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Recipe"}
        </button>
      </form>
    </section>
  );
}
