import React from "react";
import { useState } from "react";
import seed from "../../data/admin/reports.json";

export default function AdminReports() {
  const [rows, setRows] = useState(seed);

  const act = (id, action) =>
    setRows(rs => rs.map(r => r.id === id ? { ...r, status: action } : r));

  return (
    <section>
      <h1 className="text-2xl font-extrabold">Review Reports</h1>
      <p className="text-gray-600 dark:text-neutral-400">• View reported content • Approve/Dismiss • Take action</p>

      <div className="mt-4 overflow-auto rounded-2xl border border-gray-200 dark:border-neutral-800">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-neutral-800">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Recipe</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Reporter</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-gray-100 dark:border-neutral-800">
                <td className="p-3">{r.id}</td>
                <td className="p-3">{r.recipe}</td>
                <td className="p-3">{r.reason}</td>
                <td className="p-3">{r.reporter}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    r.status === "approved" ? "bg-green-100 text-green-700" :
                    r.status === "dismissed" ? "bg-gray-100 text-gray-700" : "bg-amber-100 text-amber-700"
                  }`}>{r.status}</span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={()=>act(r.id,"approved")} className="px-2 py-1 rounded-lg border">Approve</button>
                  <button onClick={()=>act(r.id,"dismissed")} className="px-2 py-1 rounded-lg border">Dismiss</button>
                  <button onClick={()=>alert(`Corrective action for report #${r.id}`)} className="px-2 py-1 rounded-lg border">Action…</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}