
import { createContext, useCallback, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    setUser(user);

    return user;
  }

  async function register(name, email, password) {
    return api.post("/auth/register", {
      name,
      email,
      password,
    });
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/profile");
      setUser(response.data.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// The hook belongs to this provider module so consumers share the same auth context.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
