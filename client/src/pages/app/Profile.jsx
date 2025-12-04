import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const { user, logout, setUser } = useAuth(); 
  const nav = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("lb_token")}`,
  };

  // -------------------------
  // Use fetch with try/catch and always handle empty body
const handleResponse = async (res) => {
  let data = {};
  try { data = await res.json(); } catch {}
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};



// CHANGE PASSWORD
const changePw = async (e) => {
  e.preventDefault();
  setErr(""); setMsg("");

  if (pw1 !== pw2) {
    setErr("Passwords do not match");
    return;
  }

  try {
    const res = await fetch(`${API}/api/user/password`, {
      method: "PATCH",
      headers: authHeader,
      body: JSON.stringify({ password: pw1 }),
    });

    await handleResponse(res);
    setMsg("Password changed successfully");
    setPw1(""); setPw2("");
  } catch (e) {
    setErr(e.message);
  }
};

// DELETE ACCOUNT
const del = async () => {
  if (!confirm("Delete your account permanently?")) return;
  try {
    const res = await fetch(`${API}/api/user`, {
      method: "DELETE",
      headers: authHeader,
    });
    await handleResponse(res);
    logout();
    nav("/");
  } catch (e) {
    setErr(e.message);
  }
};

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      {/* Status Messages */}
      {(msg || err) && (
        <div className={`p-3 rounded-xl ${err ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {err || msg}
        </div>
      )}

          <div className="rounded-2xl border p-6">
        <h2 className="font-semibold text-lg">Personal Info</h2>

        <div className="mt-3 space-y-3">
          <label className="block text-sm">
            Name
            <input
              value={user.name}
              disabled
              className="mt-1 w-full rounded-xl border px-3 py-2 opacity-50 cursor-not-allowed bg-gray-100"
            />
          </label>

          <label className="block text-sm">
            Email
            <input
              value={user.email}
              disabled
              className="mt-1 w-full rounded-xl border px-3 py-2 opacity-50 cursor-not-allowed bg-gray-100"
            />
          </label>

          <p className="text-xs text-gray-500">
            Personal information cannot be edited.
          </p>
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="rounded-2xl border p-6">
        <h2 className="font-semibold text-lg">Change Password</h2>
        <form onSubmit={changePw} className="mt-3 space-y-3">
          <input
            type="password"
            placeholder="New password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />

          <button className="px-4 py-2 rounded-xl border">
            Update Password
          </button>
        </form>

        <button onClick={del} className="mt-4 px-4 py-2 rounded-xl border text-red-600">
          Delete Account
        </button>
      </div>
    </section>
  );
}
