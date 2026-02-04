import { motion } from "framer-motion";
import { Calendar, Trash2 } from "lucide-react";
import { itemVariants } from "../../utils/animations";
import StatusSelect from "./StatusSelect";

const TrackerCard = ({ app, colors, setApplications }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`p-3 rounded-2xl border ${colors.card} shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="p-2.5 rounded-full flex items-center justify-center shrink-0 border bg-blue-50 border-blue-100 shadow-sm text-blue-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          >
            <span className="font-bold text-sm">{app.company.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm tracking-wide leading-none mb-1">{app.company}</h4>
            <p
              className="text-[10px] uppercase tracking-widest opacity-50 text-gray-500 dark:text-zinc-400"
            >
              {app.role}
            </p>
          </div>
        </div>
        <button
          onClick={() => setApplications((prev) => prev.filter((p) => p.id !== app.id))}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          aria-label="Delete application"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-dashed border-gray-500/20">
        <div className="flex-1 mr-4">
          <StatusSelect
            status={app.status}
            onChange={(v) =>
              setApplications((prev) => prev.map((p) => (p.id === app.id ? { ...p, status: v } : p)))
            }
          />
        </div>
        <div className="flex items-center gap-1 opacity-50 text-[10px] font-mono font-bold">
          <Calendar size={10} />
          <span>{app.appliedDate}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TrackerCard;
