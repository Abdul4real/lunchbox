import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const RecipesContext = createContext();
export const useRecipes = () => useContext(RecipesContext);

export default function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch recipes from backend
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("http://localhost:5000/api/recipes");
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();

        // If backend sends { total, page, limit, data }
        const recipesData = data.data || data;

        setRecipes(recipesData);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // Add a recipe locally (after creation on backend)
  const addRecipe = (recipe) =>
    setRecipes((rs) => [recipe, ...rs]);

  // Update recipe locally
  const updateRecipe = (id, patch) =>
    setRecipes((rs) =>
      rs.map((r) => (r._id === id ? { ...r, ...patch } : r))
    );

  // Delete recipe locally
  const deleteRecipe = (id) =>
    setRecipes((rs) => rs.filter((r) => r._id !== id));

  // Add review locally
  const addReview = (id, review) =>
    setRecipes((rs) =>
      rs.map((r) =>
        r._id === id ? { ...r, reviews: [review, ...(r.reviews || [])] } : r
      )
    );

  // Toggle bookmark locally
  const toggleBookmark = (id) =>
    setRecipes((rs) =>
      rs.map((r) =>
        r._id === id ? { ...r, bookmarked: !r.bookmarked } : r
      )
    );

  const value = useMemo(
    () => ({
      recipes,
      loading,
      error,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      addReview,
      toggleBookmark,
    }),
    [recipes, loading, error]
  );

  return (
    <RecipesContext.Provider value={value}>
      {children}
    </RecipesContext.Provider>
  );
}
