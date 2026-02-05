import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Search, SortDesc, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

import { useGlobal } from "../../context";
import { APPLICATION_STATUSES, PLATFORMS } from "../../config/job.constants";
import { containerVariants, itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";
import TrackerCard from "../../components/tracker/TrackerCard";
import LabeledInput from "../../components/common/LabeledInput";
import { formatDateDisplay } from "../../utils/date";

const Tracker = () => {
  const location = useLocation();
  const {
    applications,
    applicationsLoading,
    createApplication,
    updateApplicationStatus,
    deleteApplication,
  } = useGlobal();
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [creating, setCreating] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsApp, setDetailsApp] = useState(null);
  const [detailsStatus, setDetailsStatus] = useState("");
  const [detailsForm, setDetailsForm] = useState({
    round: "",
    mode: "online",
    date: "",
    time: "",
  });
  const [form, setForm] = useState({
    company: "",
    role: "",
    source: "website",
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const filtered = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesText =
          String(app.company || "")
            .toLowerCase()
            .includes(filter.toLowerCase()) ||
          String(app.role || "")
            .toLowerCase()
            .includes(filter.toLowerCase());
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

  useEffect(() => {
    if (location.state?.openCreate) {
      setCreating(true);
    }
  }, [location.state]);

  const openDetails = (app, statusOverride) => {
    const nextStatus = statusOverride || app.status;
    const existing = app.statusDetails || {};
    setDetailsApp(app);
    setDetailsStatus(nextStatus);
    setDetailsForm({
      round: existing.round || "",
      mode: existing.mode || "online",
      date: existing.date || app.appliedDate || "",
      time: existing.time || "",
    });
    setDetailsOpen(true);
  };

  const handleStatusChange = (app, status) => {
    if (status === "interview") {
      openDetails(app, status);
      return;
    }
    updateApplicationStatus(app.id, status);
  };

  const saveDetails = async () => {
    if (!detailsApp) return;
    await updateApplicationStatus(detailsApp.id, detailsStatus, detailsForm);
    setDetailsOpen(false);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="h-full"
    >
      <div className="space-y-4 p-4 md:px-0 h-full flex flex-col no-scrollbar">
        <motion.div variants={itemVariants} className={`p-4 rounded-2xl border ${colors.card}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm tracking-wide">Log Application</h3>
              <p className="text-[10px] uppercase tracking-widest opacity-50">
                Add a new application manually
              </p>
            </div>
            <button
              onClick={() => setCreating((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.secondary}`}
            >
              {creating ? "Close" : "New"}
            </button>
          </div>

          {creating ? (
            <div className="grid md:grid-cols-2 gap-3">
              <LabeledInput
                label="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                inputClassName={colors.input}
              />
              <LabeledInput
                label="Role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                inputClassName={colors.input}
              />
              <label className="block md:col-span-2">
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                  Source / Status / Applied Date
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    className={`custom-select px-3 py-2.5 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} w-full`}
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                  >
                    {PLATFORMS.filter((p) => p.id !== "all").map((platform) => (
                      <option key={platform.id} value={platform.id}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className={`custom-select px-3 py-2.5 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} w-full`}
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {APPLICATION_STATUSES.filter((s) => s.id !== "all").map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={form.appliedDate}
                    onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
                    className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
                  />
                </div>
              </label>
              <label className="md:col-span-2 block">
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                  Notes
                </span>
                <textarea
                  rows={3}
                  className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </label>
              <button
                onClick={async () => {
                  if (!form.company || !form.role) {
                    toast.error("Company and Role are required");
                    return;
                  }
                  try {
                    await createApplication(form);
                    toast.success("Application logged");
                    setForm({
                      company: "",
                      role: "",
                      source: "website",
                      status: "applied",
                      appliedDate: new Date().toISOString().split("T")[0],
                      notes: "",
                    });
                    setCreating(false);
                  } catch (error) {
                    toast.error(error?.message || "Unable to log application");
                  }
                }}
                className={`md:col-span-2 py-3 rounded-xl font-bold text-sm uppercase tracking-wider ${colors.primary}`}
              >
                Save Application
              </button>
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
              onDelete={() => deleteApplication(app.id)}
              onStatusChange={(item, status) => handleStatusChange(item, status)}
              onDetails={(item) => openDetails(item)}
            />
          ))}
          {applicationsLoading ? (
            <div className="text-center py-10 opacity-40 text-xs font-bold uppercase tracking-widest">
              Loading applications...
            </div>
          ) : (
            filtered.length === 0 && (
              <div className="text-center py-10 opacity-40 text-xs font-bold uppercase tracking-widest">
                No applications found.
              </div>
            )
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
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-gray-50 border-gray-200 dark:bg-black dark:border-zinc-800">
                    <span className="font-bold text-xs">{app.company.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{app.company}</h4>
                    <p className="text-[10px] uppercase tracking-wider opacity-60">{app.role}</p>
                    {app.statusDetails?.date || app.statusDetails?.round || app.statusDetails?.mode ? (
                      <p className="text-[10px] opacity-60">
                        {app.statusDetails?.round ? `${app.statusDetails.round}` : ""}
                        {app.statusDetails?.mode ? `${app.statusDetails.round ? " • " : ""}${app.statusDetails.mode}` : ""}
                        {app.statusDetails?.date ? `${app.statusDetails.round || app.statusDetails.mode ? " • " : ""}${formatDateDisplay(app.statusDetails.date)}` : ""}
                        {app.statusDetails?.time ? ` ${app.statusDetails.time}` : ""}
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
                <div className="col-span-3">
                  <select
                    className={`custom-select px-3 py-2.5 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} w-full`}
                    value={app.status}
                    onChange={(e) => handleStatusChange(app, e.target.value)}
                  >
                    {APPLICATION_STATUSES.filter((s) => s.id !== "all").map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => openDetails(app)}
                    className="mt-2 text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100"
                  >
                    Details
                  </button>
                </div>
                <div className="col-span-2 text-xs font-mono opacity-60">
                  {formatDateDisplay(app.appliedDate)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => deleteApplication(app.id)}
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

      {detailsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className={`w-full max-w-md rounded-2xl border p-5 ${colors.card}`}>
            <h3 className="text-sm font-bold tracking-wide mb-4">Status Details</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                  Status
                </span>
                <select
                  className={`custom-select px-3 py-2.5 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} w-full`}
                  value={detailsStatus}
                  onChange={(e) => setDetailsStatus(e.target.value)}
                >
                  {APPLICATION_STATUSES.filter((s) => s.id !== "all").map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
              <LabeledInput
                label="Round (Optional)"
                value={detailsForm.round}
                onChange={(e) => setDetailsForm({ ...detailsForm, round: e.target.value })}
                inputClassName={colors.input}
              />
              <label className="block">
                <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
                  Mode (Optional)
                </span>
                <select
                  className={`custom-select px-3 py-2.5 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} w-full`}
                  value={detailsForm.mode}
                  onChange={(e) => setDetailsForm({ ...detailsForm, mode: e.target.value })}
                >
                  <option value="">Not set</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="date"
                  value={detailsForm.date}
                  onChange={(e) => setDetailsForm({ ...detailsForm, date: e.target.value })}
                  className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
                />
                <input
                  type="time"
                  value={detailsForm.time}
                  onChange={(e) => setDetailsForm({ ...detailsForm, time: e.target.value })}
                  className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
                />
              </div>
              <p className="text-[10px] uppercase tracking-widest opacity-50">
                Optional fields: round, mode, date, time.
              </p>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDetailsOpen(false)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.secondary}`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveDetails}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider ${colors.primary}`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
};

export default Tracker;
