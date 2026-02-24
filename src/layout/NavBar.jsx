import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, Briefcase, User, Plus, ClipboardList } from "lucide-react";
import Card from "../components/common/Card";
import Tooltip from "../components/common/Tooltip";

const NavIcon = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <NavLink
      to={to}
      className={`p-3 rounded-full transition-all active:scale-90
        ${active ? "bg-zinc-800 text-white dark:bg-zinc-700 shadow-sm" : "text-gray-400 dark:text-zinc-500"}
      `}
    >
      <Icon size={22} />
    </NavLink>
  );
};

const NavBar = () => {
  const location = useLocation();
  const hideNavBar = location.pathname === "/login";

  if (hideNavBar) return null;

  return (
    <Card
      glass
      hover={false}
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm rounded-[32px] border border-white/10"
      variants={{
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { type: "spring", stiffness: 260, damping: 24 },
      }}
    >
      <div className="relative flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1">
          <NavIcon to="/" icon={LayoutGrid} label="Dashboard" />
          <NavIcon to="/tracker" icon={Briefcase} label="Applications" />
        </div>

        <div className="relative -top-8">
          <NavLink
            to="/mail"
            className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transform transition-transform active:scale-90 bg-black text-white ring-[12px] ring-gray-50/50 dark:bg-red-600 dark:text-white dark:ring-8 dark:ring-black/60"
          >
            <Plus size={32} />
          </NavLink>
        </div>

        <div className="flex items-center gap-1">
          <NavIcon to="/planning" icon={ClipboardList} label="Planning" />
          <NavIcon to="/profile" icon={User} label="Profile" />
        </div>
      </div>
    </Card>
  );
};

export default NavBar;
