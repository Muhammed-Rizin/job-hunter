import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, Globe, Search, SortDesc, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { useApplications } from "@/features/applications/context/ApplicationsContext";
import { APPLICATION_STATUSES, PLATFORMS } from "@/features/applications/constants/job.constants";
import { containerVariants, itemVariants } from "@/shared/utils/animations";
import { colors } from "@/shared/utils/theme";
import { formatDateDisplay } from "@/shared/utils/date";
import TrackerCard from "@/features/applications/components/TrackerCard";
import StatusSelect from "@/features/applications/components/StatusSelect";
import LabeledInput from "@/shared/components/common/LabeledInput";
import Select from "@/shared/components/common/Select";
import Button from "@/shared/components/common/Button";
import Tooltip from "@/shared/components/common/Tooltip";
import ListSkeleton from "@/shared/components/common/ListSkeleton";

const getTopDownAnimation = (index) => ({
  initial: { opacity: 0, y: -14 },
  animate: { opacity: 1, y: 0 },
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 22,
    delay: Math.min(index * 0.03, 0.24),
  },
});

const Tracker = () => {
  const {
    applications,
    bouncedApps,
    setApplications,
    applicationsMeta,
    applicationsLoading,
    fetchApplications,
    createApplication,
    updateApplicationStatus,
    deleteApplication,
  } = useApplications();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab === "bounced" ? "bounced" : "all",
  ); // all, bounced

  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [queryPending, setQueryPending] = useState(true);
  const hasMountedPageRef = useRef(false);

  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    company: "",
    role: "",
    source: "website",
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const bouncedFiltered = useMemo(() => {
    return bouncedApps
      .filter((app) => {
        const matchesText =
          (app.company || "").toLowerCase().includes(filter.toLowerCase()) ||
          (app.role || "").toLowerCase().includes(filter.toLowerCase());
        const matchesStatus = statusFilter === "all" || app.status === statusFilter;
        const matchesSource = sourceFilter === "all" || app.source === sourceFilter;
        return matchesText && matchesStatus && matchesSource;
      })
      .sort((a, b) => {
        return sortOrder === "newest"
          ? new Date(b.appliedDate) - new Date(a.appliedDate)
          : new Date(a.appliedDate) - new Date(b.appliedDate);
      });
  }, [bouncedApps, filter, sortOrder, sourceFilter, statusFilter]);

  const bouncedTotalPages = Math.max(1, Math.ceil(bouncedFiltered.length / ITEMS_PER_PAGE));
  const displayedApps =
    activeTab === "bounced"
      ? bouncedFiltered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
      : applications;
  const totalPages =
    activeTab === "bounced" ? bouncedTotalPages : Math.max(1, applicationsMeta?.pages || 1);

  useEffect(() => {
    const nextTab = location.state?.activeTab;
    if (nextTab === "all" || nextTab === "bounced") {
      setActiveTab(nextTab);
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, statusFilter, sourceFilter, sortOrder, activeTab]);

  useEffect(() => {
    if (activeTab !== "bounced") return;
    if (statusFilter !== "all" && statusFilter !== "bounced") {
      setStatusFilter("all");
    }
  }, [activeTab, statusFilter]);

  useEffect(() => {
    if (activeTab !== "all") {
      setQueryPending(false);
      return;
    }

    let cancelled = false;
    setQueryPending(true);

    const timeoutId = setTimeout(() => {
      fetchApplications({
        search: filter.trim(),
        status: statusFilter,
        source: sourceFilter,
        sort: sortOrder,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      }).finally(() => {
        if (!cancelled) {
          setQueryPending(false);
        }
      });
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [activeTab, currentPage, fetchApplications, filter, sortOrder, sourceFilter, statusFilter]);

  useEffect(() => {
    if (activeTab !== "bounced") return;
    if (currentPage > bouncedTotalPages) {
      setCurrentPage(bouncedTotalPages);
    }
  }, [activeTab, bouncedTotalPages, currentPage]);

  useEffect(() => {
    if (activeTab !== "all") return;
    const serverPages = Math.max(1, Number(applicationsMeta?.pages) || 1);
    if (currentPage > serverPages) {
      setCurrentPage(serverPages);
    }
  }, [activeTab, applicationsMeta?.pages, currentPage]);

  useEffect(() => {
    if (!hasMountedPageRef.current) {
      hasMountedPageRef.current = true;
      return;
    }

    const scrollContainer = document.getElementById("app-scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleStatusChange = async (app, newStatus) => {
    if (updateApplicationStatus) {
      await updateApplicationStatus(app.id, newStatus, app.statusDetails || {});
    } else {
      setApplications(prev => prev.map(p => p.id === app.id ? { ...p, status: newStatus } : p));
    }
  };

  const handleCreate = async () => {
    if (!createForm.company || !createForm.role) {
      toast.error("Company & Role required");
      return;
    }
    const payload = { ...createForm, id: Date.now() };
    if (createApplication) {
      await createApplication(payload);
    } else {
      setApplications((prev) => [payload, ...prev]);
    }
    setCreating(false);
    setCreateForm({
      company: "",
      role: "",
      source: "website",
      status: "applied",
      appliedDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    toast.success("Application Logged");
  };

  const handleDelete = async (app) => {
    if (!confirm("Delete?")) return;
    if (deleteApplication) {
      await deleteApplication(app.id);
    } else {
      setApplications((prev) => prev.filter((p) => p.id !== app.id));
    }
  };



  const showListSkeleton = activeTab === "all" && (queryPending || applicationsLoading);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="h-full min-h-0 overflow-hidden"
    >
      <div className="space-y-4 h-full min-h-0 flex flex-col no-scrollbar">
        <motion.div
          variants={itemVariants}
          className={`p-4 rounded-2xl border mb-4 ${colors.card}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-neutral-800">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "all" ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white" : "text-slate-400"}`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab("bounced")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "bounced" ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white" : "text-slate-400"}`}
              >
                Bounced{" "}
                {bouncedApps.length > 0 && (
                  <span className="ml-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {bouncedApps.length}
                  </span>
                )}
              </button>
            </div>
            <Tooltip content={creating ? "Close Form" : "Create Application"}>
              <button
                onClick={() => setCreating((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.secondary}`}
              >
                {creating ? "Close" : "New"}
              </button>
            </Tooltip>
          </div>

          {creating && (
            <div className="grid md:grid-cols-2 gap-3 animate-slide-up mt-4">
              <LabeledInput
                label="Company"
                value={createForm.company}
                onChange={(e) => setCreateForm({ ...createForm, company: e.target.value })}
                inputClassName={colors.input}
              />
              <LabeledInput
                label="Role"
                value={createForm.role}
                onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                inputClassName={colors.input}
              />
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select
                  className="w-full"
                  value={createForm.source}
                  onChange={(v) => setCreateForm({ ...createForm, source: v })}
                  options={PLATFORMS.filter((p) => p.id !== "all")}
                  placeholder="Source"
                />
                <Select
                  className="w-full"
                  value={createForm.status}
                  onChange={(v) => setCreateForm({ ...createForm, status: v })}
                  options={APPLICATION_STATUSES.filter((s) => s.id !== "all")}
                  placeholder="Status"
                />
                <input
                  type="date"
                  value={createForm.appliedDate}
                  onChange={(e) => setCreateForm({ ...createForm, appliedDate: e.target.value })}
                  className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
                />
              </div>
              <Button onClick={handleCreate} className={`md:col-span-2 py-3 ${colors.primary}`}>
                Save Application
              </Button>
            </div>
          )}
        </motion.div>

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
            <div className="flex gap-2 w-full md:w-auto">
              <div className="flex-1 md:w-40">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={APPLICATION_STATUSES}
                  placeholder="Status"
                />
              </div>
              <div className="flex-1 md:w-40">
                <Select
                  value={sourceFilter}
                  onChange={setSourceFilter}
                  options={PLATFORMS}
                  placeholder="Source"
                />
              </div>
              <Tooltip content={sortOrder === "newest" ? "Sort Oldest First" : "Sort Newest First"}>
                <button
                  onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
                  className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${colors.card}`}
                >
                  <SortDesc
                    size={18}
                    className={sortOrder === "newest" ? "" : "transform rotate-180"}
                  />
                </button>
              </Tooltip>
            </div>
          </div>
        </motion.div>

        {showListSkeleton && <ListSkeleton entries={6} />}

        <div
          className={`md:hidden space-y-4 pb-4 no-scrollbar ${showListSkeleton ? "hidden" : ""}`}
        >
          {displayedApps.map((app, index) => (
            <motion.div key={app.id} {...getTopDownAnimation(index)}>
              <TrackerCard
                app={app}
                colors={colors}
                onDelete={handleDelete}
                onStatusChange={(item, status) => openDetails(item, status)}
                onDetails={(item) => openDetails(item)}
              />
            </motion.div>
          ))}
        </div>

        <div
          className={`hidden md:block flex-1 min-h-0 overflow-hidden no-scrollbar ${showListSkeleton ? "md:hidden" : ""}`}
        >
          <div className="min-w-200 md:min-w-0 space-y-2">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-widest opacity-50">
              <div className="col-span-4">Company</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1 text-right">Action</div>
            </div>
            {displayedApps.map((app, index) => (
              <motion.div
                key={app.id}
                {...getTopDownAnimation(index)}
                className="grid grid-cols-12 gap-4 items-center p-3 rounded-xl border transition-all hover:shadow-md bg-white border-gray-100 hover:border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-gray-50 border-gray-200 dark:bg-black dark:border-zinc-800">
                    <span className="font-bold text-xs">{(app.company || "?").charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{app.company || "Unknown Company"}</h4>
                    <p className="text-[10px] uppercase tracking-wider opacity-60">
                      {app.role || "-"}
                    </p>
                    {app.statusDetails?.date || app.statusDetails?.round ? (
                      <p className="text-[10px] opacity-60 mt-0.5 text-blue-500">
                        {app.statusDetails.round}{" "}
                        {app.statusDetails.date
                          ? `- ${formatDateDisplay(app.statusDetails.date)}`
                          : ""}
                      </p>
                    ) : null}
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
                <div className="col-span-3 flex items-center gap-2">
                  <StatusSelect status={app.status} onChange={(v) => handleStatusChange(app, v)} />
                  <Tooltip content="Edit Status Details">
                    <button
                      onClick={() => navigate(`/tracker/${app.id || app._id}`)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit3 size={12} className="opacity-50" />
                    </button>
                  </Tooltip>
                </div>
                <div className="col-span-2 text-xs font-mono opacity-60">
                  {formatDateDisplay(app.appliedDate)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <Tooltip content="Delete Application">
                    <button
                      onClick={() => handleDelete(app)}
                      className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </Tooltip>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {!showListSkeleton && displayedApps.length === 0 && (
          <div className={`text-sm p-6 rounded-xl border text-center ${colors.card}`}>
            No applications found.
          </div>
        )}

        {!showListSkeleton && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pb-8 md:pb-0 pt-4 border-t border-dashed border-gray-500/20">
            <Tooltip content="Previous Page" disabled={currentPage === 1}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                  currentPage === 1
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-50 dark:hover:bg-zinc-800"
                } ${colors.secondary}`}
              >
                Previous
              </button>
            </Tooltip>
            <span className="text-xs font-mono opacity-50">
              Page {currentPage} of {totalPages}
            </span>
            <Tooltip content="Next Page" disabled={currentPage === totalPages}>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                  currentPage === totalPages
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-50 dark:hover:bg-zinc-800"
                } ${colors.secondary}`}
              >
                Next
              </button>
            </Tooltip>
          </div>
        )}
      </div>


    </motion.div>
  );
};

export default Tracker;
