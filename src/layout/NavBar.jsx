import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutGrid, Briefcase, FileText, User, Plus, ClipboardList } from "lucide-react";
import Card from "../components/common/Card";

const items = [
  { to: "/", icon: LayoutGrid },
  { to: "/planning", icon: ClipboardList },
  { to: "/tracker", icon: Briefcase },
  { to: "/notes", icon: FileText },
  { to: "/profile", icon: User },
];

const NavIcon = ({ to, icon: Icon }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <NavLink
      to={to}
      className={`p-3 rounded-full transition-all active:scale-90
        ${active ? "bg-zinc-800 text-white dark:bg-zinc-700" : "text-gray-400 dark:text-zinc-500"}
      `}
    >
      <Icon size={20} />
    </NavLink>
  );
};

const NavBar = () => {
  return (
    <Card
      glass
      hover={false}
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm rounded-full"
      variants={{
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { type: "spring", stiffness: 260, damping: 24 },
      }}
    >
      <div className="relative flex items-center justify-between px-2 py-1">
        <div className="flex gap-1">
          <NavIcon to="/" icon={LayoutGrid} />
          <NavIcon to="/planning" icon={ClipboardList} />
          <NavIcon to="/tracker" icon={Briefcase} />
        </div>

        <div className="relative -top-6">
          <NavLink
            to="/mail"
            className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transform transition-transform active:scale-90 bg-black text-white ring-8 ring-white dark:bg-red-600 dark:text-white dark:ring-8 dark:ring-black "
          >
            <Plus size={28} />
          </NavLink>
        </div>

        <div className="flex gap-1">
          <NavIcon to="/notes" icon={FileText} />
          <NavIcon to="/profile" icon={User} />
        </div>
      </div>
    </Card>
  );
};

export default NavBar;
