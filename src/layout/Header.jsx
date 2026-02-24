import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sun, Moon, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";

const Header = () => {
  const { toggleTheme } = useTheme();
  const { profile } = useGlobal();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const displayName = profile?.name || user?.name;
  const shortName = displayName ? displayName.split(" ")[0] : null;
  const displayInitial = displayName ? displayName.charAt(0).toUpperCase() : "U";

  let title = "Dashboard";
  let subtitle = "Overview";

  if (location.pathname === "/") {
    title = shortName ? `Good Morning, ${shortName}` : "Dashboard";
    subtitle = "Your Activity Overview";
  } else if (location.pathname.startsWith("/tracker")) {
    title = "Applications";
    subtitle = "Pipeline Status";
  } else if (location.pathname.startsWith("/mail")) {
    title = "Mail Wizard";
    subtitle = "Compose & Send";
  } else if (location.pathname.startsWith("/profile")) {
    title = "Profile";
    subtitle = "Settings & Goal";
  } else if (location.pathname.startsWith("/planning")) {
    title = "Planning";
    subtitle = "Lead Pipeline";
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const isLoginPage = location.pathname === "/login";
    if (isLoginPage) return;

    const container = document.getElementById("app-scroll-container");
    if (!container) return;

    const handleScroll = () => setIsScrolled(container.scrollTop > 8);
    handleScroll();

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isLoginPage = location.pathname === "/login";
  if (isLoginPage) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:block sticky top-0 z-30 px-4 md:px-6 lg:px-8 pt-4"
      >
        <div
          className={`relative overflow-hidden rounded-2xl border px-6 py-4 transition-all duration-300 ${
            isScrolled
              ? "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border-gray-200/80 dark:border-zinc-800/80 shadow-xl shadow-black/5 dark:shadow-black/30"
              : "bg-transparent border-transparent"
          }`}
        >
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
              isScrolled ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute -top-10 left-1/4 h-24 w-24 rounded-full bg-white/40 blur-2xl dark:bg-zinc-200/10" />
            <div className="absolute -bottom-12 right-1/4 h-24 w-24 rounded-full bg-blue-200/40 blur-2xl dark:bg-red-500/10" />
          </div>

          <div className="relative flex justify-between items-end gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight dark:text-white">{title}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1.5 flex items-center gap-2 dark:text-white">
                {subtitle}
                <span className="w-1 h-1 rounded-full bg-current opacity-20" />
                {currentDate}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/tracker", { state: { openCreate: true } })}
                className="px-6 py-2.5 rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 text-[11px]
                    bg-black hover:bg-zinc-800 text-white
                    dark:bg-red-600 dark:hover:bg-red-500 dark:text-white shadow-red-900/10"
              >
                <Plus className="mr-2 inline-block" size={16} /> Apply Now
              </button>

              <div
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 px-4 py-2 rounded-2xl border cursor-pointer
                    bg-white hover:bg-gray-50
                    dark:bg-zinc-900 dark:hover:bg-zinc-800
                    border-gray-200 dark:border-zinc-800 transition-all shadow-sm"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm
                    bg-gray-100 dark:bg-black border border-gray-200 dark:border-zinc-800 dark:text-white"
                >
                  {displayInitial}
                </div>

                <div className="text-left hidden lg:block">
                  <p className="text-xs font-black tracking-tight dark:text-white">
                    {displayName || "Authorized User"}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 dark:text-white">
                    {profile?.title || "System Access"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden fixed top-0 left-0 right-0 z-30 px-6 py-5
          bg-white/95 dark:bg-black/90 backdrop-blur-md
          border-b border-gray-100 dark:border-zinc-900
          flex justify-between items-center shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-black dark:bg-red-600 shadow-lg">
            <span className="font-black text-white text-sm">JH</span>
          </div>
          <span className="font-black text-xl tracking-tighter dark:text-white">JobHunter</span>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-2xl
            bg-gray-100 hover:bg-gray-200
            dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors"
        >
          <Sun className="block dark:hidden" size={20} />
          <Moon className="hidden dark:block" size={20} />
        </button>
      </motion.div>
    </>
  );
};

export default Header;
