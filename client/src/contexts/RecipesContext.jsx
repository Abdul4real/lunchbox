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

// ✅ IMPORTANT: must match SignIn/Auth (lb_token), otherwise you get "No token"
const TOKEN_KEY = "lb_token";

// inline placeholder (works even if you have no file in /public/images)
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="sans-serif" font-size="24" fill="#9ca3af">No image</text>
    </svg>`
  );

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

  // prefer base64 from API; otherwise use inline placeholder
  let image = PLACEHOLDER;
  if (r?.image?.data) {
    const ct = String(r.image.contentType || "")
      .toLowerCase()
      .startsWith("image/")
      ? r.image.contentType
      : "image/jpeg";
    image = `data:${ct};base64,${r.image.data}`;
  }

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
    // backend will now return both
    reviews: Array.isArray(r.reviews) ? r.reviews : [],
    comments: Array.isArray(r.comments) ? r.comments : [],
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
      if (!res.ok)
        throw new Error(
          data?.message || data?.error || "Failed to load recipes"
        );
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

  // ⭐ Reviews (ratings) – requires token
  const addReview = async (id, review) => {
    const token = getToken();
    if (!token) {
      throw new Error("You must be signed in to add a review.");
    }

    const res = await fetch(`${API}/api/users/recipes/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating: review.stars, comment: review.text || "" }),
    });
    const json = await res.json();
    if (!res.ok)
      throw new Error(json?.message || json?.error || "Failed to add review");
    await refresh();
    return json;
  };

  // ⭐ Comments – text only, but we still send token if present
  const addComment = async (id, text) => {
    const token = getToken();
    const res = await fetch(`${API}/api/users/recipes/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ text }),
    });
    const json = await res.json();
    if (!res.ok)
      throw new Error(
        json?.message || json?.error || "Failed to add comment"
      );
    await refresh();
    return json;
  };

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
      addComment,
      toggleBookmark,
      PLACEHOLDER, // export placeholder for onError use
    }),
    [recipes, loading, err, refresh]
  );

  return (
    <RecipesContext.Provider value={value}>
      {children}
    </RecipesContext.Provider>
  );
}
