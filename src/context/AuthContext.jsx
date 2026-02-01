/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { get, post } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverReady, setServerReady] = useState(false);

  const login = async ({ mobile, password }) => {
    try {
      // const response = await post("auth/login", { mobile, password });

      // localStorage.setItem("accessToken", response.accessToken);
      // localStorage.setItem("refreshToken", response.refreshToken);
      // localStorage.setItem("user", JSON.stringify(response.user));
      // setUser(response.user); // Update user state

      localStorage.setItem("accessToken", "response.accessToken");
      localStorage.setItem("refreshToken", "response.refreshToken");
      localStorage.setItem("user", JSON.stringify({ mobile: "8156886609", name: "Rizin" }));
      setUser({ mobile: "8156886609", name: "Rizin" }); // Update user state

      toast.success("Welcome back!");

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Check auth state on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        const storedUser = localStorage.getItem("user");
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken && storedUser) {
          setUser(JSON.parse(storedUser));

          await Promise.race([
            await get(`health`),
            new Promise((_, reject) => setTimeout(() => reject("timeout"), 15000)),
          ]);

          setServerReady(true);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, serverReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
