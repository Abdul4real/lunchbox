import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function UserRoute() {
  const { isAuthed, isReady } = useAuth();

  // 🕒 While we’re restoring from storage, don't redirect yet
  if (!isReady) {
    return null; // or a loading spinner
  }

  return isAuthed ? <Outlet /> : <Navigate to="/signin" replace />;
}
