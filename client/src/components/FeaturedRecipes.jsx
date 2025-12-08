import React from "react";
import RecipeCard from "./ui/RecipeCard";
import recipes from "../data/recipes.json";

const FE_BASE = "https://lunchbox-wlgs.vercel.app";

export default function FeaturedRecipes() {
  return (
    <section aria-labelledby="featured" className="lg:pr-2">
      <h2 id="featured" className="text-2xl font-bold tracking-tight">
        Featured Recipes
      </h2>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {recipes.map((r, i) => {
          const image = r.image.startsWith("/images/")
            ? FE_BASE + r.image
            : r.image;

          return (
            <RecipeCard
              key={i}
              image={image}
              title={r.title}
              meta={r.meta}
            />
          );
        })}
      </div>
    </section>
  );
}
