import { motion } from "framer-motion";
import { Sun, Moon, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";

const Header = () => {
  const { toggleTheme } = useTheme();
  const { profile } = useGlobal();
  const { user } = useAuth();

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
  } else if (location.pathname.startsWith("/notes")) {
    title = "Notes";
    subtitle = "Ideas & Prep";
  } else if (location.pathname.startsWith("/profile")) {
    title = "Profile";
    subtitle = "Settings & Goal";
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:flex sticky top-0 z-20 py-3 backdrop-blur-md justify-between items-end border-b border-gray-200 dark:border-zinc-800"
      >
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
          <p className="text-xs font-bold uppercase tracking-widest opacity-50 mt-1 flex items-center gap-2">
            {subtitle}
            <span className="w-1 h-1 rounded-full bg-current" />
            {currentDate}
          </p>
        </div>

        <div className="flex items-end gap-3">
          <button
            onClick={() => navigate("/tracker", { state: { openCreate: true } })}
            className="px-5 py-2.5 rounded-xl font-bold flex items-center justify-center shadow-lg transition-transform active:scale-95 text-sm
              bg-black hover:bg-zinc-800 text-white
              dark:bg-red-600 dark:hover:bg-red-500 dark:text-white"
          >
            <Plus className="mr-2" size={18} /> Apply Now
          </button>

          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl border cursor-pointer
              bg-white hover:bg-gray-100
              dark:bg-zinc-900 dark:hover:bg-zinc-800
              border-gray-200 dark:border-zinc-800 transition"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
              bg-gray-100 dark:bg-zinc-800"
            >
              {displayInitial}
            </div>

            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold">{displayName || "User"}</p>
              <p className="text-[10px] opacity-50">{profile?.title || "Profile"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden fixed top-0 left-0 right-0 z-30 px-5 py-4
          bg-white/95 dark:bg-black/90 backdrop-blur-md
          border-b border-gray-100 dark:border-zinc-900
          flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-black dark:bg-red-600">
            <span className="font-bold text-white text-xs">JH</span>
          </div>
          <span className="font-bold text-lg tracking-tight">JobHunter</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full
          bg-gray-100 hover:bg-gray-200
          dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300"
        >
          <Sun className="block dark:hidden" size={18} />
          <Moon className="hidden dark:block" size={18} />
        </button>
      </motion.div>
    </>
  );
};

export default Header;
