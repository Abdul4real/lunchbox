import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// 🔑 Same keys used in SignIn.jsx
const TOKEN_KEY = "lb_token";
const USER_KEY = "lb_user";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, name, email, role, ... }
  const [token, setToken] = useState(null); // JWT
  const [isReady, setIsReady] = useState(false); // 👈 important for refresh

  // 🔁 When the app loads (or page refresh), re-hydrate from storage
  useEffect(() => {
    try {
      const storedToken =
        localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      const storedUser =
        localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      }
    } catch (err) {
      console.error("Failed to restore auth from storage:", err);
    } finally {
      setIsReady(true);
    }
  }, []);

  // 🧠 Support new style: loginUser({ token, user })  (used in SignIn.jsx)
  // and old fallback: loginUser({ email, name })
  const loginUser = (payload) => {
    if (!payload) return;

    if ("token" in payload && "user" in payload) {
      const { token, user } = payload;
      setUser(user);
      setToken(token);
    } else {
      const { email, name = "Guest", role = "user" } = payload;
      setUser({ email, name, role });
      setToken(null);
    }
  };

  // Not really used for backend auth in your project, but we keep it
  const registerUser = ({ email, name }) =>
    setUser({ email, name, role: "user" });

  // Admin fake login (no JWT, just flag role = admin)
  const loginAdmin = (payload) => {
    if (payload && payload.user) {
      setUser({ ...payload.user, role: "admin" });
      setToken(payload.token ?? null);
    } else {
      const { email } = payload || {};
      setUser({ email, name: "Admin", role: "admin" });
      setToken(null);
    }
  };

  // 🚪 Proper logout: clear React state *and* storage
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const isAdmin = user?.role === "admin";
  const isAuthed = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthed,
        isAdmin,
        isReady, // 👈 expose this for the route guards
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
