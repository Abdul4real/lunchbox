import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("lb-theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("lb-theme", theme);
  }, [theme]);

  const toggle = () => setTheme(t => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}