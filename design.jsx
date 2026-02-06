import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutGrid,
  Briefcase,
  Mail,
  FileText,
  User,
  Search,
  Plus,
  Calendar,
  Clock,
  Check,
  Trash2,
  Edit3,
  Sun,
  Moon,
  Filter,
  Send,
  Paperclip,
  Target,
} from "lucide-react";

const APPLICATION_STATUSES = [
  { id: "all", label: "All", tone: "bg-gray-100 text-gray-600 border-gray-200" },
  { id: "applied", label: "Applied", tone: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  { id: "hr_contact", label: "HR Call", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "interview", label: "Interview", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "technical", label: "Technical", tone: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "rejected", label: "Rejected", tone: "bg-red-50 text-red-700 border-red-200" },
  { id: "offer", label: "Offer", tone: "bg-green-50 text-green-700 border-green-200" },
];

const PLATFORMS = [
  { id: "all", label: "All Sources" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "website", label: "Company Site" },
  { id: "email", label: "Email" },
  { id: "referral", label: "Referral" },
];

const DEMO_PROFILE = {
  name: "Alex Morgan",
  title: "Senior Frontend Engineer",
  location: "Austin, TX",
  email: "alex.morgan@email.com",
  phone: "+1 (555) 010-9876",
  noticePeriod: "Immediate",
  currentCtc: "$105k",
  expectedCtc: "$135k",
  summary:
    "Product-minded engineer focused on thoughtful UX, fast interfaces, and measurable impact.",
  skills: "React, TypeScript, Node.js, Tailwind, Design Systems, Testing",
  resumeName: "Alex_Morgan_Resume_2026.pdf",
};

const DEMO_GOAL = {
  title: "Spring Sprint",
  targetDate: "2026-03-31",
  targetRole: "Frontend Lead",
  targetCount: 45,
};

const DEMO_APPS = [
  {
    id: 1,
    company: "Figma",
    role: "Senior Product Engineer",
    status: "interview",
    source: "linkedin",
    appliedDate: "2026-01-18",
    statusDetails: { round: "Portfolio Review", mode: "Video", date: "2026-02-08", time: "10:30" },
  },
  {
    id: 2,
    company: "Stripe",
    role: "Frontend Platform",
    status: "technical",
    source: "referral",
    appliedDate: "2026-01-24",
    statusDetails: { round: "Pairing", mode: "Remote", date: "2026-02-10", time: "14:00" },
  },
  {
    id: 3,
    company: "Linear",
    role: "UI Engineer",
    status: "applied",
    source: "website",
    appliedDate: "2026-01-27",
  },
  {
    id: 4,
    company: "Notion",
    role: "Design Engineer",
    status: "hr_contact",
    source: "email",
    appliedDate: "2026-01-29",
    statusDetails: { round: "Screen", mode: "Phone", date: "2026-02-07", time: "09:00" },
  },
  {
    id: 5,
    company: "Shopify",
    role: "Front-end Specialist",
    status: "offer",
    source: "linkedin",
    appliedDate: "2026-01-10",
    statusDetails: { round: "Final", mode: "Onsite", date: "2026-02-03", time: "11:00" },
  },
  {
    id: 6,
    company: "Zoom",
    role: "Web Engineer",
    status: "rejected",
    source: "website",
    appliedDate: "2026-01-05",
  },
];

const DEMO_TEMPLATES = [
  {
    id: 1,
    name: "Intro - Referral",
    subject: "Intro for {{Role}} at {{Company}}",
    body: "Hi {{HiringManager}},\n\n{{Referral}} suggested I connect about the {{Role}} opening.\nMy background in {{Skills}} matches the team focus.\n\nBest,\n{{Name}}",
  },
  {
    id: 2,
    name: "Follow-up - Interview",
    subject: "Thanks for the interview",
    body: "Hi {{HiringManager}},\n\nThanks for the thoughtful conversation today. I am excited about {{Team}}.\nI have attached a follow-up project link.\n\nBest,\n{{Name}}",
  },
];

const DEMO_NOTES = [
  {
    id: 1,
    title: "Figma interview prep",
    tags: ["portfolio", "collaboration"],
    preview:
      "Review design system contributions and impact metrics. Highlight latency improvements.",
  },
  {
    id: 2,
    title: "Stripe pairing ideas",
    tags: ["algorithms", "typescript"],
    preview: "Practice constraints-driven UI state management and data fetching patterns.",
  },
  {
    id: 3,
    title: "Notion HR call",
    tags: ["story", "behavioral"],
    preview: "Prepare STAR story about scaling documentation and cross-team alignment.",
  },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "tracker", label: "Tracker", icon: Briefcase },
  { id: "mail", label: "Mail", icon: Mail },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "profile", label: "Profile", icon: User },
];

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatDateWithYear = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const StatusBadge = ({ status }) => {
  const match = APPLICATION_STATUSES.find((s) => s.id === status);
  const label = match?.label || status;
  const tone = match?.tone || "bg-gray-100 text-gray-700 border-gray-200";
  return (
    <span className={`px-2 py-1 rounded-md border text-[10px] font-bold uppercase ${tone}`}>
      {label}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon, accent, colors }) => {
  return (
    <div className={`p-4 rounded-2xl border ${colors.panel}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-60">{title}</p>
          <p className="text-2xl font-mono font-bold mt-1">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            accent ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
          }`}
        >
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

const ApplicationCard = ({ app, colors }) => {
  return (
    <div className={`p-3 rounded-2xl border ${colors.panel}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold">{app.company}</p>
          <p className="text-[10px] uppercase tracking-widest opacity-60">{app.role}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase opacity-60">
        <span>{PLATFORMS.find((p) => p.id === app.source)?.label || app.source}</span>
        <span>-</span>
        <span>{formatDateDisplay(app.appliedDate)}</span>
        {app.statusDetails?.round || app.statusDetails?.mode || app.statusDetails?.date ? (
          <>
            <span>-</span>
            <span>
              {app.statusDetails?.round ? `${app.statusDetails.round}` : "Round"}
              {app.statusDetails?.mode ? ` / ${app.statusDetails.mode}` : ""}
              {app.statusDetails?.date ? ` / ${formatDateDisplay(app.statusDetails.date)}` : ""}
              {app.statusDetails?.time ? ` ${app.statusDetails.time}` : ""}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
};

const FieldRow = ({ label, value }) => {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest opacity-60">{label}</p>
      <p className="text-sm font-semibold mt-1">{value}</p>
    </div>
  );
};

export default function DesignApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [applications, setApplications] = useState(DEMO_APPS);
  const [templates] = useState(DEMO_TEMPLATES);
  const [notes, setNotes] = useState(DEMO_NOTES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [noteDraft, setNoteDraft] = useState("");

  const isDark = theme === "dark";
  const colors = {
    bg: isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900",
    panel: isDark
      ? "bg-zinc-900 border border-zinc-800"
      : "bg-white border border-gray-100 shadow-sm",
    soft: isDark ? "bg-zinc-900/40 border border-zinc-800" : "bg-gray-50 border border-gray-100",
    input: isDark
      ? "bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:border-red-600"
      : "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-black",
    primary: isDark
      ? "bg-red-600 hover:bg-red-500 text-white"
      : "bg-black hover:bg-zinc-800 text-white",
    secondary: isDark
      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
      : "bg-gray-100 hover:bg-gray-200 text-gray-900",
    navActive: isDark ? "bg-zinc-900 text-red-500" : "bg-white text-black shadow-sm",
    navInactive: isDark ? "text-zinc-500 hover:text-zinc-300" : "text-gray-400 hover:text-gray-600",
  };

  const filteredApps = useMemo(() => {
    return applications
      .filter((app) => {
        const matchesText =
          app.company.toLowerCase().includes(search.toLowerCase()) ||
          app.role.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || app.status === statusFilter;
        const matchesSource = sourceFilter === "all" || app.source === sourceFilter;
        return matchesText && matchesStatus && matchesSource;
      })
      .sort((a, b) =>
        sortOrder === "newest"
          ? new Date(b.appliedDate) - new Date(a.appliedDate)
          : new Date(a.appliedDate) - new Date(b.appliedDate),
      );
  }, [applications, search, sourceFilter, sortOrder, statusFilter]);

  const appsToday = applications.filter(
    (app) => app.appliedDate === new Date().toISOString().split("T")[0],
  ).length;
  const upcoming = applications.filter((app) =>
    ["interview", "technical", "hr_contact"].includes(app.status),
  );
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(DEMO_GOAL.targetDate) - new Date()) / (1000 * 60 * 60 * 24)),
  );
  const progress =
    DEMO_GOAL.targetCount > 0
      ? Math.min(100, Math.round((applications.length / DEMO_GOAL.targetCount) * 100))
      : 0;

  const addQuickNote = () => {
    if (!noteDraft.trim()) return;
    const next = {
      id: Date.now(),
      title: noteDraft.slice(0, 32),
      tags: ["draft"],
      preview: noteDraft,
    };
    setNotes((prev) => [next, ...prev]);
    setNoteDraft("");
  };

  const addQuickApplication = () => {
    const next = {
      id: Date.now(),
      company: "NewCo",
      role: "Frontend Engineer",
      status: "applied",
      source: "website",
      appliedDate: new Date().toISOString().split("T")[0],
    };
    setApplications((prev) => [next, ...prev]);
  };

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        <aside className={`w-full lg:w-64 rounded-3xl p-4 border ${colors.panel}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-60">Job Hunter</p>
              <p className="text-lg font-bold">Design Preview</p>
            </div>
            <button
              onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors.secondary}`}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-semibold transition-colors ${
                    isActive ? colors.navActive : colors.navInactive
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className={`mt-6 p-4 rounded-2xl border ${colors.soft}`}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase opacity-60">
              <Target size={12} />
              Goal
            </div>
            <p className="mt-2 text-sm font-semibold">{DEMO_GOAL.title}</p>
            <p className="text-[10px] uppercase tracking-widest opacity-60">
              {DEMO_GOAL.targetRole}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs font-bold">
              <span>{progress}%</span>
              <span>{daysLeft} days left</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-black dark:bg-red-600"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-4">
          <div className={`p-4 rounded-3xl border ${colors.panel}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold">Hello, {DEMO_PROFILE.name}</h1>
                <p className="text-[10px] uppercase tracking-widest opacity-60">
                  Static design mode with local state
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className={`px-3 py-2 rounded-xl text-xs font-bold ${colors.secondary}`}>
                  Export
                </button>
                <button className={`px-3 py-2 rounded-xl text-xs font-bold ${colors.primary}`}>
                  Share board
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-4"
                >
                  <div className={`p-6 rounded-3xl border ${colors.panel}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60">Progress</p>
                        <p className="text-3xl font-mono font-bold mt-2">{progress}%</p>
                        <p className="text-xs opacity-60 mt-1">{applications.length} apps logged</p>
                      </div>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                        <Check size={24} />
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-black dark:bg-red-600"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    <StatCard
                      title="Applied Today"
                      value={appsToday}
                      icon={Calendar}
                      colors={colors}
                    />
                    <StatCard
                      title="Interviews"
                      value={upcoming.length}
                      icon={Clock}
                      colors={colors}
                    />
                    <StatCard
                      title="Offers"
                      value={applications.filter((a) => a.status === "offer").length}
                      icon={Check}
                      accent
                      colors={colors}
                    />
                    <StatCard
                      title="Rejected"
                      value={applications.filter((a) => a.status === "rejected").length}
                      icon={Trash2}
                      colors={colors}
                    />
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className={`p-4 rounded-2xl border ${colors.panel}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">Upcoming interviews</p>
                      <button className="text-[10px] font-bold uppercase opacity-60">
                        View all
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {upcoming.slice(0, 3).map((app) => (
                        <div key={app.id} className={`p-3 rounded-xl border ${colors.soft}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold">{app.company}</p>
                              <p className="text-[10px] uppercase tracking-widest opacity-60">
                                {app.role}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono opacity-60">
                              {app.statusDetails?.date
                                ? formatDateDisplay(app.statusDetails.date)
                                : "TBD"}
                            </span>
                          </div>
                          {app.statusDetails?.round ? (
                            <p className="text-[10px] opacity-60 mt-2">
                              {app.statusDetails.round} / {app.statusDetails.mode || "Remote"}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border ${colors.panel}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">Recent activity</p>
                      <button className="text-[10px] font-bold uppercase opacity-60">Log</button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {applications.slice(0, 4).map((app) => (
                        <div key={app.id} className="flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold">{app.company}</p>
                            <p className="text-[10px] opacity-60">Applied via {app.source}</p>
                          </div>
                          <span className="text-[10px] font-mono opacity-60">
                            {formatDateDisplay(app.appliedDate)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {activeTab === "tracker" && (
              <motion.div
                key="tracker"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-2xl border ${colors.panel}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">Log application</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">
                        Static form with local state
                      </p>
                    </div>
                    <button
                      onClick={addQuickApplication}
                      className={`px-3 py-2 rounded-xl text-xs font-bold ${colors.primary}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Plus size={14} />
                        Add demo
                      </span>
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-3 opacity-30" size={16} />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search companies or roles"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium outline-none ${colors.input}`}
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold uppercase ${colors.input}`}
                    >
                      {APPLICATION_STATUSES.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold uppercase ${colors.input}`}
                    >
                      {PLATFORMS.map((source) => (
                        <option key={source.id} value={source.id}>
                          {source.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest opacity-60">
                    {filteredApps.length} results
                  </div>
                  <button
                    onClick={() =>
                      setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-bold ${colors.secondary}`}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Filter size={14} />
                      {sortOrder === "newest" ? "Newest first" : "Oldest first"}
                    </span>
                  </button>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {filteredApps.map((app) => (
                    <ApplicationCard key={app.id} app={app} colors={colors} />
                  ))}
                </motion.div>
              </motion.div>
            )}
            {activeTab === "mail" && (
              <motion.div
                key="mail"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className={`md:col-span-2 p-4 rounded-2xl border ${colors.panel}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">Compose</p>
                      <button className="text-[10px] font-bold uppercase opacity-60">
                        Template
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      <input
                        placeholder="Subject"
                        className={`w-full py-2 px-3 rounded-xl text-sm outline-none ${colors.input}`}
                      />
                      <textarea
                        rows={6}
                        placeholder="Write your email..."
                        className={`w-full py-2 px-3 rounded-xl text-sm outline-none ${colors.input}`}
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          className={`px-3 py-2 rounded-xl text-xs font-bold ${colors.secondary}`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Paperclip size={14} />
                            Attach resume
                          </span>
                        </button>
                        <button
                          className={`px-3 py-2 rounded-xl text-xs font-bold ${colors.primary}`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <Send size={14} />
                            Send
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl border ${colors.panel}`}>
                    <p className="text-sm font-bold">Templates</p>
                    <div className="mt-3 space-y-3">
                      {templates.map((template) => (
                        <div key={template.id} className={`p-3 rounded-xl border ${colors.soft}`}>
                          <p className="text-xs font-bold">{template.name}</p>
                          <p className="text-[10px] opacity-60 mt-1">{template.subject}</p>
                          <button className="text-[10px] uppercase font-bold opacity-60 mt-3">
                            Use template
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {activeTab === "notes" && (
              <motion.div
                key="notes"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-2xl border ${colors.panel}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">Quick note</p>
                    <button className="text-[10px] font-bold uppercase opacity-60">Tags</button>
                  </div>
                  <div className="mt-3 flex flex-col md:flex-row gap-3">
                    <input
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Add an interview prep reminder..."
                      className={`flex-1 py-2 px-3 rounded-xl text-sm outline-none ${colors.input}`}
                    />
                    <button
                      onClick={addQuickNote}
                      className={`px-3 py-2 rounded-xl text-xs font-bold ${colors.primary}`}
                    >
                      Add note
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {notes.map((note) => (
                    <div key={note.id} className={`p-4 rounded-2xl border ${colors.panel}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold">{note.title}</p>
                          <p className="text-[10px] uppercase tracking-widest opacity-60 mt-1">
                            {note.tags.join(" / ")}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-xs opacity-70 mt-3">{note.preview}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-2xl border ${colors.panel}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{DEMO_PROFILE.name}</p>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">
                        {DEMO_PROFILE.title}
                      </p>
                    </div>
                    <button
                      className={`px-3 py-2 rounded-xl text-xs font-bold ${colors.secondary}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Edit3 size={14} />
                        Edit
                      </span>
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldRow label="Location" value={DEMO_PROFILE.location} />
                    <FieldRow label="Email" value={DEMO_PROFILE.email} />
                    <FieldRow label="Phone" value={DEMO_PROFILE.phone} />
                    <FieldRow label="Notice period" value={DEMO_PROFILE.noticePeriod} />
                    <FieldRow label="Current CTC" value={DEMO_PROFILE.currentCtc} />
                    <FieldRow label="Expected CTC" value={DEMO_PROFILE.expectedCtc} />
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className={`p-4 rounded-2xl border ${colors.panel}`}>
                    <p className="text-sm font-bold">Summary</p>
                    <p className="text-xs opacity-70 mt-3">{DEMO_PROFILE.summary}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${colors.panel}`}>
                    <p className="text-sm font-bold">Skills</p>
                    <p className="text-xs opacity-70 mt-3">{DEMO_PROFILE.skills}</p>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="font-semibold">{DEMO_PROFILE.resumeName}</span>
                      <button className="text-[10px] uppercase font-bold opacity-60">
                        Download
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className={`p-4 rounded-2xl border ${colors.panel}`}
                >
                  <p className="text-sm font-bold">Next milestone</p>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                    <span>{DEMO_GOAL.targetRole}</span>
                    <span>{formatDateWithYear(DEMO_GOAL.targetDate)}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
