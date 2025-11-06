import React from "react";
import { useState } from "react";
import seed from "../../data/admin/recipes.json";

export default function AdminRecipes() {
  const [rows, setRows] = useState(seed);

  const setStatus = (id, status) => setRows(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  const edit = (id) => alert(`Open edit modal for recipe #${id} (title, tags, time, cover).`);
  const remove = (id) => setRows(rs => rs.filter(r => r.id !== id));

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Manage Recipes</h1>
      <p className="text-gray-600 dark:text-neutral-400">• Approve/Reject submissions • Edit recipe details • Remove recipe</p>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map(r => (
          <article key={r.id} className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900">
            <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-800">
              <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">⏱ {r.time} · by {r.author}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${r.status === "approved" ? "bg-green-100 text-green-700" : r.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {r.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={()=>setStatus(r.id,"approved")} className="px-2 py-1 rounded-lg border">Approve</button>
                <button onClick={()=>setStatus(r.id,"rejected")} className="px-2 py-1 rounded-lg border">Reject</button>
                <button onClick={()=>edit(r.id)} className="px-2 py-1 rounded-lg border">Edit</button>
                <button onClick={()=>remove(r.id)} className="px-2 py-1 rounded-lg border">Remove</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}