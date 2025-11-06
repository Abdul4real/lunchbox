import React from "react";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, name, role: "user" | "admin" }

  const loginUser = ({ email, name = "Guest" }) => setUser({ email, name, role: "user" });
  const registerUser = ({ email, name }) => setUser({ email, name, role: "user" });
  const loginAdmin = ({ email }) => setUser({ email, name: "Admin", role: "admin" });
  const logout = () => setUser(null);

  const isAdmin = user?.role === "admin";
  const isAuthed = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthed, isAdmin, loginUser, registerUser, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
