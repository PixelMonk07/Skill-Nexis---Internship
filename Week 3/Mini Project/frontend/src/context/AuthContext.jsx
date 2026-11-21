
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Verify the saved token with Express
    api.get("/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const currentUser = response.data.user;
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
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
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
