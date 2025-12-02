import React from "react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "../../contexts/RecipesContext";

export default function SearchRecipes() {
  const { recipes } = useRecipes();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");

  const tags = useMemo(() => ["All", ...new Set(recipes.flatMap(r=>r.tags || []))], [recipes]);

  const filtered = recipes.filter(r =>
    (tag === "All" || r.tags?.includes(tag)) &&
    r.title.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Search & Filter</h1>
      <div className="mt-4 flex gap-3">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search keyword"
               className="rounded-xl border px-3 py-2"/>
        <select value={tag} onChange={e=>setTag(e.target.value)} className="rounded-xl border px-3 py-2">
          {tags.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <Link key={r.id} to={`/app/recipe/${r.id}`} className="rounded-2xl border p-4 hover:shadow-sm">
            <p className="font-semibold">{r.title}</p>
            <p className="text-xs text-gray-500">⏱ {r.time} · {r.tags?.join(", ")}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}