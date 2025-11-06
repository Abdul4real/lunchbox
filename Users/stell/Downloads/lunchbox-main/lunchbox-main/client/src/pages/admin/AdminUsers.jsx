import React from "react";
import { useState } from "react";
import seed from "../../data/admin/users.json";

export default function AdminUsers() {
  const [rows, setRows] = useState(seed);

  const toggleSuspend = (id) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, status: r.status === "active" ? "suspended" : "active" } : r));

  const remove = (id) => setRows(rs => rs.filter(r => r.id !== id));
  const resetPw = (id) => alert(`Password reset link sent to user #${id}`);

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Manage Users</h1>
      <p className="text-gray-600 dark:text-neutral-400">• View user list • Suspend/Remove • Reset password</p>

      <div className="mt-4 overflow-auto rounded-2xl border border-gray-200 dark:border-neutral-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id} className="border-t border-gray-100 dark:border-neutral-800">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {u.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={()=>toggleSuspend(u.id)} className="px-2 py-1 rounded-lg border"> {u.status === "active" ? "Suspend" : "Unsuspend"} </button>
                  <button onClick={()=>resetPw(u.id)} className="px-2 py-1 rounded-lg border">Reset PW</button>
                  <button onClick={()=>remove(u.id)} className="px-2 py-1 rounded-lg border">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}