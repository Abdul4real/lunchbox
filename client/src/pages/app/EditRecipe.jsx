// src/pages/app/EditRecipe.jsx
import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "lb_token";

export default function EditRecipe() {
  const { id } = useParams();                 // route: /app/recipe/:id/edit
  const nav = useNavigate();
  const { recipes, refresh } = useRecipes();

  // find by _id or id
  const recipe = useMemo(
    () => recipes.find((r) => String(r._id || r.id) === String(id)),
    [recipes, id]
  );

  const [form, setForm] = useState(() => {
    if (!recipe) return { title: "", description: "", category: "", time: "", imageFile: null };
    // read prepTime if present
    const prep = recipe?.metadata?.prepTime ?? "";
    return {
      title: recipe.title || "",
      description: recipe.description || "",
      category: recipe.category || "",
      time: prep === undefined || prep === null ? "" : String(prep),
      imageFile: null,
    };
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (!recipe) return <p className="p-4">Recipe not found.</p>;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (!token) return setErr("Please sign in first.");

    // Build a FormData for PUT (so we can optionally include a new image)
    const data = new FormData();
    if (form.title?.trim()) data.append("title", form.title.trim());
    data.append("description", form.description || "");
    data.append("category", form.category || "");

    // keep only what you edit here (prepTime), preserve rest on server
    const metadata = {
      ...(recipe.metadata || {}),
      prepTime: form.time ? Number(form.time) : undefined,
    };
    data.append("metadata", JSON.stringify(metadata));

    if (form.imageFile) {
      data.append("image", form.imageFile); // optional replacement
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/users/recipes/${recipe._id || recipe.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || json?.error || "Failed to update recipe");

      await refresh();
      nav(`/app/recipe/${recipe._id || recipe.id}`);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!confirm("Delete recipe permanently?")) return;

    const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    if (!token) return setErr("Please sign in first.");

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/users/recipes/${recipe._id || recipe.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || json?.error || "Failed to delete recipe");

      await refresh();
      nav("/app");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-extrabold">Edit Recipe</h1>

      {err && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {err}
        </p>
      )}

      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Description</span>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <input
            name="category"
            value={form.category}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Prep Time (minutes)</span>
          <input
            name="time"
            value={form.time}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Replace Image (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>

        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={remove}
            className="px-4 py-2 rounded-xl border"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </form>
    </section>
  );
}
