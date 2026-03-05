import { useState, useRef, useEffect } from "react";
import { APPLICATION_STATUSES } from "@/features/applications/constants/job.constants";

const StatusSelect = ({ status, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = APPLICATION_STATUSES.filter((s) => s.id !== "all");
  const active = options.find((s) => s.id === status) || options[0];
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-2 px-3 rounded-xl text-[10px] uppercase font-bold tracking-wider appearance-none outline-none border cursor-pointer flex items-center justify-between shadow-sm transition-all focus:ring-2 focus:ring-opacity-50 dark:bg-black dark:border-zinc-800 ${active.color}`}
        type="button"
      >
        {active.label}
        <svg fill="currentColor" width="12" height="12" viewBox="0 0 24 24" className={`transition-transform opacity-60 ${isOpen ? 'rotate-180' : ''}`}><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" /></svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-fade-in max-h-48 overflow-y-auto no-scrollbar">
          {options.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                onChange(s.id);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-b border-gray-100 dark:border-zinc-800/50 last:border-none inline-flex items-center gap-2 w-full text-left transition-colors ${s.id === status ? s.color : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900"}`}
            >
              <div className={`w-2 h-2 rounded-full ${s.id === status ? "bg-current opacity-50" : "bg-gray-300 dark:bg-zinc-800"}`}></div>
              {s.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusSelect;
