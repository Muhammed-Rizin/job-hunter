import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const NavItem = ({ to, icon: Icon, label, showLabel = true, divider = false }) => {
  return (
    <>
      {showLabel && divider && (
        <div className="h-px w-full my-4 bg-gray-100 dark:bg-zinc-800"></div>
      )}
      <NavLink to={to} end>
        {({ isActive }) => (
          <div
            className={`
              flex items-center gap-3
              px-3 py-2.5 rounded-xl
              text-xs font-bold tracking-wide
              transition-all
              group
              ${
                isActive
                  ? "text-black bg-white shadow-md dark:shadow-none dark:text-red-500 dark:bg-zinc-900"
                  : "text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
              }
            `}
          >
            <Icon
              size={18}
              className={`transition-transform group-hover:scale-110 ${isActive ? "" : "opacity-70"}`}
            />
            {showLabel && (
              <span className="font-bold text-xs tracking-wide" n>
                {label}
              </span>
            )}
          </div>
        )}
      </NavLink>
    </>
  );
};

export default NavItem;
