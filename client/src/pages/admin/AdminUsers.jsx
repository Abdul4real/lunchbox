// client/src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/admin/users`, {
        params: { q: "", page: 1, limit: 50 },
      });

      // res.data = { data, total, page, limit, totalPages }
      setRows(res.data.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Suspend / Unsuspend
  const toggleSuspend = async (id) => {
    try {
      const res = await axios.patch(`${API}/admin/users/${id}/suspend`);
      const updated = res.data.user;

      setRows((prev) =>
        prev.map((u) =>
          String(u._id) === String(updated.id)
            ? { ...u, isSuspended: updated.isSuspended }
            : u
        )
      );
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user status");
    }
  };

  // Delete User
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      await axios.delete(`${API}/admin/users/${id}`);
      setRows((prev) => prev.filter((u) => String(u._id) !== String(id)));
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  const resetPw = (id) => {
    alert(`Password reset link sent to user ${id}`);
  };

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Manage Users</h1>
      <p className="text-gray-600 dark:text-neutral-400">
        • View user list • Suspend/Remove • Reset password
      </p>

      <div className="mt-4 overflow-auto rounded-2xl border border-gray-200 dark:border-neutral-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="p-3 text-gray-500">
                  Loading users…
                </td>
              </tr>
            )}

            {!loading &&
              rows.map((u, index) => {
                const suspended = u.isSuspended;

                return (
                  <tr
                    key={u._id}
                    className="border-t border-gray-100 dark:border-neutral-800"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          suspended
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => toggleSuspend(u._id)}
                        className="px-2 py-1 rounded-lg border"
                      >
                        {suspended ? "Unsuspend" : "Suspend"}
                      </button>

                      <button
                        onClick={() => resetPw(u._id)}
                        className="px-2 py-1 rounded-lg border"
                      >
                        Reset PW
                      </button>

                      <button
                        onClick={() => remove(u._id)}
                        className="px-2 py-1 rounded-lg border"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
