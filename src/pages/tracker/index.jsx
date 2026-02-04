import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Search, SortDesc, Trash2 } from "lucide-react";

import { useGlobal } from "../../context";
import { APPLICATION_STATUSES, PLATFORMS } from "../../config/job.constants";
import { containerVariants, itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";
import TrackerCard from "../../components/tracker/TrackerCard";
import StatusSelect from "../../components/tracker/StatusSelect";

const Tracker = () => {
  const { applications, setApplications } = useGlobal();
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const filtered = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesText =
          app.company.toLowerCase().includes(filter.toLowerCase()) ||
          app.role.toLowerCase().includes(filter.toLowerCase());
        const matchesStatus = statusFilter === "all" || app.status === statusFilter;
        const matchesSource = sourceFilter === "all" || app.source === sourceFilter;
        return matchesText && matchesStatus && matchesSource;
      })
      .sort((a, b) => {
        return sortOrder === "newest"
          ? new Date(b.appliedDate) - new Date(a.appliedDate)
          : new Date(a.appliedDate) - new Date(b.appliedDate);
      });
  }, [applications, filter, sortOrder, sourceFilter, statusFilter]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="h-full"
    >
      <div className="space-y-4 p-4 md:px-0 h-full flex flex-col no-scrollbar">
        <motion.div variants={itemVariants} className="mb-4 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 opacity-30" size={16} />
              <input
                type="text"
                placeholder="Search companies..."
                className={`pl-9 pr-3 py-2.5 rounded-xl w-full outline-none transition-all font-medium text-sm ${colors.input}`}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className={`custom-select px-3 py-2.5 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} flex-1`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                className={`custom-select px-3 py-2.5 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} flex-1`}
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                {PLATFORMS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
                className={`p-2.5 rounded-xl border flex items-center justify-center ${colors.card}`}
                aria-label="Toggle sort order"
              >
                <SortDesc
                  size={18}
                  className={sortOrder === "newest" ? "" : "transform rotate-180"}
                />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="md:hidden space-y-2 pb-4 no-scrollbar">
          {filtered.map((app) => (
            <TrackerCard
              key={app.id}
              app={app}
              colors={colors}
              setApplications={setApplications}
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 opacity-40 text-xs font-bold uppercase tracking-widest">
              No applications found.
            </div>
          )}
        </div>

        <div className="hidden md:block flex-1 overflow-x-auto">
          <div className="min-w-200 md:min-w-0 space-y-2">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
              <div className="col-span-4">Company</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
            {filtered.map((app) => (
              <motion.div
                variants={itemVariants}
                key={app.id}
                className="grid grid-cols-12 gap-4 items-center p-3 rounded-xl border transition-all hover:shadow-md bg-white border-gray-100 hover:border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-gray-50 border-gray-200 dark:bg-black dark:border-zinc-800"
                  >
                    <span className="font-bold text-xs">{app.company.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{app.company}</h4>
                    <p className="text-[10px] uppercase tracking-wider opacity-60">{app.role}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2 opacity-70">
                  {(() => {
                    const match = PLATFORMS.find((p) => p.id === app.source);
                    const Icon = match?.icon || Globe;
                    return <Icon size={14} />;
                  })()}
                  <span className="text-xs font-medium">
                    {PLATFORMS.find((p) => p.id === app.source)?.label}
                  </span>
                </div>
                <div className="col-span-3">
                  <StatusSelect
                    status={app.status}
                    onChange={(v) =>
                      setApplications((prev) =>
                        prev.map((p) => (p.id === app.id ? { ...p, status: v } : p)),
                      )
                    }
                  />
                </div>
                <div className="col-span-2 text-xs font-mono opacity-60">{app.appliedDate}</div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => setApplications((prev) => prev.filter((p) => p.id !== app.id))}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400"
                    aria-label="Delete application"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Tracker;
