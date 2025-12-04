import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Login after /auth/login
  const loginUser = ({ token, user }) => {
    // store token
    localStorage.setItem("lb_token", token);

    // store user object exactly as backend returns it
    setUser(user);
  };

  const registerUser = ({ token, user }) => {
    localStorage.setItem("lb_token", token);
    setUser(user);
  };

  // Special admin login (if needed)
  const loginAdmin = ({ token, user }) => {
    localStorage.setItem("lb_token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("lb_token");
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
