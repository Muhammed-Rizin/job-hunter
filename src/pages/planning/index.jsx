import { useState, useEffect, useMemo } from "react";
import { get, put, del } from "../../services/api";
import { 
  Search, 
  ExternalLink, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Plus, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Zap,
  Globe,
  Trophy,
  Mail,
  MailCheck,
  SortDesc
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { containerVariants, itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";
import Select from "../../components/common/Select";

const Planning = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await get("/plans");
      // Centralized response mapping logic
      const data = response?.data?.data || response?.data || response;
      setPlans(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleMarkApplied = async (id) => {
    try {
      await put(`/plans/${id}`, { status: "applied" });
      toast.success("Marked as applied");
      fetchPlans();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await del(`/plans/${id}`);
      toast.success("Plan deleted");
      fetchPlans();
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const filteredPlans = useMemo(() => {
    const list = Array.isArray(plans) ? plans : [];
    return list.filter((plan) => {
      const matchesSearch = 
        plan.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.techStack?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.location?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || plan.status === filterStatus;
      const matchesPriority = filterPriority === "all" || plan.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => {
        return sortOrder === "newest"
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
    });
  }, [plans, searchQuery, filterStatus, filterPriority, sortOrder]);

  const stats = useMemo(() => {
    const list = Array.isArray(plans) ? plans : [];
    return {
      total: list.length,
      pending: list.filter(p => p.status === "pending").length,
      applied: list.filter(p => p.status === "applied").length,
    };
  }, [plans]);

  if (loading && plans.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      exit="exit" 
      variants={containerVariants} 
      className="h-full space-y-6"
    >
      {/* Stats Row - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl border ${colors.card} shadow-sm`}>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Planned Leads</p>
             <p className="text-2xl font-black dark:text-white mt-1">{stats.total}</p>
          </div>
          <div className={`p-4 rounded-2xl border ${colors.card} shadow-sm`}>
             <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-tight">Ready to Apply</p>
             <p className="text-2xl font-black dark:text-white mt-1">{stats.pending}</p>
          </div>
          <div className={`p-4 rounded-2xl border ${colors.card} shadow-sm`}>
             <p className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-tight">Converted</p>
             <p className="text-2xl font-black dark:text-white mt-1">{stats.applied}</p>
          </div>
          <button className={`p-4 rounded-2xl border ${colors.card} shadow-sm flex items-center justify-center hover:border-red-500/50 transition-colors group`}>
             <span className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 group-hover:scale-105 transition-transform">
               <Plus size={16} /> New Lead
             </span>
          </button>
      </div>

      {/* Unified Filter Bar - Matching Applications Style */}
      <motion.div variants={itemVariants}>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" size={18} />
              <input
                type="text"
                placeholder="Search by company, tech, or location..."
                className={`pl-10 pr-4 py-3 rounded-xl w-full outline-none transition-all font-medium text-sm border-transparent focus:border-red-500/50 ${colors.input}`}
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
                    { id: "bounced", label: "Bounced" }
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
                    { id: "Low", label: "Low" }
                  ]}
                />
              </div>
              <button
                onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
                className={`p-3 rounded-xl border flex items-center justify-center shrink-0 ${colors.card} hover:border-red-500/50 transition-colors`}
              >
                <SortDesc
                  size={20}
                  className={`transition-transform duration-300 ${sortOrder === "newest" ? "" : "rotate-180"}`}
                />
              </button>
            </div>
          </div>
      </motion.div>

      {/* Plans List - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPlans.map((plan) => (
            <motion.div
              layout
              key={plan._id}
              variants={itemVariants}
              className={`rounded-[32px] border ${colors.card} p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black border border-slate-100 dark:border-zinc-800 shadow-inner">
                    <Briefcase className="text-red-600" size={24} />
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                      plan.status === "applied" 
                      ? "bg-green-500/10 text-green-500 border-green-500/20" 
                      : plan.status === "bounced"
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                    }`}>
                      {plan.status}
                    </span>
                    {plan.priority === "High" && (
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/20 shadow-sm">Priority</span>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4 truncate leading-tight">
                  {plan.companyName}
                </h3>

                <div className="space-y-3 mb-6">
                  {plan.location && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-xs font-black uppercase tracking-wide opacity-80">
                      <MapPin size={14} className="opacity-40" /> {plan.location}
                    </div>
                  )}
                  {plan.package && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-xs font-black uppercase tracking-wide opacity-80">
                      <DollarSign size={14} className="opacity-40" /> {plan.package}
                    </div>
                  )}
                  {plan.email && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-sm font-mono lowercase">
                      {plan.mail?.sent ? <MailCheck size={14} className="text-green-500" /> : <Mail size={14} className="opacity-40" />}
                      {plan.email}
                    </div>
                  )}
                  {plan.jobLink && (
                    <a href={plan.jobLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-500 text-xs font-black uppercase tracking-widest hover:underline pt-1">
                      <Globe size={14} /> Open Lead <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {plan.theHook && (
                  <div className="mb-4 p-4 bg-blue-500/5 rounded-[20px] border border-blue-500/10 shadow-inner">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                      <Zap size={12} /> The Hook
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-3">{plan.theHook}</p>
                  </div>
                )}
                
                {plan.winningMove && (
                  <div className="mb-6 p-4 bg-amber-500/5 rounded-[20px] border border-amber-500/10 shadow-inner">
                    <p className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                      <Trophy size={12} /> Winning Move
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-3">{plan.winningMove}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-neutral-800">
                <div className="flex gap-2.5">
                  {plan.status === "pending" && (
                    <button onClick={() => handleMarkApplied(plan._id)} className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-95">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(plan._id)} className="p-3 bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-red-500 rounded-2xl transition-all active:scale-95">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mb-0.5">Identified</p>
                  <p className="text-xs font-mono dark:text-neutral-500 opacity-60 font-bold">{new Date(plan.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!loading && filteredPlans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 opacity-30">
          <Briefcase size={64} className="mb-4" />
          <p className="text-sm font-bold uppercase tracking-[0.3em]">No matching leads found</p>
        </div>
      )}
    </motion.div>
  );
};

export default Planning;
