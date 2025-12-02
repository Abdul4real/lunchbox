import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [pw1, setPw1] = useState(""); const [pw2, setPw2] = useState("");

  const save = (e) => { e.preventDefault(); alert("Profile updated (demo)"); };
  const changePw = (e) => { e.preventDefault(); if (pw1 !== pw2) return alert("Passwords do not match"); alert("Password changed (demo)"); };
  const del = () => { if (confirm("Delete account?")) { logout(); nav("/"); } };

  return (
    <section className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-2xl border p-6">
        <h2 className="font-semibold text-lg">Edit Personal Info</h2>
        <form onSubmit={save} className="mt-3 space-y-3">
          <label className="block text-sm">Name
            <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2"/>
          </label>
          <label className="block text-sm">Email
            <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2"/>
          </label>
          <button className="px-4 py-2 rounded-xl bg-[var(--lb-yellow)] font-semibold">Save</button>
        </form>
      </div>

      <div className="rounded-2xl border p-6">
        <h2 className="font-semibold text-lg">Change Password</h2>
        <form onSubmit={changePw} className="mt-3 space-y-3">
          <input type="password" placeholder="New password" value={pw1} onChange={e=>setPw1(e.target.value)} className="w-full rounded-xl border px-3 py-2"/>
          <input type="password" placeholder="Confirm password" value={pw2} onChange={e=>setPw2(e.target.value)} className="w-full rounded-xl border px-3 py-2"/>
          <button className="px-4 py-2 rounded-xl border">Update</button>
        </form>
        <button onClick={del} className="mt-4 px-4 py-2 rounded-xl border">Delete Account</button>
      </div>
    </section>
  );
}