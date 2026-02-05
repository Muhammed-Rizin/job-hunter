/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { del, get, post } from "../services/api";
import { getDeviceId } from "../utils/device";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  setStoredUser,
  setTokens,
} from "../utils/session";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverReady, setServerReady] = useState(false);
  const hasCheckedRef = useRef(false);

  const login = async ({ username, mobile, email, password }) => {
    try {
      const identifier = username || mobile || email;
      if (!identifier) throw new Error("Username, email, or mobile is required");

      const response = await post("auth/login", {
        username: identifier,
        password,
        deviceId: getDeviceId(),
      });

      setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
      setStoredUser(response.user);
      setUser(response.user);
      setServerReady(true);

      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  const register = async ({ name, email, mobile, password, username }) => {
    try {
      const resolvedUsername = username || email || mobile;
      const response = await post("auth/register", {
        name,
        email,
        mobile,
        username: resolvedUsername,
        password,
        deviceId: getDeviceId(),
      });

      toast.success(response?.message || "Account created");

      await login({ username: resolvedUsername, password });
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    try {
      await del("auth/logout", { data: { deviceId: getDeviceId() } });
    } catch (error) {
      // ignore logout errors
    } finally {
      setUser(null);
      clearSession();
      navigate("/login");
    }
  };

  const updateUser = (nextUser) => {
    if (!nextUser) return;
    setUser(nextUser);
    setStoredUser(nextUser);
  };

  // Check auth state on initial load
  useEffect(() => {
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    const checkAuth = async () => {
      try {
        setLoading(true);

        const storedUser = getStoredUser();
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        let resolvedUser = storedUser;

        if (resolvedUser) {
          setUser(resolvedUser);
        }

        if (!accessToken && !refreshToken && !resolvedUser) {
          setServerReady(false);
          return;
        }

        try {
          const response = await get("user/me");
          const data = response?.data || response?.user || response?.profile;
          if (data) {
            resolvedUser = data;
            setUser(data);
            setStoredUser(data);
          }
          setServerReady(true);
        } catch (err) {
          setServerReady(false);
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
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, serverReady, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
