import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";

export default function EditRecipe() {
  const { id } = useParams();
  const { recipes, updateRecipe, deleteRecipe } = useRecipes();
  const nav = useNavigate();

  const r = recipes.find(x => x._id === id);
  const [form, setForm] = useState(r ? {
    title: r.title,
    time: r.time,
    image: r.image,
    ingredients: r.ingredients.join(", "), // convert array to string
    steps: r.steps.join("\n")            // separate steps by newline
  } : {});

  if (!r) return <p>Recipe not found.</p>;

  const submit = (e) => {
    e.preventDefault();

    // Convert ingredients and steps back to arrays
    const updatedRecipe = {
      ...form,
      ingredients: form.ingredients.split(",").map(i => i.trim()).filter(Boolean),
      steps: form.steps.split("\n").map(s => s.trim()).filter(Boolean)
    };

    updateRecipe(r._id, updatedRecipe);
    nav(`/app/recipe/${r._id}`);
  };

  const remove = () => {
    if (confirm("Delete recipe permanently?")) {
      deleteRecipe(r._id);
      nav("/app");
    }
  };

  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-extrabold">Edit Recipe</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {/* Title, Time, Image */}
        {["title", "time", "image"].map(n => (
          <label key={n} className="block">
            <span className="text-sm font-medium capitalize">{n}</span>
            <input
              value={form[n]}
              onChange={e => setForm({ ...form, [n]: e.target.value })}
              className="mt-1 w-full rounded-xl border px-3 py-2"
            />
          </label>
        ))}

        {/* Ingredients */}
        <label className="block">
          <span className="text-sm font-medium">Ingredients (comma separated)</span>
          <textarea
            value={form.ingredients}
            onChange={e => setForm({ ...form, ingredients: e.target.value })}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            rows={3}
          />
        </label>

        {/* Steps */}
        <label className="block">
          <span className="text-sm font-medium">Steps (one per line)</span>
          <textarea
            value={form.steps}
            onChange={e => setForm({ ...form, steps: e.target.value })}
            className="mt-1 w-full rounded-xl border px-3 py-2"
            rows={5}
          />
        </label>

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold">Save</button>
          <button type="button" onClick={remove} className="px-4 py-2 rounded-xl border">Delete</button>
        </div>
      </form>
    </section>
  );
}
