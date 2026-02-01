import { createContext, useContext, useEffect, useState, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage("jh:theme", "nothing");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const isDark = theme === "nothing";

  const toggleTheme = () => {
    const next = isDark ? "clean" : "nothing";
    setTheme(next);
    localStorage.setItem("jh_theme", next);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const value = useMemo(() => {
    return {
      theme,
      isDark,
      isMobile,
      toggleTheme,
      setTheme,
    };
  }, [theme, setTheme, isMobile]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
