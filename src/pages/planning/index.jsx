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
  Filter,
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
      setPlans(response.data || []);
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
    return plans.filter((plan) => {
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
    return {
      total: plans.length,
      pending: plans.filter(p => p.status === "pending").length,
      applied: plans.filter(p => p.status === "applied").length,
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
      className="h-full space-y-4 p-4 md:px-0"
    >
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className={`p-4 rounded-2xl border ${colors.card} shadow-sm`}>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Leads</p>
             <p className="text-2xl font-black dark:text-white">{stats.total}</p>
          </div>
          <div className={`p-4 rounded-2xl border ${colors.card} shadow-sm`}>
             <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Pending</p>
             <p className="text-2xl font-black dark:text-white">{stats.pending}</p>
          </div>
          <div className={`p-4 rounded-2xl border ${colors.card} shadow-sm`}>
             <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Applied</p>
             <p className="text-2xl font-black dark:text-white">{stats.applied}</p>
          </div>
          <div className={`p-4 rounded-2xl border ${colors.card} shadow-sm flex items-center justify-center`}>
             <button className="w-full h-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500">
               <Plus size={16} /> New Plan
             </button>
          </div>
      </div>

      {/* Unified Filter Bar */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-3 opacity-30 group-focus-within:opacity-100 transition-opacity" size={16} />
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
                    { id: "all", label: "All Status" },
                    { id: "pending", label: "Pending" },
                    { id: "applied", label: "Applied" },
                    { id: "bounced", label: "Bounced" }
                  ]}
                  placeholder="Status"
                />
              </div>
              <div className="flex-1 md:w-40">
                <Select
                  value={filterPriority}
                  onChange={setFilterPriority}
                  options={[
                    { id: "all", label: "All Priority" },
                    { id: "High", label: "High" },
                    { id: "Medium", label: "Medium" },
                    { id: "Low", label: "Low" }
                  ]}
                  placeholder="Priority"
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

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredPlans.map((plan) => (
            <motion.div
              layout
              key={plan._id}
              variants={itemVariants}
              className={`rounded-2xl border ${colors.card} p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-100 dark:border-zinc-800">
                    <Briefcase className="text-red-600" size={20} />
                  </div>
                  <div className="flex gap-1.5">
                    {plan.priority === "High" && (
                      <span className="bg-red-500/10 text-red-500 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-500/20">High</span>
                    )}
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      plan.status === "applied" 
                      ? "bg-green-500/10 text-green-500 border-green-500/20" 
                      : plan.status === "bounced"
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-3 truncate">
                  {plan.companyName}
                </h3>

                <div className="space-y-2 mb-4">
                  {plan.location && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-[11px] font-bold uppercase tracking-wide">
                      <MapPin size={12} className="opacity-50" /> {plan.location}
                    </div>
                  )}
                  {plan.email && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-[11px] font-mono lowercase">
                      {plan.mail?.sent ? <MailCheck size={12} className="text-green-500" /> : <Mail size={12} className="opacity-50" />}
                      {plan.email}
                    </div>
                  )}
                  {plan.jobLink && (
                    <a href={plan.jobLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-blue-500 text-[11px] font-bold uppercase tracking-wider hover:underline">
                      <Globe size={12} /> Job Link <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                {plan.theHook && (
                  <div className="mb-3 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">The Hook</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">{plan.theHook}</p>
                  </div>
                )}
                
                {plan.winningMove && (
                  <div className="mb-4 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">Winning Move</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">{plan.winningMove}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex gap-2">
                  {plan.status === "pending" && (
                    <button onClick={() => handleMarkApplied(plan._id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md">
                      <CheckCircle size={14} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(plan._id)} className="p-2 bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-red-500 rounded-lg transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-tighter">Created</p>
                  <p className="text-[10px] font-mono opacity-50">{new Date(plan.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!loading && filteredPlans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
          <Briefcase size={48} className="mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest">No matching leads found</p>
        </div>
      )}
    </motion.div>
  );
};

export default Planning;
