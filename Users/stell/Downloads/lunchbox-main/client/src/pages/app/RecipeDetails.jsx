import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useRecipes } from "../../contexts/RecipesContext";
import { useAuth } from "../../contexts/AuthContext";

export default function RecipeDetails() {
  const { id } = useParams();
  const { recipes, addReview, toggleBookmark } = useRecipes();
  const { user } = useAuth();
  const r = recipes.find(x => String(x.id) === id);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState("");

  if (!r) return <p>Recipe not found.</p>;

  const submit = (e) => {
    e.preventDefault();
    addReview(r.id, { by: user?.name || "You", stars, text });
    setText(""); setStars(5);
  };

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <img src={r.image} alt={r.title} className="w-full object-cover" />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">{r.title}</h1>
          <button onClick={()=>toggleBookmark(r.id)} className="px-3 py-1 rounded-lg border">
            {r.bookmarked ? "Unbookmark" : "Bookmark"}
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">⏱ {r.time} · ⭐ {r.rating}</p>

        <h3 className="mt-4 font-semibold">Ingredients</h3>
        <ul className="list-disc ml-5 text-sm">{r.ingredients.map((i,ix)=><li key={ix}>{i}</li>)}</ul>

        <h3 className="mt-4 font-semibold">Steps</h3>
        <ol className="list-decimal ml-5 text-sm space-y-1">{r.steps.map((s,ix)=><li key={ix}>{s}</li>)}</ol>

        <h3 className="mt-6 font-semibold">Reviews</h3>
        <form onSubmit={submit} className="mt-2 flex items-center gap-2">
          <select value={stars} onChange={e=>setStars(Number(e.target.value))} className="rounded-lg border px-2 py-1">
            {[5,4,3,2,1].map(s=> <option key={s} value={s}>{s}★</option>)}
          </select>
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment"
                 className="flex-1 rounded-lg border px-3 py-2" />
          <button className="px-3 py-2 rounded-lg bg-[var(--lb-yellow)] font-semibold">Submit</button>
        </form>

        <ul className="mt-3 space-y-2">
          {r.reviews.map((rev,ix)=>(
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