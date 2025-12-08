// client/src/pages/admin/AdminRecipes.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminRecipes() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all recipes (any status) for admin
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/recipes`);
      const data = res.data;
      const list = Array.isArray(data)
        ? data
        : data.recipes || data.data || [];
      setRows(list);
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
      const res = await axios.patch(
        `${API_BASE}/admin/recipes/${id}/status`,
        { status }
      );
      const updated = res.data;

      // IMPORTANT: update local state instead of filtering out
      setRows((rs) =>
        rs.map((r) =>
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
        return "bg-amber-100 text-amber-700"; // pending / unknown
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
          rows.map((r, index) => {
            const title = r.title || r.name || "Untitled";
            const author =
              r.author?.name ||
              r.authorName ||
              r.user?.name ||
              r.createdBy ||
              "Unknown";
            const status = r.status || "pending";
            const image =
              r.image ||
              r.cover ||
              "https://via.placeholder.com/400x300?text=Recipe";

            return (
              <article
                key={r._id || index}
                className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900"
              >
                <div className="aspect-[4/3] bg-gray-100 dark:bg-neutral-800">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                    ⏱ {r.time || r.cookTime || "N/A"} · by {author}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${statusClasses(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>

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
