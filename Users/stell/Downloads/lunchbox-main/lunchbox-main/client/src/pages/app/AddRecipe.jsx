import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";

export default function AddRecipe() {
  const { addRecipe } = useRecipes();
  const nav = useNavigate();
  const [form, setForm] = useState({ title:"", time:"", image:"/images/bowl.jpg", ingredients:"", steps:"", tags:"" });

  const submit = (e) => {
    e.preventDefault();
    addRecipe({
      title: form.title,
      time: form.time || "20 min",
      image: form.image,
      ingredients: form.ingredients.split(",").map(s=>s.trim()),
      steps: form.steps.split("\n"),
      tags: form.tags.split(",").map(s=>s.trim())
    });
    nav("/app");
  };

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-extrabold">Add Recipe</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {[
          ["Title","title"],["Time (e.g. 20 min)","time"],["Image URL","image"],
        ].map(([label,name])=>(
          <label key={name} className="block">
            <span className="text-sm font-medium">{label}</span>
            <input name={name} value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})}
              className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"/>
          </label>
        ))}
        <label className="block">
          <span className="text-sm font-medium">Ingredients (comma-separated)</span>
          <input name="ingredients" value={form.ingredients} onChange={e=>setForm({...form,ingredients:e.target.value})}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"/>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Steps (one per line)</span>
          <textarea rows={4} name="steps" value={form.steps} onChange={e=>setForm({...form,steps:e.target.value})}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"/>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Tags (comma-separated)</span>
          <input name="tags" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}
            className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2"/>
        </label>
        <button className="w-full py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold text-black">Submit Recipe</button>
      </form>
    </section>
  );
}