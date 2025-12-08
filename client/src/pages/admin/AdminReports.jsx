// client/src/pages/admin/AdminReports.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export default function AdminReports() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/reports`);

      const data = res.data;
      const list = Array.isArray(data) ? data : data.data || [];

      setRows(list);
    } catch (err) {
      console.error("Failed to load reports:", err);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/admin/reports/${id}/status`, {
        status,
      });
      await fetchReports();
    } catch (err) {
      console.error("Failed to update report status:", err);
      alert("Failed to update report status");
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Review Reports</h1>
      <p className="text-gray-600 dark:text-neutral-400">
        • View reported content • Approve/Dismiss
      </p>

      <div className="mt-4 overflow-auto rounded-2xl border border-gray-200 dark:border-neutral-800">
        {loading ? (
          <div className="p-4 text-sm text-gray-500">Loading reports…</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-neutral-800">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Recipe</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Reporter</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, index) => {
                const recipeTitle =
                  r.recipe?.title || r.recipe?.name || r.recipeTitle || "N/A";
                const reason = r.reason || r.message || "N/A";
                const reporter =
                  r.reporterEmail || r.email || r.userEmail || "N/A";
                const status = r.status || "pending";

                return (
                  <tr
                    key={r._id || index}
                    className="border-t border-gray-100 dark:border-neutral-800"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{recipeTitle}</td>
                    <td className="p-3">{reason}</td>
                    <td className="p-3">{reporter}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          status === "approved"
                            ? "bg-green-100 text-green-700"
                            : status === "dismissed"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => updateStatus(r._id, "approved")}
                        className="px-2 py-1 rounded-lg border text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(r._id, "dismissed")}
                        className="px-2 py-1 rounded-lg border text-xs"
                      >
                        Dismiss
                      </button>
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-gray-500 text-sm"
                  >
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
