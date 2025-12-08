import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";

const API = import.meta.env.VITE_API_URL;
const categories = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Other"];

export default function AddRecipe() {
  const { addRecipe } = useRecipes();
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: "",
    time: "",
    imageFile: null,
    ingredients: "",
    steps: "",
    tags: "",
    category: "Breakfast",
  });
  const [preview, setPreview] = useState(null); // <-- preview URL
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleFileChange = (file) => {
    setForm({ ...form, imageFile: file });
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); 
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("time", form.time);
      formData.append("ingredients", form.ingredients);
      formData.append("steps", form.steps);
      formData.append("tags", form.tags);
      formData.append("category", form.category);
      if (form.imageFile) formData.append("image", form.imageFile);

      const res = await fetch(`${API}/recipes`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("lb_token")}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to add recipe");

      addRecipe(data);
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
      {err && <p className="text-red-600 mt-2">{err}</p>}

      <form onSubmit={submit} className="mt-4 space-y-3">
        {/* Title & Time */}
        {[
          ["Title", "title"],
          ["Time (e.g. 20 min)", "time"]
        ].map(([label, name]) => (
          <label key={name} className="block">
            <span className="text-sm font-medium">{label}</span>
            <input
              name={name}
              value={form[name]}
              onChange={(e) => setForm({ ...form, [name]: e.target.value })}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </label>
        ))}

        {/* Image Upload */}
        <label className="block">
          <span className="text-sm font-medium">Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>

        {/* Preview */}
        {preview && (
          <div className="mt-2">
            <span className="text-sm font-medium">Preview:</span>
            <img src={preview} alt="Preview" className="mt-1 w-full rounded-xl object-cover max-h-64" />
          </div>
        )}

        {/* Category */}
        <label className="block">
          <span className="text-sm font-medium">Category</span>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        {/* Ingredients */}
        <label className="block">
          <span className="text-sm font-medium">Ingredients (comma-separated)</span>
          <input
            name="ingredients"
            value={form.ingredients}
            onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
            className="mt-1 w-full rounded-xl border px-3 py-2"
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
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>

        {/* Tags */}
        <label className="block">
          <span className="text-sm font-medium">Tags (comma-separated)</span>
          <input
            name="tags"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="mt-1 w-full rounded-xl border px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit Recipe"}
        </button>
      </form>
    </section>
  );
}
