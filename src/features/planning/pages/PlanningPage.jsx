import { useState, useEffect, useMemo } from "react";
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
  Copy,
  Zap,
  Trophy,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { containerVariants, itemVariants } from "@/shared/utils/animations";
import { colors } from "@/shared/utils/theme";
import Select from "@/shared/components/common/Select";
import { usePlanning } from "@/features/planning/context/PlanningContext";
import PlanningSkeleton from "@/features/planning/components/PlanningSkeleton";
import Card from "@/shared/components/common/Card";
import Button from "@/shared/components/common/Button";
import Input from "@/shared/components/common/Input";

const getTopDownAnimation = (index) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  visible: { transition: { type: "spring", stiffness: 300, damping: 24 } },
});

const Planning = () => {
  const { plans, loading, error, markApplied, deletePlan, createPlan } = usePlanning();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Modal State
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    companyName: "",
    jobLink: "",
    email: "",
    location: "",
    package: "",
    priority: "Medium",
    techStack: "",
    theHook: "",
    winningMove: "",
    portalType: "",
    customPitch: "",
  });

  useEffect(() => {
    if (error) toast.error("Failed to fetch plans");
  }, [error]);

  const handleMarkApplied = async (id, e) => {
    e?.stopPropagation();
    try {
      await markApplied(id);
      toast.success("Marked as applied");
      if (selectedPlan && selectedPlan._id === id) {
          setSelectedPlan(prev => ({...prev, status: 'applied'}));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await deletePlan(id);
      toast.success("Plan deleted");
      if (selectedPlan && selectedPlan._id === id) setSelectedPlan(null);
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!newLead.companyName) return toast.error("Company Name is required");
    try {
      await createPlan(newLead);
      toast.success("Lead created successfully");
      setIsCreateModalOpen(false);
      setNewLead({
        companyName: "",
        jobLink: "",
        email: "",
        location: "",
        package: "",
        priority: "Medium",
        techStack: "",
        theHook: "",
        winningMove: "",
        portalType: "",
        customPitch: "",
      });
    } catch (error) {
      toast.error("Failed to create lead");
    }
  };

  const copyPitch = (pitch, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(pitch);
    toast.success("Pitch copied to clipboard!");
  };

  const filteredPlans = useMemo(() => {
    const list = Array.isArray(plans) ? plans : [];
    return list
      .filter((plan) => {
        const matchesSearch =
          (plan.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (plan.techStack || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (plan.location || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (plan.portalType || "").toLowerCase().includes(searchQuery.toLowerCase());

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
            Applied
          </p>
          <p className="text-2xl font-black dark:text-white mt-1">{stats.applied}</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className={`p-4 rounded-2xl border ${colors.card} shadow-sm flex items-center justify-center hover:border-red-500/50 transition-colors group cursor-pointer`}
        >
          <span className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-red-500 group-hover:scale-105 transition-transform">
            <Plus size={16} /> New Lead
          </span>
        </button>
      </div>

      {/* Unified Filter Bar */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-3 opacity-30 group-focus-within:opacity-100 transition-opacity" size={16} />
            <input
              type="text"
              placeholder="Search leads, stacks or portals..."
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

      {/* Plans List */}
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
                onClick={() => setSelectedPlan(plan)}
                className={`rounded-2xl border ${colors.card} p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer`}
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

                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight truncate leading-tight">
                      {plan.companyName}
                    </h3>
                    {plan.portalType && (
                      <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-1">
                        Portal: {plan.portalType}
                      </p>
                    )}
                  </div>

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
                  </div>

                  <div className="line-clamp-2">
                    {plan.customPitch && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic mb-2">
                          "{plan.customPitch}"
                        </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-neutral-800 mt-2">
                  <div className="flex gap-2.5">
                    {plan.status === "pending" && (
                      <button
                        onClick={(e) => handleMarkApplied(plan._id, e)}
                        className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-md active:scale-95"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(plan._id, e)}
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

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPlan(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] border ${colors.card} p-8 shadow-2xl relative`}
            >
              <button 
                onClick={() => setSelectedPlan(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/20">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedPlan.companyName}</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">{selectedPlan.portalType || 'General'} Lead</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <MapPin size={18} className="text-slate-400" />
                      <span className="text-sm font-bold uppercase tracking-wide">{selectedPlan.location || 'Location Not Specified'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <DollarSign size={18} className="text-slate-400" />
                      <span className="text-sm font-bold uppercase tracking-wide">{selectedPlan.package || 'Budget Not Specified'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <Zap size={18} className="text-slate-400" />
                      <span className="text-sm font-bold uppercase tracking-wide">{selectedPlan.techStack || 'Stack Not Specified'}</span>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                      <Mail size={18} className="text-slate-400" />
                      <span className="text-sm font-mono">{selectedPlan.email || 'No email provided'}</span>
                    </div>
                    {selectedPlan.jobLink && (
                       <a href={selectedPlan.jobLink} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-blue-500 hover:underline">
                         <Globe size={18} />
                         <span className="text-sm font-black uppercase tracking-widest">Visit Job Portal <ExternalLink size={12} className="inline ml-1"/></span>
                       </a>
                    )}
                 </div>
              </div>

              <div className="space-y-6">
                {selectedPlan.customPitch && (
                  <div className="p-6 bg-red-600/5 rounded-3xl border border-red-500/10">
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="text-xs font-black uppercase tracking-widest text-red-500">Elevator Pitch</h4>
                       <button onClick={(e) => copyPitch(selectedPlan.customPitch, e)} className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-800 border border-red-500/20 rounded-full text-[10px] font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm cursor-pointer">
                          <Copy size={12} /> Copy
                       </button>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic font-medium">"{selectedPlan.customPitch}"</p>
                  </div>
                )}

                {selectedPlan.theHook && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 flex items-center gap-2">
                       <Zap size={14} /> Strategic Hook
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{selectedPlan.theHook}</p>
                  </div>
                )}

                {selectedPlan.winningMove && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-2">
                       <Trophy size={14} /> Execution Advice
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{selectedPlan.winningMove}</p>
                  </div>
                )}
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                 <div className="text-slate-400 text-[10px] font-mono uppercase">
                    Added: {new Date(selectedPlan.createdAt).toLocaleString()}
                 </div>
                 <div className="flex gap-3">
                   <Button variant="secondary" onClick={() => setSelectedPlan(null)} className="w-auto">Close</Button>
                   {selectedPlan.status === 'pending' && (
                     <Button onClick={(e) => handleMarkApplied(selectedPlan._id, e)} className="w-auto">Mark as Applied</Button>
                   )}
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[32px] border ${colors.card} p-8 shadow-2xl relative`}
            >
              <h2 className="text-3xl font-black mb-8 tracking-tighter">New Opportunity</h2>
              
              <form onSubmit={handleCreateLead} className="space-y-6 text-left">
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Company Name</label>
                      <input 
                        required
                        className={`w-full p-3 rounded-xl outline-none text-sm font-medium border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white ${colors.input}`}
                        value={newLead.companyName} 
                        onChange={(e) => setNewLead({...newLead, companyName: e.target.value})}
                      />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Job URL</label>
                      <input 
                        className={`w-full p-3 rounded-xl outline-none text-sm font-medium border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white ${colors.input}`}
                        value={newLead.jobLink} 
                        onChange={(e) => setNewLead({...newLead, jobLink: e.target.value})}
                      />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Contact Email</label>
                      <input 
                        className={`w-full p-3 rounded-xl outline-none text-sm font-medium border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white ${colors.input}`}
                        value={newLead.email} 
                        onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                      />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Location</label>
                      <input 
                        className={`w-full p-3 rounded-xl outline-none text-sm font-medium border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white ${colors.input}`}
                        value={newLead.location} 
                        onChange={(e) => setNewLead({...newLead, location: e.target.value})}
                      />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Package / Salary</label>
                      <input 
                        className={`w-full p-3 rounded-xl outline-none text-sm font-medium border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white ${colors.input}`}
                        value={newLead.package} 
                        onChange={(e) => setNewLead({...newLead, package: e.target.value})}
                      />
                  </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Priority Level</label>
                      <Select 
                        value={newLead.priority}
                        onChange={(val) => setNewLead({...newLead, priority: val})}
                        options={[
                          { id: "High", label: "High Priority" },
                          { id: "Medium", label: "Medium Priority" },
                          { id: "Low", label: "Low Priority" }
                        ]}
                      />
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Tech Stack</label>
                      <input 
                        className={`w-full p-3 rounded-xl outline-none text-sm font-medium border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white ${colors.input}`}
                        placeholder="e.g. MERN, Angular"
                        value={newLead.techStack} 
                        onChange={(e) => setNewLead({...newLead, techStack: e.target.value})}
                      />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">Portal Type</label>
                      <input 
                        className={`w-full p-3 rounded-xl outline-none text-sm font-medium border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white ${colors.input}`}
                        placeholder="e.g. Workday, Greenhouse"
                        value={newLead.portalType} 
                        onChange={(e) => setNewLead({...newLead, portalType: e.target.value})}
                      />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest ml-1">Strategic Hook</label>
                      <textarea 
                        className={`w-full p-4 rounded-2xl outline-none text-sm font-medium min-h-24 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white ${colors.input}`}
                        value={newLead.theHook}
                        onChange={(e) => setNewLead({...newLead, theHook: e.target.value})}
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest ml-1">Custom Pitch (Cover Letter summary)</label>
                      <textarea 
                        className={`w-full p-4 rounded-2xl outline-none text-sm font-medium min-h-24 border-2 border-red-500/10 bg-white dark:bg-black text-gray-900 dark:text-white ${colors.input}`}
                        value={newLead.customPitch}
                        onChange={(e) => setNewLead({...newLead, customPitch: e.target.value})}
                      />
                   </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button variant="secondary" type="button" onClick={() => setIsCreateModalOpen(false)} className="w-auto">Cancel</Button>
                  <Button type="submit" className="w-auto">Ingest Lead</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
