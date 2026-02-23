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
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Planning = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, applied
  const [filterPriority, setFilterPriority] = useState("all");

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
    });
  }, [plans, searchQuery, filterStatus, filterPriority]);

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
    <div className="space-y-8 p-1 md:p-4">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Planning</h1>
          <p className="text-slate-500 dark:text-neutral-400 font-medium uppercase tracking-widest text-[10px] mt-1">Target Companies & Pipeline</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
             <p className="text-xl font-black dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm">
             <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Pending</p>
             <p className="text-xl font-black dark:text-white">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm">
             <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Applied</p>
             <p className="text-xl font-black dark:text-white">{stats.applied}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by company, tech, or location..."
            className="w-full bg-white dark:bg-zinc-900 pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-neutral-800 outline-none focus:border-red-500/50 transition-all dark:text-white font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-white dark:bg-zinc-900 px-4 py-4 rounded-2xl border border-slate-200 dark:border-neutral-800 outline-none dark:text-white font-bold text-xs uppercase tracking-widest cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="applied">Applied</option>
          </select>
          <select 
            className="bg-white dark:bg-zinc-900 px-4 py-4 rounded-2xl border border-slate-200 dark:border-neutral-800 outline-none dark:text-white font-bold text-xs uppercase tracking-widest cursor-pointer"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPlans.map((plan) => (
            <motion.div
              layout
              key={plan._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-200 dark:border-neutral-800 p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-100 dark:border-neutral-800">
                    <Briefcase className="text-red-600" size={24} />
                  </div>
                  <div className="flex gap-2">
                    {plan.priority === "High" && (
                      <span className="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-200 dark:border-red-900/30">High</span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      plan.status === "applied" 
                      ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30" 
                      : "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-900/30"
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2 truncate" title={plan.companyName}>
                  {plan.companyName}
                </h3>

                <div className="space-y-3 mb-6">
                  {plan.location && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-sm font-medium">
                      <MapPin size={14} className="text-slate-400" /> {plan.location}
                    </div>
                  )}
                  {plan.package && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-sm font-medium">
                      <DollarSign size={14} className="text-slate-400" /> {plan.package}
                    </div>
                  )}
                  {plan.techStack && (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-neutral-400 text-sm font-medium">
                      <Zap size={14} className="text-slate-400" /> {plan.techStack}
                    </div>
                  )}
                  {plan.jobLink && (
                    <a 
                      href={plan.jobLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
                    >
                      <Globe size={14} /> View Job Post <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {plan.theHook && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Zap size={10} /> The Hook
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{plan.theHook}</p>
                  </div>
                )}

                {plan.winningMove && (
                  <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20">
                    <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Trophy size={10} /> Winning Move
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{plan.winningMove}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-neutral-800">
                <div className="flex gap-2">
                  {plan.status === "pending" && (
                    <button 
                      onClick={() => handleMarkApplied(plan._id)}
                      className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
                      title="Mark as Applied"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(plan._id)}
                    className="p-3 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-neutral-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all"
                    title="Delete Plan"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Created</p>
                  <p className="text-xs font-mono dark:text-neutral-500">{new Date(plan.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPlans.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center opacity-50">
          <Briefcase size={64} className="mb-4 text-slate-300 dark:text-neutral-800" />
          <h2 className="text-2xl font-black dark:text-white tracking-tighter">No plans found</h2>
          <p className="text-slate-500 dark:text-neutral-500 font-medium max-w-xs mx-auto">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  );
};

export default Planning;
