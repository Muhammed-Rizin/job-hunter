import {
  LayoutGrid,
  Briefcase,
  ClipboardList,
  LayoutTemplate,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Card from "../components/common/Card";
import NavItem from "../components/navigation/NavItem";
import Tooltip from "../components/common/Tooltip";

const ITEMS = [
  { to: "/", icon: LayoutGrid, label: "Dashboard" },
  { to: "/planning", icon: ClipboardList, label: "Planning" },
  { to: "/tracker", icon: Briefcase, label: "Applications" },
  { to: "/mail", icon: LayoutTemplate, label: "Mail Wizard" },
  { to: "/profile", icon: User, label: "Profile", divider: true },
];

const SideBar = () => {
  const { logout } = useAuth();
  const { toggleTheme } = useTheme();

  return (
    <Card
      className="hidden md:flex flex-col w-20 lg:w-64 m-4 h-[calc(100vh-2rem)]"
      variants={{
        initial: { x: -30, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { type: "spring", stiffness: 260, damping: 24 },
      }}
    >
      <div className="p-6 flex items-center justify-center lg:justify-start">
        <div className="w-10 h-10 rounded-xl bg-black dark:bg-red-600 flex items-center justify-center shadow-lg">
          <Briefcase size={20} className="text-white" />
        </div>
        <span className="ml-3 font-bold text-xl hidden lg:block font-sans dark:font-mono">
          JH Pro
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1 flex flex-col items-center lg:items-stretch">
        {ITEMS.map((item) => (
          <NavItem key={item.to} {...item} showLabel />
        ))}
      </nav>

      <div className="p-4 flex flex-col items-center lg:items-stretch mt-auto">
        <Tooltip content="Switch Theme" position="right">
          <button
            onClick={toggleTheme}
            className="w-full p-3 mb-2 rounded-xl flex items-center justify-center lg:justify-start transition-all
              bg-gray-100 hover:bg-gray-200 text-gray-900
              dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300
              "
          >
            <Sun className="block dark:hidden" size={18} />
            <Moon className="hidden dark:block" size={18} />
            <span className="ml-3 hidden lg:block text-xs font-bold uppercase tracking-wider">
              Switch Theme
            </span>
          </button>
        </Tooltip>
        <Tooltip content="Log Out" position="right">
          <button
            onClick={logout}
            className={`w-full p-3 rounded-xl flex items-center justify-center lg:justify-start transition-all border text-red-500 border-red-500/20 hover:bg-red-500/10`}
          >
            <LogOut size={18} />
            <span className="ml-3 hidden lg:block text-xs font-bold uppercase tracking-wider">
              Log Out
            </span>
          </button>
        </Tooltip>
      </div>
    </Card>
  );
};

export default SideBar;
