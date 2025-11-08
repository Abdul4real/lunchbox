// src/contexts/RecipesContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

const RecipesContext = createContext();
export const useRecipes = () => useContext(RecipesContext);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "token"; // matches your SignIn.jsx

const getToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || "";

// helpers
const toStringList = (arr) =>
  Array.isArray(arr)
    ? arr
        .map((x) =>
          typeof x === "string" ? x : x?.name || x?.description || ""
        )
        .filter(Boolean)
    : [];

/** Convert backend recipe -> UI shape your components expect */
const normalizeRecipe = (r) => {
  const id = String(r._id || r.id);
  const time =
    r?.metadata?.prepTime != null && r?.metadata?.prepTime !== ""
      ? `${r.metadata.prepTime} min`
      : r.time || "";

  const image =
    r?.image?.data
      ? `data:${r.image.contentType};base64,${r.image.data}`
      : "/images/placeholder.jpg";

  return {
    id,
    title: r.title,
    description: r.description || "",
    category: r.category || "",
    time,
    image,
    ingredients: toStringList(r.ingredients),
    steps: toStringList(r.instructions),
    rating: typeof r.rating === "number" ? r.rating : 0,
    bookmarks: typeof r.bookmarks === "number" ? r.bookmarks : 0,
    bookmarked: !!r.bookmarked,
    reviews: Array.isArray(r.reviews) ? r.reviews : [],
    creator: r.creator || "",
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
};

export default function RecipesProvider({ children }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`${API}/api/users/recipes`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || data?.error || "Failed to load recipes");
      setRecipes((data || []).map(normalizeRecipe));
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to load recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ---- CRUD (only addReview used by your RecipeDetails) ----
  const addReview = async (id, review) => {
    const token = getToken();
    const res = await fetch(`${API}/api/users/recipes/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ rating: review.stars, comment: review.text }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || json?.error || "Failed to add review");
    await refresh();
    return json;
  };

  // local-only toggle (no backend route yet)
  const toggleBookmark = (id) =>
    setRecipes((rs) =>
      rs.map((r) =>
        r.id === id
          ? {
              ...r,
              bookmarked: !r.bookmarked,
              bookmarks: r.bookmarked
                ? Math.max(0, (r.bookmarks || 0) - 1)
                : (r.bookmarks || 0) + 1,
            }
          : r
      )
    );

  const value = useMemo(
    () => ({
      recipes,
      loading,
      err,
      refresh,
      addReview,
      toggleBookmark,
    }),
    [recipes, loading, err, refresh]
  );

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>;
}
