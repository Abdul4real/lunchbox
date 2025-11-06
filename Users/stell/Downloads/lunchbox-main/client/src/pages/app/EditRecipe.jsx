import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";
import { useState } from "react";

export default function EditRecipe() {
  const { id } = useParams();
  const { recipes, updateRecipe, deleteRecipe } = useRecipes();
  const nav = useNavigate();
  const r = recipes.find(x => String(x.id) === id);
  const [form, setForm] = useState(r ? { title:r.title, time:r.time, image:r.image } : {});

  if (!r) return <p>Recipe not found.</p>;

  const submit = (e) => { e.preventDefault(); updateRecipe(r.id, form); nav(`/app/recipe/${r.id}`); };
  const remove = () => { if (confirm("Delete recipe permanently?")) { deleteRecipe(r.id); nav("/app"); } };

  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-extrabold">Edit Recipe</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        {["title","time","image"].map((n)=>(
          <label key={n} className="block">
            <span className="text-sm font-medium capitalize">{n}</span>
            <input value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})}
              className="mt-1 w-full rounded-xl border px-3 py-2"/>
          </label>
        ))}
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold">Save</button>
          <button type="button" onClick={remove} className="px-4 py-2 rounded-xl border">Delete</button>
        </div>
      </form>
    </section>
  );
}