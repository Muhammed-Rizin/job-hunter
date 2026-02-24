import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ExternalLink,
  Trash2,
  CheckCircle,
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Globe,
  Mail,
  MailCheck,
  SortDesc,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { containerVariants, itemVariants } from "@/shared/utils/animations";
import { colors } from "@/shared/utils/theme";
import Select from "@/shared/components/common/Select";
import { usePlanning } from "@/features/planning/hooks/usePlanning";
import PlanningSkeleton from "@/features/planning/components/PlanningSkeleton";

const getTopDownAnimation = (index) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  visible: { transition: { type: "spring", stiffness: 300, damping: 24 } },
});

const Planning = () => {
  const { plans, loading, error, markApplied, deletePlan } = usePlanning();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    if (error) toast.error("Failed to fetch plans");
  }, [error]);

  const handleMarkApplied = async (id) => {
    try {
      await markApplied(id);
      toast.success("Marked as applied");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await deletePlan(id);
      toast.success("Plan deleted");
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const filteredPlans = useMemo(() => {
    const list = Array.isArray(plans) ? plans : [];
    return list
      .filter((plan) => {
        const matchesSearch =
          (plan.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (plan.techStack || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (plan.location || "").toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === "all" || plan.status === filterStatus;
        const matchesPriority = filterPriority === "all" || plan.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        return sortOrder === "newest"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
  }, [plans, searchQuery, filterStatus, filterPriority, sortOrder]);

  const stats = useMemo(() => {
    const list = Array.isArray(plans) ? plans : [];
    return {
      total: list.length,
      pending: list.filter((p) => p.status === "pending").length,
      applied: list.filter((p) => p.status === "applied").length,
    };
  }, [plans]);

  const showPlannerSkeleton = loading && plans.length === 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="h-full space-y-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div
          className={`p-4 rounded-2xl border ${colors.card} shadow-sm flex flex-col justify-between`}
        >
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
            Planned Leads
          </p>
          <p className="text-2xl font-black dark:text-white mt-1">{stats.total}</p>
        </div>
        <div
          className={`p-4 rounded-2xl border ${colors.card} shadow-sm flex flex-col justify-between`}
        >
          <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest leading-tight">
            Ready to Apply
          </p>
          <p className="text-2xl font-black dark:text-white mt-1">{stats.pending}</p>
        </div>
        <div
          className={`p-4 rounded-2xl border ${colors.card} shadow-sm flex flex-col justify-between`}
        >
          <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest leading-tight">
            Converted
          </p>
          <p className="text-2xl font-black dark:text-white mt-1">{stats.applied}</p>
        </div>
        <button
          className={`p-4 rounded-2xl border ${colors.card} shadow-sm flex items-center justify-center hover:border-red-500/50 transition-colors group cursor-pointer`}
        >
          <span className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 group-hover:scale-105 transition-transform">
            <Plus size={16} /> New Lead
          </span>
        </button>
      </div>

      {/* Unified Filter Bar - Matching Applications Style */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 opacity-30" size={16} />
            <input
              type="text"
              placeholder="Search leads..."
              className={`pl-9 pr-3 py-2.5 rounded-xl w-full outline-none transition-all font-medium text-sm ${colors.input}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex-1 md:w-40">
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                options={[
                  { id: "all", label: "Status" },
                  { id: "pending", label: "Pending" },
                  { id: "applied", label: "Applied" },
                  { id: "bounced", label: "Bounced" },
                ]}
              />
            </div>
            <div className="flex-1 md:w-40">
              <Select
                value={filterPriority}
                onChange={setFilterPriority}
                options={[
                  { id: "all", label: "Priority" },
                  { id: "High", label: "High" },
                  { id: "Medium", label: "Medium" },
                  { id: "Low", label: "Low" },
                ]}
              />
            </div>
            <button
              onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
              className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${colors.card}`}
            >
              <SortDesc
                size={18}
                className={sortOrder === "newest" ? "" : "transform rotate-180"}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Plans List - Optimized for mobile */}
      {showPlannerSkeleton ? (
        <PlanningSkeleton entries={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPlans.map((plan, index) => (
              <motion.div
                layout
                key={plan._id}
                {...getTopDownAnimation(index)}
                className={`rounded-2xl border ${colors.card} p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-100 dark:border-zinc-800">
                      <Briefcase className="text-red-600" size={20} />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                          plan.status === "applied"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : plan.status === "bounced"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                        }`}
                      >
                        {plan.status}
                      </span>
                      {plan.priority === "High" && (
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-500/20 shadow-sm">
                          Priority
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-3 truncate leading-tight">
                    {plan.companyName}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {plan.location && (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-[11px] font-bold uppercase tracking-wide">
                        <MapPin size={12} className="opacity-40" /> {plan.location}
                      </div>
                    )}
                    {plan.package && (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-[11px] font-bold uppercase tracking-wide">
                        <DollarSign size={12} className="opacity-40" /> {plan.package}
                      </div>
                    )}
                    {plan.email && (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-[11px] font-mono lowercase">
                        {plan.mail?.sent ? (
                          <MailCheck size={12} className="text-green-500" />
                        ) : (
                          <Mail size={12} className="opacity-40" />
                        )}
                        {plan.email}
                      </div>
                    )}
                    {plan.jobLink && (
                      <a
                        href={plan.jobLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-500 text-[11px] font-bold uppercase tracking-wider hover:underline pt-1"
                      >
                        <Globe size={12} /> Open Lead <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  {plan.theHook && (
                    <div className="mb-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                      <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">
                        Target Strategy
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                        {plan.theHook}
                      </p>
                    </div>
                  )}

                  {plan.winningMove && (
                    <div className="mb-4 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                      <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">
                        Execution Advice
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                        {plan.winningMove}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-neutral-800">
                  <div className="flex gap-2.5">
                    {plan.status === "pending" && (
                      <button
                        onClick={() => handleMarkApplied(plan._id)}
                        className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-red-500 rounded-xl transition-all active:scale-95"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">
                      Identified
                    </p>
                    <p className="text-[10px] font-mono dark:text-neutral-500 opacity-60 font-bold">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredPlans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
          <Briefcase size={48} className="mb-4" />
          <p className="text-sm font-bold uppercase tracking-[0.3em]">No matching leads found</p>
        </div>
      )}
    </motion.div>
  );
};

export default Planning;
