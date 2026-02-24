import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  variant = "boxed",
  className = "",
  optionClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    onChange(opt.id);
    setIsOpen(false);
  };

  const variants = {
    boxed: "bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl",
    underline: "bg-transparent border-b border-slate-300 dark:border-neutral-700 rounded-none",
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between gap-2 p-3 h-full cursor-pointer transition-colors ${variants[variant]}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selected?.icon ? (
            <selected.icon size={16} className="opacity-60 shrink-0" />
          ) : null}
          <span
            className={`text-sm font-bold tracking-wide truncate ${!selected ? "text-gray-400 dark:text-zinc-500" : "text-gray-900 dark:text-white"}`}
          >
            {selected?.label || placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`opacity-40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border z-50 overflow-hidden bg-white border-slate-200 dark:bg-black dark:border-zinc-800"
          >
            <div className="max-h-60 overflow-y-auto no-scrollbar p-1">
              {options.map((opt) => {
                const isSelected = opt.id === value;
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center gap-3 transition-colors ${
                      isSelected
                        ? "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white"
                        : "text-gray-600 hover:bg-slate-50 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                    } ${optionClassName}`}
                  >
                    {Icon ? (
                      <Icon size={16} className={isSelected ? "opacity-100" : "opacity-60"} />
                    ) : null}
                    <span className="font-bold tracking-wide">{opt.label}</span>
                    {isSelected ? <Check size={14} className="ml-auto opacity-60" /> : null}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Select;
