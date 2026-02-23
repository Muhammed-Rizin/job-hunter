import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Edit3, Globe, Search, SortDesc, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

import { useGlobal } from "../../context";
import { APPLICATION_STATUSES, PLATFORMS } from "../../config/job.constants";
import { containerVariants, itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";
import { formatDateDisplay } from "../../utils/date";
import TrackerCard from "../../components/tracker/TrackerCard";
import StatusSelect from "../../components/tracker/StatusSelect";
import LabeledInput from "../../components/common/LabeledInput";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

const Tracker = () => {
  const {
    applications,
    bouncedApps,
    setApplications,
    createApplication,
    updateApplicationStatus,
    deleteApplication,
  } = useGlobal();

  const [activeTab, setActiveTab] = useState("all"); // all, bounced

  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsApp, setDetailsApp] = useState(null);
  const [detailsStatus, setDetailsStatus] = useState("");
  const [detailsForm, setDetailsForm] = useState({ round: "", mode: "online", date: "", time: "" });

  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    company: "",
    role: "",
    source: "website",
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const filtered = useMemo(() => {
    const list = activeTab === "bounced" ? bouncedApps : applications;
    return list
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedApps = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, statusFilter, sourceFilter, sortOrder, activeTab]);

  const openDetails = (app, statusOverride) => {
    setDetailsApp(app);
    setDetailsStatus(statusOverride || app.status);
    setDetailsForm(app.statusDetails || { round: "", mode: "online", date: "", time: "" });
    setDetailsOpen(true);
  };

  const saveDetails = async () => {
    if (!detailsApp) return;
    if (updateApplicationStatus) {
      await updateApplicationStatus(detailsApp.id, detailsStatus, detailsForm);
    } else {
      setApplications((prev) =>
        prev.map((p) =>
          p.id === detailsApp.id ? { ...p, status: detailsStatus, statusDetails: detailsForm } : p,
        ),
      );
    }
    setDetailsOpen(false);
    toast.success("Details Updated");
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

  const showInterviewFields = ["interview", "technical", "hr_contact", "offer"].includes(
    detailsStatus,
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="h-full">
      <div className="space-y-4 p-4 md:px-0 h-full flex flex-col no-scrollbar">
        <motion.div
          variants={itemVariants}
          className={`p-4 rounded-2xl border mb-4 ${colors.card}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-neutral-800">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white' : 'text-slate-400'}`}
              >
                Applications
              </button>
              <button 
                onClick={() => setActiveTab("bounced")}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'bounced' ? 'bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-white' : 'text-slate-400'}`}
              >
                Bounced {bouncedApps.length > 0 && <span className="ml-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">{bouncedApps.length}</span>}
              </button>
            </div>
            <button
              onClick={() => setCreating((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.secondary}`}
            >
              {creating ? "Close" : "New"}
            </button>
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

        <div className="md:hidden space-y-4 pb-4 no-scrollbar">
          {filtered.map((app) => (
            <TrackerCard
              key={app.id}
              app={app}
              colors={colors}
              onDelete={() => deleteApplication(app.id)}
              onStatusChange={(item, status) => handleStatusChange(item, status)}
              onDetails={(item) => openDetails(item)}
            />
          ))}
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
            {paginatedApps.map((app) => (
              <motion.div
                variants={itemVariants}
                key={app.id}
                className="grid grid-cols-12 gap-4 items-center p-3 rounded-xl border transition-all hover:shadow-md bg-white border-gray-100 hover:border-gray-200 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-gray-50 border-gray-200 dark:bg-black dark:border-zinc-800">
                    <span className="font-bold text-xs">{app.company.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{app.company}</h4>
                    <p className="text-[10px] uppercase tracking-wider opacity-60">{app.role}</p>
                    {app.statusDetails?.date || app.statusDetails?.round ? (
                      <p className="text-[10px] opacity-60 mt-0.5 text-blue-500">
                        {app.statusDetails.round}{" "}
                        {app.statusDetails.date
                          ? `• ${formatDateDisplay(app.statusDetails.date)}`
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
                  <StatusSelect status={app.status} onChange={(v) => openDetails(app, v)} />
                  <button
                    onClick={() => openDetails(app)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit3 size={12} className="opacity-50" />
                  </button>
                </div>
                <div className="col-span-2 text-xs font-mono opacity-60">
                  {formatDateDisplay(app.appliedDate)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => handleDelete(app)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-gray-500/20">
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
            <span className="text-xs font-mono opacity-50">
              Page {currentPage} of {totalPages}
            </span>
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
          </div>
        )}
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl ${colors.card}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold tracking-wide">Status Details</h3>
              <button onClick={() => setDetailsOpen(false)}>
                <X size={18} className="opacity-50 hover:opacity-100" />
              </button>
            </div>

            <div className="space-y-4">
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

              {showInterviewFields && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 pt-2 border-t border-dashed border-gray-500/20"
                >
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
                        value={detailsForm.date}
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
                        value={detailsForm.time}
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
                      value={detailsForm.mode}
                      onChange={(v) => setDetailsForm({ ...detailsForm, mode: v })}
                      options={[
                        { id: "online", label: "Online" },
                        { id: "offline", label: "Offline" },
                      ]}
                    />
                  </label>
                </motion.div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setDetailsOpen(false)}
                  className={`px-4 py-2 text-xs border rounded-lg ${colors.secondary}`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveDetails}
                  className={`px-4 py-2 text-xs rounded-lg ${colors.primary}`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Tracker;
