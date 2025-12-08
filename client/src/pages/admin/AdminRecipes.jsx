// client/src/pages/admin/AdminRecipes.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_BASE = API.replace(/\/api\/?$/, "");

export default function AdminRecipes() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // IMAGE FIXER: handles ALL valid image types
  // ---------------------------------------
  const fixImageUrl = (img) => {
    if (!img) return "/placeholder.png";

    if (img.startsWith("http")) return img;           // Full external URL
    if (img.startsWith("/images/")) return img;       // Frontend static images
    if (img.startsWith("/uploads/")) return `${API_BASE}${img}`; // Backend uploads
    if (img.includes("uploads")) return `${API_BASE}/${img}`; // Fallback for weird paths

    return "/placeholder.png";
  };

  // Load all recipes
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/recipes`);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.recipes || res.data.data || [];
      setRows(data);
    } catch (err) {
      console.error("Failed to load recipes:", err);
      alert("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Approve / Reject / Revoke
  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${API}/admin/recipes/${id}/status`, {
        status,
      });

      const updated = res.data;

      setRows((prev) =>
        prev.map((r) =>
          String(r._id) === String(updated._id) ? { ...r, status } : r
        )
      );
    } catch (err) {
      console.error("Failed to update recipe status:", err);
      alert("Failed to update recipe status");
    }
  };

  const statusClasses = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
      case "revoked":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700"; // pending
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Manage Recipes</h1>
      <p className="text-gray-600 dark:text-neutral-400">
        • Approve/Reject submissions • Revoke recipe visibility
      </p>

      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && (
          <div className="col-span-full p-4 text-sm text-gray-500">
            Loading recipes…
          </div>
        )}

        {!loading &&
          rows.map((r, i) => {
            const title = r.title || "Untitled";
            const author =
              r.author?.name ||
              r.authorName ||
              r.user?.name ||
              r.createdBy ||
              "Unknown";

            const image = fixImageUrl(r.image);

            return (
              <article
                key={r._id || i}
                className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900"
              >
                <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-800">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                    ⏱ {r.time || "N/A"} · by {author}
                  </p>

                  {/* Status Badge */}
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${statusClasses(
                        r.status
                      )}`}
                    >
                      {r.status || "pending"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(r._id, "approved")}
                      className="px-2 py-1 rounded-lg border text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(r._id, "rejected")}
                      className="px-2 py-1 rounded-lg border text-xs"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateStatus(r._id, "revoked")}
                      className="px-2 py-1 rounded-lg border text-xs"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

        {!loading && rows.length === 0 && (
          <div className="col-span-full p-4 text-center text-sm text-gray-500">
            No recipes found.
          </div>
        )}
      </div>
    </section>
  );
}
