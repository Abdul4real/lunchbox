import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  // Load user from localStorage (if any)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("lb_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ---- COMMON HELPERS ----
  const saveSession = ({ token, user }) => {
    if (token) {
      localStorage.setItem("lb_token", token);
    }
    if (user) {
      localStorage.setItem("lb_user", JSON.stringify(user));
      setUser(user);
    }
  };

  const clearSession = () => {
    localStorage.removeItem("lb_token");
    localStorage.removeItem("lb_user");
    setUser(null);
  };

  // ---- NORMAL USER LOGIN / REGISTER ----
  // expected payload: { token, user }
  const loginUser = (payload) => {
    saveSession(payload);
  };

  const registerUser = (payload) => {
    saveSession(payload);
  };

  // ---- ADMIN LOGIN ----
  // expected payload: { token, user }  (user will be the admin object)
  const loginAdmin = (payload) => {
    saveSession(payload);
  };

  const logout = () => {
    clearSession();
  };

  const isAdmin = user?.role === "admin";
  const isAuthed = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthed,
        isAdmin,
        loginUser,
        registerUser,
        loginAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
