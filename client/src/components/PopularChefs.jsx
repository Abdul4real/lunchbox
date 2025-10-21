import React from "react";
import ChefCard from "./ui/ChefCard";
import CHEFS from "../data/chefs.json";

export default function PopularChefs() {
  return (
    <section aria-labelledby="chefs" className="mt-10">
      <h2 id="chefs" className="text-2xl font-bold tracking-tight">Popular Chefs</h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {CHEFS.map((c, i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-neutral-800 p-4 bg-white dark:bg-neutral-900">
            <ChefCard {...c} />
          </div>
        ))}
      </div>
    </section>
  );
}
