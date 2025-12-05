import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("lb_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Login after /auth/login
  const loginUser = ({ token, user }) => {
    localStorage.setItem("lb_token", token);
    localStorage.setItem("lb_user", JSON.stringify(user));
    setUser(user);
  };

  const registerUser = ({ token, user }) => {
    localStorage.setItem("lb_token", token);
    localStorage.setItem("lb_user", JSON.stringify(user));
    setUser(user);
  };

  const loginAdmin = ({ token, user }) => {
    localStorage.setItem("lb_token", token);
    localStorage.setItem("lb_user", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("lb_token");
    localStorage.removeItem("lb_user");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  const isAuthed = !!user;

  return (
    <AuthContext.Provider
      value={{ user, isAuthed, isAdmin, loginUser, registerUser, loginAdmin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
