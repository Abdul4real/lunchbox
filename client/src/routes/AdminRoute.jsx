import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminRoute() {
  const { isAdmin, isReady } = useAuth();

  if (!isReady) {
    return null;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
