import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../auth/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("hotel_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/users/auth/login", { email, password });
      const loggedInUser = res.data.data.user;
      setUser(loggedInUser);
      localStorage.setItem("hotel_user", JSON.stringify(loggedInUser));
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/users/auth/logout");
    } catch (_) { }
    setUser(null);
    localStorage.removeItem("hotel_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
