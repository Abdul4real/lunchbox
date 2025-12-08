import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const RecipesContext = createContext();
export const useRecipes = () => useContext(RecipesContext);

const API = import.meta.env.VITE_API_URL;

export default function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------
  // Fetch Recipes
  // -------------------------
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch(`${API}/recipes`);
        const data = await res.json();
        setRecipes(data.data || data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // -------------------------
  // Create Recipe (works)
  // -------------------------
  const addRecipe = (recipe) =>
    setRecipes((rs) => [recipe, ...rs]);

  // -------------------------
  // UPDATE RECIPE (now calls backend)
  // -------------------------
  const updateRecipe = async (id, patch) => {
    try {
      const res = await fetch(`${API}/recipes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lb_token")}`
        },
        body: JSON.stringify(patch),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message);

      setRecipes((rs) =>
        rs.map((r) => (r._id === id ? updated : r))
      );
    } catch (err) {
      console.error("UPDATE FAILED:", err);
    }
  };

  // -------------------------
  // DELETE RECIPE (now calls backend)
  // -------------------------
  const deleteRecipe = async (id) => {
    try {
      const res = await fetch(`${API}/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lb_token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setRecipes((rs) => rs.filter((r) => r._id !== id));
    } catch (err) {
      console.error("DELETE FAILED:", err);
    }
  };

  // -------------------------
  // ADD REVIEW (now calls backend)
  // -------------------------
  const addReview = async (id, review) => {
    try {
      const res = await fetch(`${API}/recipes/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lb_token")}`,
        },
        body: JSON.stringify(review),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.message);

      setRecipes((rs) =>
        rs.map((r) => (r._id === id ? updated : r))
      );
    } catch (err) {
      console.error("REVIEW FAILED:", err);
    }
  };

  // -------------------------
  // BOOKMARK (now calls backend)
  // -------------------------
  const toggleBookmark = async (id) => {
    try {
      const res = await fetch(`${API}/recipes/${id}/bookmark`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lb_token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Local mirror only
      setRecipes((rs) =>
        rs.map((r) =>
          r._id === id ? { ...r, bookmarked: !r.bookmarked } : r
        )
      );
    } catch (err) {
      console.error("BOOKMARK FAILED:", err);
    }
  };

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
