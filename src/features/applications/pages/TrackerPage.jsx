import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, MoreHorizontal, Search, SortDesc, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

import { useApplications } from "@/features/applications/context/ApplicationsContext";
import { APPLICATION_STATUSES, PLATFORMS } from "@/features/applications/constants/job.constants";
import { containerVariants, itemVariants } from "@/shared/utils/animations";
import { colors } from "@/shared/utils/theme";
import { formatDateDisplay } from "@/shared/utils/date";
import { confirmDelete, themeSwal } from "@/shared/utils/swal";
import TrackerCard from "@/features/applications/components/TrackerCard";
import StatusSelect from "@/features/applications/components/StatusSelect";
import LabeledInput from "@/shared/components/common/LabeledInput";
import Select from "@/shared/components/common/Select";
import Button from "@/shared/components/common/Button";
import Tooltip from "@/shared/components/common/Tooltip";
import ListSkeleton from "@/shared/components/common/ListSkeleton";

const DEFAULT_STATUS_DETAILS = { round: "", mode: "online", date: "", time: "" };

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

const statusLabel = (statusId = "") => {
  const match = APPLICATION_STATUSES.find((item) => item.id === statusId);
  return match?.label || String(statusId).replace(/_/g, " ");
};

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
    location.state?.activeTab === "bounced" ? "bounced" : "all"
  );

  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [queryPending, setQueryPending] = useState(true);
  const hasMountedPageRef = useRef(false);

  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    company: "",
    role: "",
    source: "website",
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [selectedAppId, setSelectedAppId] = useState(null);
  const [statusIntent, setStatusIntent] = useState(null);
  const [detailsStatus, setDetailsStatus] = useState("applied");
  const [detailsForm, setDetailsForm] = useState(DEFAULT_STATUS_DETAILS);
  const [isDetailsSaving, setIsDetailsSaving] = useState(false);

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

  const bouncedTotalPages = Math.max(1, Math.ceil(bouncedFiltered.length / itemsPerPage));

  const displayedApps =
    activeTab === "bounced"
      ? bouncedFiltered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : applications;

  const totalPages =
    activeTab === "bounced" ? bouncedTotalPages : Math.max(1, applicationsMeta?.pages || 1);

  const allKnownApps = useMemo(() => {
    const merged = [...(applications || []), ...(bouncedApps || [])];
    const map = new Map();
    merged.forEach((app) => {
      const key = app.id || app._id;
      if (key) map.set(String(key), app);
    });
    return Array.from(map.values());
  }, [applications, bouncedApps]);

  const selectedApp = useMemo(() => {
    if (!selectedAppId) return null;
    return allKnownApps.find((app) => String(app.id || app._id) === String(selectedAppId)) || null;
  }, [allKnownApps, selectedAppId]);

  const historyEntries = useMemo(() => {
    const entries = Array.isArray(selectedApp?.statusHistory) ? selectedApp.statusHistory : [];
    return [...entries].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
  }, [selectedApp]);

  const closeModal = () => {
    setSelectedAppId(null);
    setStatusIntent(null);
  };

  const openDetails = (app) => {
    if (!app) return;
    setStatusIntent(null);
    setSelectedAppId(app.id || app._id);
  };

  const openStatusModal = (app, nextStatus) => {
    if (!app) return;
    setStatusIntent(nextStatus || null);
    setSelectedAppId(app.id || app._id);
  };

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
        limit: itemsPerPage,
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

  useEffect(() => {
    if (!selectedAppId) return;
    if (!selectedApp) {
      closeModal();
      return;
    }

    setDetailsStatus(statusIntent || selectedApp.status || "applied");
    setDetailsForm(selectedApp.statusDetails || DEFAULT_STATUS_DETAILS);
  }, [selectedAppId, selectedApp, statusIntent]);

  useEffect(() => {
    if (detailsStatus === "hr_contact" && !detailsForm.round) {
      setDetailsForm((prev) => ({ ...prev, round: "HR Call 1" }));
    }
  }, [detailsForm.round, detailsStatus]);

  const showInterviewFields = ["interview", "technical", "hr_contact", "offer"].includes(
    detailsStatus
  );

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
    const result = await confirmDelete(
      "Delete Application?",
      `Are you sure you want to delete your application for ${app.company}?`
    );
    if (!result.isConfirmed) return;

    if (deleteApplication) {
      await deleteApplication(app.id || app._id);
    } else {
      setApplications((prev) => prev.filter((p) => p.id !== app.id));
    }

    if (selectedAppId && String(selectedAppId) === String(app.id || app._id)) {
      closeModal();
    }
    toast.success("Application removed");
  };

  const handleMoreActions = (app) => {
    themeSwal.fire({
      title: app.company,
      html: `<p class="text-sm opacity-50 mb-6">${app.role}</p>`,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        ...themeSwal.getParams().customClass,
        popup: `${themeSwal.getParams().customClass.popup} max-w-sm`,
      },
      footer: `
        <div class="grid grid-cols-2 gap-2 w-full p-4">
          <button id="swal-edit" class="py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-red-600 transition-all">Edit Details</button>
          <button id="swal-copy" class="py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-red-600 transition-all">Copy Info</button>
          <button id="swal-delete" class="col-span-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all mt-2">Delete Forever</button>
        </div>
      `,
      didOpen: () => {
        document.getElementById("swal-edit")?.addEventListener("click", () => {
          themeSwal.close();
          openDetails(app);
        });
        document.getElementById("swal-copy")?.addEventListener("click", () => {
          navigator.clipboard.writeText(`${app.role} at ${app.company}`);
          toast.success("Copied to clipboard");
          themeSwal.close();
        });
        document.getElementById("swal-delete")?.addEventListener("click", () => {
          themeSwal.close();
          handleDelete(app);
        });
      },
    });
  };

  const handleSaveDetails = async () => {
    if (!selectedApp) return;

    try {
      setIsDetailsSaving(true);
      await updateApplicationStatus(selectedApp.id || selectedApp._id, detailsStatus, detailsForm);
      setStatusIntent(null);
      toast.success("Status updated and logged");
    } catch (error) {
      toast.error(error?.message || "Failed to update details");
    } finally {
      setIsDetailsSaving(false);
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
                {bouncedApps.length > 0 ? (
                  <span className="ml-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {bouncedApps.length}
                  </span>
                ) : null}
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

          {creating ? (
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
          ) : null}
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

        {showListSkeleton ? <ListSkeleton entries={6} /> : null}

        <div
          className={`md:hidden space-y-4 pb-4 no-scrollbar ${showListSkeleton ? "hidden" : ""}`}
        >
          {displayedApps.map((app, index) => (
            <motion.div key={app.id || app._id} {...getTopDownAnimation(index)}>
              <TrackerCard
                app={app}
                colors={colors}
                onDelete={handleDelete}
                onMore={handleMoreActions}
                onStatusChange={(item, status) => openStatusModal(item, status)}
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
                key={app.id || app._id}
                {...getTopDownAnimation(index)}
                onClick={() => openDetails(app)}
                className="grid grid-cols-12 gap-4 items-center p-3 rounded-xl border transition-all hover:shadow-md bg-white border-gray-100 hover:border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 cursor-pointer"
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
                <div
                  className="col-span-3 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <StatusSelect status={app.status} onChange={(v) => openStatusModal(app, v)} />
                </div>
                <div className="col-span-2 text-xs font-mono opacity-60">
                  {formatDateDisplay(app.appliedDate)}
                </div>
                <div
                  className="col-span-1 flex justify-end items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tooltip content="More Options">
                    <button
                      onClick={() => handleMoreActions(app)}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-gray-400"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Delete Application">
                    <button
                      onClick={() => handleDelete(app)}
                      className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400 group"
                    >
                      <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </Tooltip>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {!showListSkeleton && displayedApps.length === 0 ? (
          <div className={`text-sm p-6 rounded-xl border text-center ${colors.card}`}>
            No applications found.
          </div>
        ) : null}

        {!showListSkeleton && totalPages > 1 ? (
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
        ) : null}
      </div>

      <AnimatePresence>
        {selectedApp ? (
          <motion.div
            key="tracker-detail-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[32px] border ${colors.card} p-8 shadow-2xl relative`}
            >
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  {selectedApp.company || "Unknown Company"}
                </h2>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">
                  {selectedApp.role || "Role Unspecified"}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-dashed border-gray-500/20">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                    Status
                  </span>
                  <Select
                    value={detailsStatus}
                    onChange={setDetailsStatus}
                    options={APPLICATION_STATUSES.filter((s) => s.id !== "all")}
                    className="w-full"
                  />
                </label>

                {showInterviewFields ? (
                  <div className="space-y-4 pt-2">
                    <LabeledInput
                      label="Round"
                      value={detailsForm.round}
                      onChange={(e) => setDetailsForm({ ...detailsForm, round: e.target.value })}
                      inputClassName={colors.input}
                      placeholder="e.g. Technical, HR"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                          Date
                        </label>
                        <input
                          type="date"
                          value={detailsForm.date || ""}
                          onChange={(e) => setDetailsForm({ ...detailsForm, date: e.target.value })}
                          className={`w-full p-3 rounded-xl text-sm font-medium outline-none ${colors.input}`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                          Time
                        </label>
                        <input
                          type="time"
                          value={detailsForm.time || ""}
                          onChange={(e) => setDetailsForm({ ...detailsForm, time: e.target.value })}
                          className={`w-full p-3 rounded-xl text-sm font-medium outline-none ${colors.input}`}
                        />
                      </div>
                    </div>

                    <label className="block">
                      <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                        Mode
                      </span>
                      <Select
                        value={detailsForm.mode || "online"}
                        onChange={(v) => setDetailsForm({ ...detailsForm, mode: v })}
                        options={[
                          { id: "online", label: "Online" },
                          { id: "offline", label: "Offline" },
                        ]}
                      />
                    </label>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 p-4 rounded-2xl border border-dashed border-gray-500/20">
                <h4 className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-3">
                  Status Change Log
                </h4>
                {historyEntries.length === 0 ? (
                  <p className="text-xs opacity-50">No status history yet.</p>
                ) : (
                  <div className="space-y-2">
                    {historyEntries.map((entry, idx) => (
                      <div
                        key={`${entry.changedAt || idx}-${idx}`}
                        className="p-3 rounded-xl border border-gray-500/10"
                      >
                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                          {entry.fromStatus ? statusLabel(entry.fromStatus) : "Initial"} to{" "}
                          {statusLabel(entry.toStatus)}
                        </p>
                        <p className="text-[10px] font-mono opacity-50 mt-1">
                          {entry.changedAt
                            ? new Date(entry.changedAt).toLocaleString()
                            : "Unknown time"}
                        </p>
                        {entry.statusDetails?.round ||
                        entry.statusDetails?.date ||
                        entry.statusDetails?.time ? (
                          <p className="text-[10px] opacity-60 mt-1">
                            {entry.statusDetails?.round ? `${entry.statusDetails.round}` : ""}
                            {entry.statusDetails?.date
                              ? ` | ${formatDateDisplay(entry.statusDetails.date)}`
                              : ""}
                            {entry.statusDetails?.time ? ` ${entry.statusDetails.time}` : ""}
                            {entry.statusDetails?.mode ? ` | ${entry.statusDetails.mode}` : ""}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button variant="secondary" onClick={closeModal} className="w-auto">
                  Close
                </Button>
                <Button onClick={handleSaveDetails} disabled={isDetailsSaving} className="w-auto">
                  {isDetailsSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default Tracker;
