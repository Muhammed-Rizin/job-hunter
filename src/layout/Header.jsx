import { motion } from "framer-motion";
import { Sun, Moon, ChevronDown, Plus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useGlobal } from "../context/GlobalContext";

const Header = () => {
  const { toggleTheme } = useTheme();
  const { profile } = useGlobal();

  const location = useLocation();
  const navigate = useNavigate();

  let title = "Dashboard";
  let subtitle = "Overview";

  switch (location.pathname) {
    case "/":
      title = profile?.name ? `Good Morning, ${profile.name.split(" ")[0]}` : "Dashboard";
      subtitle = "Your Activity Overview";
      break;

    case "/tracker":
      title = "Applications";
      subtitle = "Pipeline Status";
      break;

    case "/mail":
      title = "Mail Wizard";
      subtitle = "Compose & Send";
      break;

    case "/notes":
      title = "Notes";
      subtitle = "Ideas & Prep";
      break;

    case "/profile":
      title = "Profile";
      subtitle = "Settings & Goal";
      break;

    default:
      break;
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
        className="hidden md:flex justify-between items-end pb-4 border-b border-gray-200 dark:border-zinc-800"
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
              {profile?.name?.charAt(0) || "U"}
            </div>

            <div className="text-left hidden lg:block">
              <p className="text-xs font-bold">{profile?.name || "User"}</p>
              <p className="text-[10px] opacity-50">{profile?.title || "Profile"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden fixed top-0 w-full z-30 px-5 py-4
          bg-white/90 dark:bg-black/80 backdrop-blur-md
          border-b border-gray-100 dark:border-zinc-900
          flex justify-between items-center"
      >
        
        <div>
          <h2 className="text-lg font-extrabold tracking-tight">{title}</h2>
          <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">{subtitle}</p>
        </div>
        <div className="flex items-end gap-3">
          <button
            className="px-5 py-2.5 rounded-xl font-bold flex items-center justify-center shadow-lg transition-transform active:scale-95 text-sm
              bg-black hover:bg-zinc-800 text-white
              dark:bg-red-600 dark:hover:bg-red-500 dark:text-white"
          >
            <Plus className="mr-2" size={18} /> Apply Now
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full
            bg-gray-100 hover:bg-gray-200
            dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300"
          >
            <Sun className="block dark:hidden" size={18} />
            <Moon className="hidden dark:block" size={18} />
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Header;
