import React from "react";
import RecipeCard from "./ui/RecipeCard";
import recipes from "../data/recipes.json";

export default function FeaturedRecipes() {
  return (
    <section aria-labelledby="featured" className="lg:pr-2">
      <h2 id="featured" className="text-2xl font-bold tracking-tight">Featured Recipes</h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {recipes.map((r, i) => (
          <RecipeCard key={i} image={r.image} title={r.title} meta={r.meta} />
        ))}
      </div>
    </section>
  );
}
