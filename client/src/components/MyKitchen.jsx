import { useState } from "react";
import data from "../data/kitchen.json";
import KitchenCard from "./ui/Card";
import React from "react";
function GroceryList() {
  return (
    <ul className="mt-4 space-y-2">
      {data.grocery.map((g, i) => (
        <li key={i} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2">
          <span>{g.title}</span>
          <span className="text-sm text-gray-500">{g.qty}</span>
        </li>
      ))}
    </ul>
  );
}

function MealPlanner() {
  return (
    <div className="mt-4 grid sm:grid-cols-3 gap-3">
      {data.planner.map((p, i) => (
        <div key={i} className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3">
          <p className="text-xs text-gray-500">{p.day}</p>
          <p className="font-medium">{p.recipe}</p>
        </div>
      ))}
    </div>
  );
}

export default function MyKitchen() {
  const TABS = ["Today's Trending", "Best Seller", "Reviews"];
  const [tab, setTab] = useState(TABS[0]);

  return (
    <section aria-labelledby="kitchen" className="mt-10">
      <h2 id="kitchen" className="text-2xl font-bold tracking-tight">My Kitchen</h2>

      <div className="mt-3 flex gap-6 border-b border-gray-200 dark:border-neutral-800">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-2 -mb-px ${
              tab === t
                ? "border-b-2 border-black dark:border-white font-semibold"
                : "text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Today's Trending" && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.saved.map((k, i) => <KitchenCard key={i} {...k} />)}
        </div>
      )}

      {tab === "Best Seller" && <GroceryList />}

      {tab === "Reviews" && <MealPlanner />}
    </section>
  );
}
