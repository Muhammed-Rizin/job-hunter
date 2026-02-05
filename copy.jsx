import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import {
  LayoutGrid,
  Briefcase,
  LayoutTemplate,
  FileText,
  User,
  Plus,
  Search,
  Check,
  Moon,
  Sun,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
  Clock,
  Trash2,
  Linkedin,
  Globe,
  Lock,
  Target,
  Mail,
  X,
  Paperclip,
  MoreVertical,
  Minus,
  Maximize2,
  Github,
  Smartphone,
  AtSign,
  Key,
  Camera,
  Upload,
  Edit3,
  Save,
  MapPin,
  Link as LinkIcon,
  Filter,
  ArrowUpRight,
  SortDesc,
  LogOut,
  Download,
  Bell,
  Activity,
  Send,
  Wallet,
  Loader2,
  Menu,
  Zap,
  Clock3,
  FileEdit,
  Smile,
  Image as ImageIcon,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  Type,
  List,
  AlertCircle,
  Eye,
} from "lucide-react";

// --- 1. UTILITY & CONSTANTS ---

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const APPLICATION_STATUSES = [
  { id: "all", label: "All Statuses", color: "bg-gray-100 text-gray-600" },
  { id: "applied", label: "Applied", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  { id: "hr_contact", label: "HR Call", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "interview", label: "Interview", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "technical", label: "Tech", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "rejected", label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
  { id: "offer", label: "Offer", color: "bg-green-50 text-green-700 border-green-200" },
];

const PLATFORMS = [
  { id: "all", label: "All Sources", icon: Globe },
  { id: "mail", label: "Email", icon: Mail },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "indeed", label: "Indeed", icon: Briefcase },
  { id: "naukri", label: "Naukri", icon: Search },
  { id: "website", label: "Website", icon: Globe },
];

const DUMMY_APPS = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Engineer",
    status: "interview",
    source: "linkedin",
    appliedDate: "2025-10-12",
    statusDetails: { round: "System Design", mode: "online", date: "2025-10-15", time: "14:00" },
  },
  {
    id: 2,
    company: "Netflix",
    role: "UI Developer",
    status: "rejected",
    source: "website",
    appliedDate: "2025-10-15",
  },
  {
    id: 3,
    company: "Spotify",
    role: "Web Engineer",
    status: "offer",
    source: "indeed",
    appliedDate: "2025-10-20",
  },
  {
    id: 4,
    company: "Amazon",
    role: "SDE I",
    status: "applied",
    source: "naukri",
    appliedDate: "2025-10-22",
  },
  {
    id: 5,
    company: "Airbnb",
    role: "Frontend Dev",
    status: "hr_contact",
    source: "mail",
    appliedDate: "2025-10-25",
  },
];

// --- 2. STYLES & ANIMATIONS ---

const GlobalStyles = ({ theme }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
    
    body {
      font-family: ${theme === "nothing" ? '"JetBrains Mono", monospace' : '"Inter", sans-serif'};
      -webkit-font-smoothing: antialiased;
      overscroll-behavior-y: none;
    }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .glass-panel {
      background: ${theme === "nothing" ? "rgba(10, 10, 10, 0.9)" : "rgba(255, 255, 255, 0.95)"};
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid ${theme === "nothing" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"};
    }

    .dot-matrix {
      background-image: radial-gradient(${theme === "nothing" ? "#222" : "#e5e5e5"} 1px, transparent 1px);
      background-size: 24px 24px;
    }
    
    .dark input::placeholder, .dark textarea::placeholder {
        color: #555;
    }
  `}</style>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

// --- 3. HELPER COMPONENTS ---

const Input = ({ label, value, onChange, colors, type = "text", placeholder = "" }) => (
  <div>
    <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
      {label}
    </label>
    <input
      type={type}
      className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${colors.input}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const LabeledInput = ({ label, value, onChange, inputClassName, placeholder, type = "text" }) => (
  <div className="w-full">
    <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-3 rounded-xl text-sm font-medium outline-none transition-all ${inputClassName}`}
    />
  </div>
);

const Button = ({ children, onClick, className, variant = "primary", disabled }) => {
  const baseStyle =
    "rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  const primaryStyle = "bg-black text-white dark:bg-white dark:text-black hover:opacity-90";
  const secondaryStyle =
    "border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variant === "primary" ? primaryStyle : secondaryStyle} ${className}`}
    >
      {children}
    </button>
  );
};

const NavButton = ({ id, icon: Icon, label, active, setActive, colors }) => (
  <button
    onClick={() => setActive(id)}
    className={`w-full p-2.5 mb-1.5 rounded-lg flex items-center transition-all group ${active === id ? colors.navItemActive : colors.navItemInactive}`}
  >
    <Icon
      size={18}
      className={`mr-3 transition-transform group-hover:scale-110 ${active === id ? "" : "opacity-70"}`}
    />
    <span className="font-bold text-xs tracking-wide">{label}</span>
  </button>
);

const MobileNavBtn = ({ id, icon: Icon, active, setActive, colors, isDark }) => {
  const isActive = active === id;
  return (
    <button
      onClick={() => setActive(id)}
      className={`relative p-3 rounded-full transition-all ${isActive ? "text-current" : "text-gray-400"}`}
    >
      {isActive && (
        <motion.div
          layoutId="active-nav-bg"
          className={`absolute inset-0 rounded-full ${isDark ? "bg-zinc-800" : "bg-gray-100"}`}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon size={20} className="relative z-10" />
    </button>
  );
};

const StatWidget = ({ title, value, icon: Icon, colors, isDark, accent }) => (
  <motion.div
    variants={itemVariants}
    className={`p-4 rounded-2xl flex flex-col justify-between border shadow-sm h-full ${colors.card}`}
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">{title}</span>
      <Icon size={16} className="opacity-30" />
    </div>
    <div>
      <span
        className={`text-2xl font-mono font-bold tracking-tight ${accent ? colors.accent : ""}`}
      >
        {value}
      </span>
    </div>
  </motion.div>
);

const StatusSelect = ({ status, onChange }) => (
  <select
    value={status}
    onChange={(e) => onChange(e.target.value)}
    onClick={(e) => e.stopPropagation()}
    className={`w-full py-1 px-2 rounded-md text-[10px] uppercase font-bold tracking-wider appearance-none outline-none border cursor-pointer ${APPLICATION_STATUSES.find((s) => s.id === status)?.color}`}
  >
    {APPLICATION_STATUSES.map((s) => (
      <option key={s.id} value={s.id}>
        {s.label}
      </option>
    ))}
  </select>
);

// Custom Select Component
const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  variant = "boxed",
  className = "",
  optionClassName = "",
  isDark = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find((o) => o.id === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    onChange(opt.id);
    setIsOpen(false);
  };

  const variants = {
    boxed: `bg-white dark:bg-black border ${isDark ? "border-zinc-800" : "border-slate-200"} rounded-xl`,
    underline: "bg-transparent border-b border-slate-300 dark:border-neutral-700 rounded-none",
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 p-3 h-full cursor-pointer transition-colors ${variants[variant]}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {selected?.icon &&
            React.createElement(selected.icon, { size: 16, className: "opacity-60 shrink-0" })}
          <span
            className={`text-sm font-bold tracking-wide truncate ${!selected ? "text-gray-400" : isDark ? "text-white" : "text-gray-900"}`}
          >
            {selected?.label || placeholder}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`opacity-40 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl border z-50 overflow-hidden ${isDark ? "bg-black border-zinc-800" : "bg-white border-slate-200"}`}
          >
            <div className="max-h-60 overflow-y-auto no-scrollbar p-1">
              {options.map((opt) => {
                const isSelected = opt.id === value;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer flex items-center gap-3 transition-colors ${
                      isSelected
                        ? isDark
                          ? "bg-zinc-800 text-white"
                          : "bg-slate-100 text-slate-900"
                        : isDark
                          ? "text-gray-400 hover:bg-zinc-900 hover:text-white"
                          : "text-gray-600 hover:bg-slate-50 hover:text-slate-900"
                    } ${optionClassName}`}
                  >
                    {opt.icon &&
                      React.createElement(opt.icon, {
                        size: 16,
                        className: isSelected ? "opacity-100" : "opacity-60",
                      })}
                    <span className="font-bold tracking-wide">{opt.label}</span>
                    {isSelected && <Check size={14} className="ml-auto opacity-60" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TrackerCard = ({ app, colors, isDark, onDelete, onStatusChange, onDetails }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`p-3 rounded-2xl border ${colors.card} shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`p-2.5 rounded-full flex items-center justify-center shrink-0 border ${isDark ? "bg-zinc-800 border-zinc-700 text-white" : "bg-blue-50 border-blue-100 shadow-sm text-blue-600"}`}
          >
            <span className="font-bold text-sm">{app.company.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm tracking-wide leading-none mb-1">{app.company}</h4>
            <p
              className={`text-[10px] uppercase tracking-widest opacity-50 ${isDark ? "text-zinc-400" : "text-gray-500"}`}
            >
              {app.role}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onDetails?.(app)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onDelete?.(app.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
            aria-label="Delete application"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Details Row */}
      <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-gray-500/20">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
          <div className="flex items-center gap-1">
            {(() => {
              const match = PLATFORMS.find((p) => p.id === app.source);
              const Icon = match?.icon;
              return Icon ? <Icon size={12} /> : <Globe size={12} />;
            })()}
            <span>{PLATFORMS.find((p) => p.id === app.source)?.label || app.source}</span>
          </div>
        </div>

        {/* Status & Date Row */}
        <div className="flex items-center gap-3 mt-1">
          <div className="flex-1">
            <StatusSelect status={app.status} onChange={(v) => onStatusChange?.(app, v)} />
          </div>
          <div className="flex items-center gap-1 opacity-50 text-[10px] font-mono font-bold">
            <Calendar size={10} />
            <span>{formatDateDisplay(app.appliedDate)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const GmailPreview = ({ content, isDark, profile, handleSend, onClose }) => {
  // Local state for interactivity
  const [to, setTo] = useState("recruiter@company.com");
  const [subject, setSubject] = useState(content.sub || "");
  const [body, setBody] = useState(content.body || "");
  const [activeFormats, setActiveFormats] = useState([]);

  // Sync state when props change
  useEffect(() => {
    setSubject(content.sub || "");
    setBody(content.body || "");
  }, [content]);

  const toggleFormat = (fmt) => {
    setActiveFormats((prev) =>
      prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt],
    );
    toast.success(`${fmt} toggled (Visual)`);
  };

  const onSendClick = () => {
    handleSend({
      sub: subject,
      body: body,
      to: to,
    });
  };

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-2xl border flex flex-col h-full max-h-[85vh] md:max-h-full ${isDark ? "border-zinc-700 bg-[#121212]" : "border-gray-200 bg-white"}`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 flex items-center justify-between shrink-0 ${isDark ? "bg-[#202124] text-gray-200" : "bg-[#f2f2f2] text-gray-700"}`}
      >
        <div className="text-sm font-bold tracking-tight">New Message</div>
        <div className="flex gap-4 opacity-60">
          <Minus
            size={14}
            className="cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => toast("Minimized")}
          />
          <Maximize2
            size={14}
            className="cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => toast("Maximized")}
          />
          <X
            size={14}
            className="cursor-pointer hover:text-red-500 transition-colors"
            onClick={onClose}
          />
        </div>
      </div>

      {/* Body */}
      <div
        className={`flex-1 flex flex-col overflow-hidden relative ${isDark ? "text-gray-200" : "text-gray-800"}`}
      >
        <div className="px-4 pt-2">
          <div
            className={`flex items-center border-b ${isDark ? "border-zinc-700" : "border-gray-200"} py-2`}
          >
            <span className="text-xs font-bold opacity-50 w-14 cursor-pointer hover:underline">
              To
            </span>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Recipient"
            />
          </div>
          <div
            className={`flex items-center border-b ${isDark ? "border-zinc-700" : "border-gray-200"} py-2 mb-2`}
          >
            <span className="text-xs font-bold opacity-50 w-14">Subject</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-medium"
              placeholder="Subject"
            />
          </div>
        </div>

        <textarea
          className={`flex-1 w-full p-4 bg-transparent outline-none resize-none text-sm leading-relaxed font-sans no-scrollbar ${activeFormats.includes("Bold") ? "font-bold" : ""} ${activeFormats.includes("Italic") ? "italic" : ""} ${activeFormats.includes("Underline") ? "underline" : ""}`}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Compose your email..."
        />

        {/* Resume Attachment Chip */}
        {profile.resumeName && (
          <div className="px-4 pb-4">
            <div
              className={`flex items-center gap-3 p-2 pr-4 rounded-lg border w-fit cursor-pointer hover:bg-opacity-50 transition-colors ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-200"}`}
            >
              <div className="p-2 bg-red-100 text-red-600 rounded">
                <FileText size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold truncate max-w-[150px]">
                  {profile.resumeName}
                </span>
                <span className="text-[10px] opacity-60 uppercase tracking-wider font-bold">
                  PDF • 145 KB
                </span>
              </div>
              <div className="ml-2 opacity-50 hover:opacity-100 hover:text-blue-500 transition-all">
                <Download size={16} />
              </div>
              <div className="opacity-30 hover:opacity-100 hover:text-red-500 transition-all">
                <X size={14} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`p-3 flex items-center justify-between border-t shrink-0 ${isDark ? "bg-[#121212] border-zinc-800" : "bg-white border-gray-100"}`}
      >
        <div className="flex gap-4 items-center">
          <button
            onClick={onSendClick}
            className="px-6 py-2 rounded-full bg-[#0b57d0] text-white font-bold text-sm shadow-md hover:shadow-lg hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2"
          >
            Send <Send size={14} className="opacity-90" />
          </button>
          <div className="flex items-center gap-1 text-gray-500">
            <button
              title="Bold"
              onClick={() => toggleFormat("Bold")}
              className={`p-2 rounded hover:bg-black/5 transition-colors ${activeFormats.includes("Bold") ? "bg-black/10 text-blue-600" : ""}`}
            >
              <Bold size={18} />
            </button>
            <button
              title="Italic"
              onClick={() => toggleFormat("Italic")}
              className={`p-2 rounded hover:bg-black/5 transition-colors ${activeFormats.includes("Italic") ? "bg-black/10 text-blue-600" : ""}`}
            >
              <Italic size={18} />
            </button>
            <button
              title="Underline"
              onClick={() => toggleFormat("Underline")}
              className={`p-2 rounded hover:bg-black/5 transition-colors ${activeFormats.includes("Underline") ? "bg-black/10 text-blue-600" : ""}`}
            >
              <Underline size={18} />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
              title="Attach File"
              onClick={() => toast("Attachment Added")}
              className="p-2 rounded hover:bg-black/5 transition-colors"
            >
              <Paperclip size={18} />
            </button>
            <button title="Insert Link" className="p-2 rounded hover:bg-black/5 transition-colors">
              <LinkIcon size={18} />
            </button>
            <button title="Insert Emoji" className="p-2 rounded hover:bg-black/5 transition-colors">
              <Smile size={18} />
            </button>
            <button title="Insert Photo" className="p-2 rounded hover:bg-black/5 transition-colors">
              <ImageIcon size={18} />
            </button>
          </div>
        </div>
        <Trash2
          size={18}
          className="opacity-40 hover:opacity-100 cursor-pointer hover:text-red-500 transition-colors mr-2"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

// --- 4. VIEW COMPONENTS ---

const NotFoundView = ({ colors, isDark, setActive }) => (
  <motion.div
    variants={itemVariants}
    className="flex flex-col items-center justify-center h-full pb-20"
  >
    <div className={`p-8 rounded-full mb-6 ${isDark ? "bg-zinc-800/50" : "bg-gray-100"}`}>
      <AlertCircle size={64} className="opacity-20" />
    </div>
    <h2 className="text-3xl font-extrabold mb-2">Page Not Found</h2>
    <p
      className={`text-sm opacity-50 max-w-xs text-center mb-8 ${isDark ? "text-zinc-400" : "text-gray-500"}`}
    >
      We couldn't find the page you're looking for. It might have been moved or deleted.
    </p>
    <button
      onClick={() => setActive("dashboard")}
      className={`px-8 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform ${colors.primary}`}
    >
      Back to Dashboard
    </button>
  </motion.div>
);

const CreateTemplateView = ({ onSave, onCancel, colors, isDark }) => {
  const [t, setT] = useState({ name: "", subject: "", body: "" });

  const handleSave = () => {
    if (!t.name || !t.body) {
      toast.error("Please fill required fields");
      return;
    }
    onSave(t);
    toast.success("Template saved!");
  };

  return (
    <motion.div variants={itemVariants} className="max-w-xl mx-auto px-4 md:px-0">
      <div className="flex items-center mb-4">
        <button onClick={onCancel} className="mr-3 p-2 rounded-full hover:bg-gray-500/10">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">New Template</h2>
      </div>
      <div className="space-y-4">
        <Input
          label="Template Name"
          value={t.name}
          onChange={(v) => setT({ ...t, name: v })}
          colors={colors}
        />
        <Input
          label="Subject Line"
          value={t.subject}
          onChange={(v) => setT({ ...t, subject: v })}
          colors={colors}
        />
        <div>
          <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold mb-1.5 block">
            Body
          </label>
          <textarea
            className={`w-full h-64 p-3 rounded-xl text-sm font-mono leading-relaxed ${colors.input}`}
            value={t.body}
            onChange={(e) => setT({ ...t, body: e.target.value })}
          />
        </div>
        <button
          onClick={handleSave}
          className={`w-full py-3 rounded-xl font-bold text-sm ${colors.primary}`}
        >
          Save Template
        </button>
      </div>
    </motion.div>
  );
};

const DashboardView = ({ applications, goal, colors, isDark, setActive, profile }) => {
  const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
  const progress =
    goal.targetCount > 0 ? Math.min(100, (applications.length / goal.targetCount) * 100) : 0;
  const circumference = 351;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const appsToday = applications.filter(
    (a) => a.appliedDate === new Date().toISOString().split("T")[0],
  ).length;

  const upcomingInterviews = applications
    .filter((a) => ["interview", "technical"].includes(a.status))
    .slice(0, 2);

  return (
    <div className="space-y-4 px-4 md:px-0 pb-10">
      {/* Mobile-Only Header Area */}
      <div className="md:hidden flex flex-col justify-between items-start gap-4 mb-2">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">
            Good Morning, {profile.name.split(" ")[0]}
          </h2>
          <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">
            Your Activity Overview
          </p>
        </div>
        <button
          onClick={() => setActive("mail")}
          className={`w-full px-5 py-2.5 rounded-xl font-bold flex items-center justify-center shadow-lg active:scale-95 text-sm ${colors.primary}`}
        >
          <Plus className="mr-2" size={18} /> Apply Now
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          variants={itemVariants}
          className={`p-5 rounded-3xl border shadow-sm relative overflow-hidden flex flex-col justify-between h-auto min-h-[200px] ${colors.card}`}
        >
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <h3 className="font-bold text-sm tracking-wide">Goal Progress</h3>
              <p className={`text-[10px] uppercase tracking-widest opacity-50`}>
                {goal.targetRole}
              </p>
            </div>
            <div
              className={`px-2 py-1 rounded-md text-[10px] font-bold border ${isDark ? "bg-zinc-800 border-zinc-700" : "bg-gray-100 border-gray-200"}`}
            >
              {daysLeft} Days Left
            </div>
          </div>
          <div className="flex items-end mt-4 relative z-10">
            <div className="relative w-20 h-20 mr-4 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className={isDark ? "text-zinc-800" : "text-gray-100"}
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className={isDark ? "text-red-600" : "text-black"}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-lg font-mono font-bold">{Math.round(progress)}%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-mono font-bold">{applications.length}</p>
              <p className={`text-[10px] uppercase tracking-widest opacity-50`}>
                Total Applications
              </p>
            </div>
          </div>
        </motion.div>
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 md:gap-4">
          <StatWidget
            title="Applied Today"
            value={appsToday}
            icon={Calendar}
            colors={colors}
            isDark={isDark}
          />
          <StatWidget
            title="Interviews"
            value={upcomingInterviews.length}
            icon={User}
            colors={colors}
            isDark={isDark}
          />
          <StatWidget
            title="Pending"
            value={applications.filter((a) => ["applied", "hr_contact"].includes(a.status)).length}
            icon={Clock}
            colors={colors}
            isDark={isDark}
          />
          <StatWidget
            title="Offers"
            value={applications.filter((a) => a.status === "offer").length}
            icon={Check}
            colors={colors}
            isDark={isDark}
            accent
          />
        </div>
      </div>

      {/* Expanded Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <motion.div
          variants={itemVariants}
          className={`p-5 rounded-2xl border shadow-sm ${colors.card}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm tracking-wide flex items-center">
              <Calendar size={16} className="mr-2 opacity-50" /> Upcoming Interviews
            </h3>
          </div>
          <div className="space-y-3">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((app) => (
                <div
                  key={app.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${isDark ? "bg-zinc-800/30 border-zinc-700" : "bg-gray-50 border-gray-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isDark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-600"}`}
                    >
                      {app.company[0]}
                    </div>
                    <div>
                      <p className="font-bold text-xs">{app.company}</p>
                      <p className="text-[10px] opacity-50">{app.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-blue-500/10 text-blue-500 px-2 py-1 rounded">
                    Tomorrow
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 opacity-40 text-xs uppercase font-bold tracking-widest">
                No upcoming interviews
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={`p-5 rounded-2xl border shadow-sm ${colors.card}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm tracking-wide flex items-center">
              <Activity size={16} className="mr-2 opacity-50" /> Recent Activity
            </h3>
            <button
              onClick={() => setActive("tracker")}
              className="text-[10px] font-bold uppercase opacity-50 hover:opacity-100"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => (
              <div key={app.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${app.status === "offer" ? "bg-green-500" : app.status === "rejected" ? "bg-red-500" : "bg-blue-500"}`}
                  ></div>
                  <div>
                    <p className="font-bold text-xs">{app.company}</p>
                    <p className="text-[10px] opacity-50">Applied via {app.source}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono opacity-50">{app.appliedDate.slice(5)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const TrackerView = ({ applications, setApplications, colors, isDark }) => {
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // DETAILS MODAL STATE
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsApp, setDetailsApp] = useState(null);
  const [detailsForm, setDetailsForm] = useState({ round: "", mode: "online", date: "", time: "" });
  const [detailsStatus, setDetailsStatus] = useState(""); // NEW for status change inside modal
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    company: "",
    role: "",
    source: "website",
    status: "applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Filter & Sort Logic
  const filtered = applications
    .filter((a) => {
      const matchesText =
        a.company.toLowerCase().includes(filter.toLowerCase()) ||
        a.role.toLowerCase().includes(filter.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesSource = sourceFilter === "all" || a.source === sourceFilter;
      return matchesText && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      return sortOrder === "newest"
        ? new Date(b.appliedDate) - new Date(a.appliedDate)
        : new Date(a.appliedDate) - new Date(b.appliedDate);
    });

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedApps = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, statusFilter, sourceFilter, sortOrder]);

  const openDetails = (app, statusOverride) => {
    setDetailsApp(app);
    setDetailsStatus(statusOverride || app.status); // Use override if provided (from dropdown), else current status
    setDetailsForm(app.statusDetails || { round: "", mode: "online", date: "", time: "" });
    setDetailsOpen(true);
  };

  const saveDetails = () => {
    if (!detailsApp) return;
    setApplications((prev) =>
      prev.map((p) =>
        p.id === detailsApp.id ? { ...p, status: detailsStatus, statusDetails: detailsForm } : p,
      ),
    );
    setDetailsOpen(false);
    toast.success("Details Updated");
  };

  const handleCreate = () => {
    if (!createForm.company || !createForm.role) return toast.error("Company & Role required");
    setApplications((prev) => [{ id: Date.now(), ...createForm }, ...prev]);
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

  // Determine if we should show extra fields
  const showInterviewFields = ["interview", "technical", "hr_contact", "offer"].includes(
    detailsStatus,
  );

  return (
    <div className="px-4 md:px-0 h-full flex flex-col">
      <motion.div variants={itemVariants} className={`p-4 rounded-2xl border mb-4 ${colors.card}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm tracking-wide">Log Application</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-50">
              Add new application manually
            </p>
          </div>
          <button
            onClick={() => setCreating(!creating)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.secondary}`}
          >
            {creating ? "Close" : "New"}
          </button>
        </div>
        {creating && (
          <div className="grid md:grid-cols-2 gap-3 animate-slide-up">
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
                isDark={isDark}
              />
              <Select
                className="w-full"
                value={createForm.status}
                onChange={(v) => setCreateForm({ ...createForm, status: v })}
                options={APPLICATION_STATUSES.filter((s) => s.id !== "all")}
                isDark={isDark}
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
                isDark={isDark}
                placeholder="Status"
              />
            </div>
            <div className="flex-1 md:w-40">
              <Select
                value={sourceFilter}
                onChange={setSourceFilter}
                options={PLATFORMS}
                isDark={isDark}
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

      <div className="md:hidden space-y-2 pb-4 no-scrollbar">
        {paginatedApps.map((app) => (
          <TrackerCard
            key={app.id}
            app={app}
            colors={colors}
            isDark={isDark}
            setApplications={setApplications}
            onStatusChange={(item, status) => openDetails(item, status)}
            onDetails={() => openDetails(app)}
            onDelete={() => {
              if (confirm("Delete?"))
                setApplications((prev) => prev.filter((p) => p.id !== app.id));
            }}
          />
        ))}
      </div>

      <div className="hidden md:block flex-1 overflow-x-auto">
        <div className="min-w-[800px] md:min-w-0 space-y-2">
          <div
            className={`grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold uppercase tracking-widest opacity-50`}
          >
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
              className={`grid grid-cols-12 gap-4 items-center p-3 rounded-xl border transition-all hover:shadow-md ${isDark ? "bg-zinc-900 border-zinc-800 hover:border-zinc-700" : "bg-white border-gray-100 hover:border-gray-200"}`}
            >
              <div className="col-span-4 flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${isDark ? "bg-black border-zinc-800" : "bg-gray-50 border-gray-200"}`}
                >
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
                {React.createElement(PLATFORMS.find((p) => p.id === app.source)?.icon || Globe, {
                  size: 14,
                })}
                <span className="text-xs font-medium">
                  {PLATFORMS.find((p) => p.id === app.source)?.label}
                </span>
              </div>
              <div className="col-span-3 flex items-center gap-2">
                <StatusSelect status={app.status} onChange={(v) => openDetails(app, v)} />
                <button onClick={() => openDetails(app)} className="p-1 hover:bg-gray-100 rounded">
                  <Edit3 size={12} className="opacity-50" />
                </button>
              </div>
              <div className="col-span-2 text-xs font-mono opacity-60">
                {formatDateDisplay(app.appliedDate)}
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => {
                    if (confirm("Delete?"))
                      setApplications((prev) => prev.filter((p) => p.id !== app.id));
                  }}
                  className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-gray-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-dashed border-gray-500/20">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-zinc-800"} ${colors.secondary}`}
          >
            Previous
          </button>
          <span className="text-xs font-mono opacity-50">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-zinc-800"} ${colors.secondary}`}
          >
            Next
          </button>
        </div>
      )}

      {/* DETAILS MODAL */}
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
                  isDark={isDark}
                  className="w-full"
                />
              </label>

              {/* CONDITIONAL FIELDS BASED ON STATUS */}
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
                      isDark={isDark}
                    />
                  </label>
                </motion.div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  onClick={() => setDetailsOpen(false)}
                  className={`px-4 py-2 text-xs border ${colors.secondary}`}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button onClick={saveDetails} className={`px-4 py-2 text-xs ${colors.primary}`}>
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const MailWizard = ({ templates, setTemplates, profile, onSend, colors, isDark }) => {
  const [view, setView] = useState("MENU");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVars, setTemplateVars] = useState({});
  const [manualData, setManualData] = useState({
    company: "",
    role: "",
    source: "linkedin",
    status: "applied",
    date: new Date().toISOString().split("T")[0],
  });
  const [isCreating, setIsCreating] = useState(false);

  const getVariables = (text) => [...new Set([...text.matchAll(/{{(.*?)}}/g)].map((m) => m[1]))];

  const handleTemplateSelect = (t) => {
    setSelectedTemplate(t);
    const vars = getVariables(t.body + " " + t.subject);
    const initialVars = {};
    vars.forEach((v) => {
      const pKey = Object.keys(profile).find(
        (k) => k.toLowerCase() === v.toLowerCase().replace(/\s/g, ""),
      );
      initialVars[v] = pKey ? profile[pKey] : "";
    });
    setTemplateVars(initialVars);
    setView("FILL");
  };

  const getCompiledContent = () => {
    let sub = selectedTemplate?.subject || "";
    let body = selectedTemplate?.body || "";
    Object.keys(templateVars).forEach((k) => {
      const reg = new RegExp(`{{${k}}}`, "g");
      sub = sub.replace(reg, templateVars[k]);
      body = body.replace(reg, templateVars[k]);
    });
    return { sub, body };
  };

  const handleSend = () => {
    const c = getCompiledContent();
    onSend({
      id: Date.now(),
      company: templateVars["Company"] || "Unknown",
      role: templateVars["Role"] || "Unknown",
      status: "applied",
      source: "mail",
      appliedDate: new Date().toISOString().split("T")[0],
      notes: `Emailed: ${c.sub}`,
      mailBody: c.body,
    });
    toast.success("Application Sent!");
    setView("MENU");
  };

  if (isCreating)
    return (
      <CreateTemplateView
        onSave={(t) => {
          setTemplates([...templates, { ...t, id: Date.now() }]);
          setIsCreating(false);
        }}
        onCancel={() => setIsCreating(false)}
        colors={colors}
        isDark={isDark}
      />
    );

  if (view === "MENU") {
    return (
      <motion.div variants={itemVariants} className="max-w-2xl mx-auto px-4 md:px-0">
        <div className="md:hidden mb-6">
          <h2 className="text-xl font-bold">How are you applying?</h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div
            onClick={() => setView("LIST")}
            className={`p-5 rounded-2xl cursor-pointer border hover:border-current transition-all ${colors.card}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl flex items-center justify-center ${isDark ? "bg-black" : "bg-blue-50 text-blue-600"}`}
              >
                <LayoutTemplate size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide">Use Template</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-50">
                  Generate email from templates
                </p>
              </div>
            </div>
          </div>
          <div
            onClick={() => setView("MANUAL")}
            className={`p-5 rounded-2xl cursor-pointer border hover:border-current transition-all ${colors.card}`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl flex items-center justify-center ${isDark ? "bg-black" : "bg-green-50 text-green-600"}`}
              >
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide">Log External App</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-50">
                  LinkedIn, Indeed, Website, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (view === "MANUAL") {
    return (
      <motion.div variants={itemVariants} className="max-w-xl mx-auto p-4 md:p-0">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setView("MENU")}
            className="mr-3 p-2 rounded-full hover:bg-gray-500/10"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Log Application</h2>
        </div>
        <div className="space-y-4">
          <Input
            label="Company"
            value={manualData.company}
            onChange={(v) => setManualData({ ...manualData, company: v })}
            colors={colors}
          />
          <Input
            label="Role"
            value={manualData.role}
            onChange={(v) => setManualData({ ...manualData, role: v })}
            colors={colors}
          />
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest opacity-50 font-bold block">
              Source
            </label>
            <Select
              value={manualData.source}
              onChange={(val) => setManualData({ ...manualData, source: val })}
              options={PLATFORMS.filter((p) => p.id !== "all")}
              isDark={isDark}
              placeholder="Select Source"
            />
          </div>
          <button
            onClick={() => {
              if (!manualData.company || !manualData.role)
                return toast.error("Company and Role required");
              onSend({ ...manualData, id: Date.now() });
              toast.success("Logged Successfully!");
              setView("MENU");
            }}
            className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider mt-2 ${colors.primary}`}
          >
            Save Record
          </button>
        </div>
      </motion.div>
    );
  }

  if (view === "LIST") {
    return (
      <motion.div variants={itemVariants} className="max-w-2xl mx-auto px-4 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => setView("MENU")}
              className="mr-3 p-2 rounded-full hover:bg-gray-500/10"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">Select Template</h2>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.secondary}`}
          >
            + New
          </button>
        </div>
        <div className="space-y-3">
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => handleTemplateSelect(t)}
              className={`p-4 rounded-xl cursor-pointer border hover:border-current transition-all ${colors.card}`}
            >
              <h4 className="font-bold text-sm tracking-wide mb-1">{t.name}</h4>
              <p className="text-[10px] opacity-50 truncate">{t.subject}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (view === "FILL") {
    const content = getCompiledContent();
    return (
      <motion.div variants={itemVariants} className="max-w-6xl mx-auto px-4 md:px-0 h-full pb-20">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setView("LIST")}
            className="mr-3 p-2 rounded-full hover:bg-gray-500/10"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Details</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-full">
          <div className="w-full md:w-1/2 flex flex-col space-y-4">
            <div className={`p-5 rounded-2xl border ${colors.card}`}>
              <div className="space-y-3">
                {Object.keys(templateVars).length === 0 && (
                  <p className="opacity-50 text-xs italic">No variables in this template.</p>
                )}
                {Object.keys(templateVars).map((key) => (
                  <Input
                    key={key}
                    label={key}
                    value={templateVars[key]}
                    onChange={(v) => setTemplateVars({ ...templateVars, [key]: v })}
                    colors={colors}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => setView("PREVIEW")}
              className={`md:hidden w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg ${colors.primary}`}
            >
              Preview
            </button>
          </div>
          <div className="hidden md:block w-1/2 h-[500px]">
            <GmailPreview
              content={content}
              isDark={isDark}
              profile={profile}
              handleSend={handleSend}
              onClose={() => setView("FILL")}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  if (view === "PREVIEW") {
    const content = getCompiledContent();
    return (
      <motion.div variants={itemVariants} className="max-w-3xl mx-auto px-4 md:px-0 pb-32">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setView("FILL")}
            className="mr-3 p-2 rounded-full hover:bg-gray-500/10"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Preview</h2>
        </div>
        <div className="flex flex-col min-h-[50vh]">
          <GmailPreview
            content={content}
            isDark={isDark}
            profile={profile}
            handleSend={handleSend}
            onClose={() => setView("FILL")}
          />
        </div>
      </motion.div>
    );
  }
};

const NotesView = ({ notes, setNotes, colors, isDark }) => {
  const [noteForm, setNoteForm] = useState({ title: "", text: "" });
  const add = () => {
    if (!noteForm.text) return;
    setNotes([
      {
        id: Date.now(),
        title: noteForm.title || "Note",
        text: noteForm.text,
        date: new Date().toLocaleDateString(),
      },
      ...notes,
    ]);
    setNoteForm({ title: "", text: "" });
  };
  return (
    <div className="grid md:grid-cols-2 gap-8 px-4 md:px-0">
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:hidden">Quick Notes</h2>
        <div className={`p-5 rounded-3xl ${colors.card}`}>
          <input
            placeholder="Title"
            className={`w-full p-2 mb-2 rounded-lg bg-transparent font-bold text-lg outline-none border-b border-gray-500/20 ${isDark ? "text-white" : "text-gray-900"}`}
            value={noteForm.title}
            onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
          />
          <textarea
            className={`w-full h-40 bg-transparent resize-none outline-none text-base ${isDark ? "text-zinc-300" : "text-gray-600"}`}
            placeholder="Type here..."
            value={noteForm.text}
            onChange={(e) => setNoteForm({ ...noteForm, text: e.target.value })}
          ></textarea>
          <button
            onClick={add}
            className={`w-full py-3 mt-2 rounded-xl font-bold ${colors.primary}`}
          >
            Save
          </button>
        </div>
      </motion.div>
      <div className="space-y-4 pb-20">
        {notes.map((n) => (
          <motion.div
            variants={itemVariants}
            key={n.id}
            className={`p-5 rounded-2xl relative ${colors.card}`}
          >
            <h4 className="font-bold mb-2">{n.title}</h4>
            <p className="whitespace-pre-wrap text-sm opacity-80">{n.text}</p>
            <button
              onClick={() => setNotes((ns) => ns.filter((x) => x.id !== n.id))}
              className="absolute top-4 right-4 text-red-500 opacity-50 hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ProfileView = ({ profile, setProfile, goal, setGoal, colors, isDark, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [tempGoal, setTempGoal] = useState(goal);
  const fileInputRef = useRef(null);

  // Goal calculation for the visual ring
  const progress = goal.targetCount > 0 ? Math.min(100, (50 / goal.targetCount) * 100) : 0;
  const circumference = 251;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (isEditing) {
      setTempProfile(profile);
      setTempGoal(goal);
    }
  }, [isEditing, profile, goal]);

  const handleSave = () => {
    setProfile(tempProfile);
    setGoal(tempGoal);
    setIsEditing(false);
    toast.success("Profile Updated");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempProfile({ ...tempProfile, resumeName: file.name, resumeLink: "" });
      toast.success(`Uploaded: ${file.name}`);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="max-w-4xl mx-auto space-y-4 px-4 md:px-0 pb-32 pt-4"
    >
      <div className={`p-5 md:p-8 rounded-3xl border shadow-sm ${colors.card}`}>
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
            <div
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 ${isDark ? "border-zinc-800 bg-zinc-800" : "border-gray-100 bg-gray-100"} flex items-center justify-center text-3xl font-bold shadow-sm overflow-hidden`}
            >
              {profile.name ? profile.name.charAt(0) : <User />}
            </div>
            <div className="text-center md:text-left">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    className={`text-xl font-bold bg-transparent border-b border-gray-500/30 w-full outline-none p-1`}
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    placeholder="Name"
                  />
                  <input
                    className={`text-xs opacity-70 bg-transparent border-b border-gray-500/30 w-full outline-none p-1`}
                    value={tempProfile.title}
                    onChange={(e) => setTempProfile({ ...tempProfile, title: e.target.value })}
                    placeholder="Job Title"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-xl md:text-2xl font-bold mb-0.5 tracking-tight">
                    {profile.name || "Your Name"}
                  </h2>
                  <p className={`text-xs ${isDark ? "text-zinc-400" : "text-gray-500"}`}>
                    {profile.title || "Job Title"}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 flex items-center justify-center md:justify-start mt-2">
                    <MapPin size={10} className="mr-1" /> {profile.location || "Location"}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 border transition-all active:scale-95 ${isEditing ? "bg-green-600 text-white border-green-600" : colors.secondary}`}
            >
              {isEditing ? (
                <>
                  <Save size={14} /> Save
                </>
              ) : (
                <>
                  <Edit3 size={14} /> Edit
                </>
              )}
            </button>
            <button
              onClick={onLogout}
              className="md:hidden px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider border text-red-500 border-red-500/20 bg-red-500/10"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="grid md:grid-cols-2 gap-4 animate-slide-up">
            <div className="md:col-span-2">
              <h3 className="font-bold border-b pb-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
                Contact & Info
              </h3>
            </div>
            <Input
              label="Email"
              value={tempProfile.email}
              onChange={(v) => setTempProfile({ ...tempProfile, email: v })}
              colors={colors}
            />
            <Input
              label="Phone"
              value={tempProfile.phone}
              onChange={(v) => setTempProfile({ ...tempProfile, phone: v })}
              colors={colors}
            />
            <Input
              label="Location"
              value={tempProfile.location}
              onChange={(v) => setTempProfile({ ...tempProfile, location: v })}
              colors={colors}
            />

            <div className="md:col-span-2 mt-2">
              <h3 className="font-bold border-b pb-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
                Resume
              </h3>
            </div>
            <Input
              label="Resume Link (Optional)"
              placeholder="https://..."
              value={tempProfile.resumeLink || ""}
              onChange={(v) => setTempProfile({ ...tempProfile, resumeLink: v })}
              colors={colors}
            />
            <div className="flex items-end">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-3 rounded-lg border text-sm font-medium ${colors.secondary}`}
              >
                Upload File {tempProfile.resumeName ? `(${tempProfile.resumeName})` : ""}
              </button>
            </div>

            <div className="md:col-span-2 mt-2">
              <h3 className="font-bold border-b pb-2 mb-2 opacity-50 text-[10px] uppercase tracking-widest">
                Goal
              </h3>
            </div>
            <Input
              label="Target Role"
              value={tempGoal.targetRole}
              onChange={(v) => setTempGoal({ ...tempGoal, targetRole: v })}
              colors={colors}
            />
            <Input
              label="Target Count"
              type="number"
              value={tempGoal.targetCount}
              onChange={(v) => setTempGoal({ ...tempGoal, targetCount: Number(v) })}
              colors={colors}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 border-t border-gray-500/10 pt-6 mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-50 mb-2">
                  About
                </h3>
                <p className="text-xs leading-relaxed opacity-80">{profile.summary}</p>
              </div>
              <div>
                <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-50 mb-2">
                  Contact
                </h3>
                <div className="space-y-2 text-xs opacity-80 font-mono">
                  <p>{profile.email}</p>
                  <p>{profile.phone}</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              {/* GOAL CARD RESTORED */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between relative overflow-hidden ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-gray-100 bg-gray-50"}`}
              >
                <div className="z-10">
                  <h3 className="font-bold text-sm tracking-wide mb-1">Goal: {goal.targetRole}</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-50 mb-3">
                    Target: {goal.targetCount}
                  </p>
                  <div className="text-xl font-mono font-bold">{goal.targetCount}</div>
                </div>
                <div className="relative w-16 h-16 mr-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className={isDark ? "text-zinc-800" : "text-gray-200"}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className={isDark ? "text-red-600" : "text-black"}
                      strokeDasharray={251}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">
                    {Math.round(progress)}%
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-2xl border ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-gray-100 bg-gray-50"}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-50">
                    Resume
                  </h3>
                  {profile.resumeLink && (
                    <a
                      href={profile.resumeLink}
                      target="_blank"
                      className="text-xs text-blue-500 font-bold flex items-center"
                    >
                      Open Link <ArrowUpRight size={10} className="ml-1" />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                    <FileText size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-xs">{profile.resumeName}</p>
                    <p className="text-[10px] opacity-50">PDF Document</p>
                  </div>
                  <button className="ml-auto p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <Download size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- 5. SCREENS (Defined before App) ---

const DesktopHeader = ({ activeTab, profile, theme, setTheme, isDark, colors, setActive }) => {
  let title = "Dashboard";
  let subtitle = "Overview";

  if (activeTab === "dashboard") {
    title = `Good Morning, ${profile.name.split(" ")[0]}`;
    subtitle = "Your Activity Overview";
  } else if (activeTab === "tracker") {
    title = "Applications";
    subtitle = "Pipeline Status";
  } else if (activeTab === "mail") {
    title = "Mail Wizard";
    subtitle = "Compose & Send";
  } else if (activeTab === "notes") {
    title = "Notes";
    subtitle = "Ideas & Prep";
  } else if (activeTab === "profile") {
    title = "Profile";
    subtitle = "Settings & Goal";
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="hidden md:flex justify-between items-end mb-6 pb-4 border-b border-gray-200 dark:border-zinc-800"
    >
      <div>
        <h2
          className={`text-3xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h2>
        <p
          className={`text-xs font-bold uppercase tracking-widest opacity-50 mt-1 flex items-center gap-2`}
        >
          {subtitle} <span className="w-1 h-1 rounded-full bg-current" /> {currentDate}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(isDark ? "clean" : "nothing")}
          className={`p-2.5 rounded-xl border transition-colors ${colors.card} hover:bg-gray-100 dark:hover:bg-zinc-800`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className={`p-2.5 rounded-xl border ${colors.card}`}>
          <Bell size={20} />
        </div>
        <div
          onClick={() => setActive("profile")}
          className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${colors.card}`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isDark ? "bg-zinc-800" : "bg-gray-100"}`}
          >
            {profile.name.charAt(0)}
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-xs font-bold">{profile.name}</p>
            <p className="text-[10px] opacity-50">{profile.title}</p>
          </div>
          <ChevronDown size={14} className="opacity-40" />
        </div>
      </div>
    </motion.div>
  );
};

const LoadingScreen = ({ theme, isDark }) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
  >
    <GlobalStyles theme={theme} />
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center"
    >
      <div
        className={`w-14 h-14 mb-4 rounded-xl flex items-center justify-center ${isDark ? "bg-red-600" : "bg-black"}`}
      >
        <Briefcase size={28} className="text-white" />
      </div>
      <h1 className={`text-xl font-bold tracking-widest ${isDark ? "font-mono" : "font-sans"}`}>
        JH PRO
      </h1>
      <motion.div
        animate={{ width: ["0%", "100%"] }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className={`h-1 mt-4 rounded-full ${isDark ? "bg-red-600" : "bg-black"}`}
        style={{ width: 0, minWidth: "80px" }}
      />
    </motion.div>
  </div>
);

const AuthScreen = ({ onLogin, theme, setTheme, isDark, colors }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mobile && password) {
      onLogin();
      toast.success("Welcome back!");
    } else {
      toast.error("Please enter credentials");
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${colors.bg} dot-matrix transition-colors duration-500`}
    >
      <GlobalStyles theme={theme} />
      <button
        onClick={() => setTheme(isDark ? "clean" : "nothing")}
        className={`absolute top-6 right-6 p-2 rounded-full ${colors.secondary}`}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-sm p-8 rounded-3xl ${colors.card} shadow-xl relative overflow-hidden border ${isDark ? "border-zinc-800" : "border-gray-100"}`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-1 ${isDark ? "bg-red-600" : "bg-black"}`}
        ></div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className={`text-xs ${isDark ? "text-zinc-500" : "text-gray-500"}`}>
            {isSignUp ? "Join JobHunter Pro" : "Login to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Smartphone className="absolute left-3 top-3.5 opacity-30" size={18} />
            <input
              type="tel"
              placeholder="Mobile Number"
              className={`w-full pl-10 p-3 rounded-lg text-sm font-medium outline-none transition-all ${colors.input}`}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-3.5 opacity-30" size={18} />
            <input
              type="password"
              placeholder="Password"
              className={`w-full pl-10 p-3 rounded-lg text-sm font-medium outline-none transition-all ${colors.input}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg transform active:scale-95 transition-all ${colors.primary}`}
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center gap-4 opacity-50 text-xs uppercase font-bold">
          <div className="h-px bg-current w-12"></div>
          <span>Or continue with</span>
          <div className="h-px bg-current w-12"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className={`p-3 rounded-xl flex items-center justify-center border hover:bg-opacity-50 transition-colors ${colors.secondary}`}
          >
            <GoogleIcon />
          </button>
          <button
            className={`p-3 rounded-xl flex items-center justify-center border hover:bg-opacity-50 transition-colors ${colors.secondary}`}
          >
            <Github size={20} />
          </button>
        </div>

        <p className="mt-6 text-[10px] text-center opacity-60">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-bold underline ml-1">
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

// --- 6. MAIN APP COMPONENT ---

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage("jh_auth_v9", false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useLocalStorage("jh_theme_v3", "clean");
  const [isLoading, setIsLoading] = useState(true);

  // Data
  const [profile, setProfile] = useLocalStorage("jh_profile_v6", {
    name: "Alex Developer",
    email: "alex@example.com",
    phone: "+91 98765 43210",
    noticePeriod: "Immediate",
    currentCtc: "$80k",
    expectedCtc: "$120k",
    resumeName: "Alex_Resume_2025.pdf",
    title: "Senior Frontend Engineer",
    location: "Bangalore, India",
    skills: "React, TypeScript, Node.js, Tailwind CSS, Firebase",
    summary:
      "Passionate developer with 5 years of experience building scalable web applications. Loves clean UI/UX and efficient code.",
  });

  const [goal, setGoal] = useLocalStorage("jh_goal_v2", {
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
      .toISOString()
      .split("T")[0],
    targetRole: "Frontend Dev",
    targetCount: 50,
  });

  const [applications, setApplications] = useLocalStorage("jh_apps_v3", DUMMY_APPS);

  const [templates, setTemplates] = useLocalStorage("jh_templates_v2", [
    {
      id: 1,
      name: "Cold Email (Standard)",
      subject: "Application for {{Role}} - {{Name}}",
      body: "Hi {{HiringManager}},\n\nI'm writing to apply for the {{Role}} position at {{Company}}.\n\nI have experience in frontend technologies and I'm passionate about building great products.\n\nNotice Period: {{NoticePeriod}}\nExpected CTC: {{ExpectedCTC}}\n\nResume attached.\n\nBest,\n{{Name}}",
    },
  ]);
  const [notes, setNotes] = useLocalStorage("jh_notes_v2", []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const isDark = theme === "nothing";
  const colors = {
    bg: isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900",
    card: isDark
      ? "bg-zinc-900 border border-zinc-800"
      : "bg-white border border-gray-100 shadow-sm",
    input: isDark
      ? "bg-black border border-zinc-800 focus:border-red-600 text-white placeholder-zinc-600"
      : "bg-white border border-gray-200 focus:border-black text-gray-900 placeholder-gray-400",
    primary: isDark
      ? "bg-red-600 hover:bg-red-500 text-white"
      : "bg-black hover:bg-zinc-800 text-white",
    secondary: isDark
      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
      : "bg-gray-100 hover:bg-gray-200 text-gray-900",
    accent: isDark ? "text-red-600" : "text-blue-600",
    navItemActive: isDark ? "text-red-500 bg-zinc-900" : "text-black bg-white shadow-md",
    navItemInactive: isDark
      ? "text-zinc-500 hover:text-zinc-300"
      : "text-gray-400 hover:text-gray-600",
  };

  if (isLoading) return <LoadingScreen theme={theme} isDark={isDark} />;
  if (!isAuthenticated)
    return (
      <AuthScreen
        onLogin={() => setIsAuthenticated(true)}
        theme={theme}
        setTheme={setTheme}
        isDark={isDark}
        colors={colors}
      />
    );

  return (
    <div
      className={`h-[100dvh] ${colors.bg} flex flex-col md:flex-row transition-colors duration-500 overflow-hidden`}
    >
      <GlobalStyles theme={theme} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: isDark ? "#333" : "#fff", color: isDark ? "#fff" : "#000" },
        }}
      />

      {/* SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col w-20 lg:w-64 m-4 rounded-3xl ${colors.card} z-20 h-[calc(100vh-2rem)]`}
      >
        <div className="p-6 flex items-center justify-center lg:justify-start">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-red-600" : "bg-black"} shrink-0 shadow-lg`}
          >
            <Briefcase className="text-white" size={20} />
          </div>
          <span
            className={`ml-3 font-bold text-xl hidden lg:block ${isDark ? "font-mono" : "font-sans"}`}
          >
            JH Pro
          </span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 flex flex-col items-center lg:items-stretch">
          <NavButton
            id="dashboard"
            icon={LayoutGrid}
            label="Dashboard"
            active={activeTab}
            setActive={setActiveTab}
            colors={colors}
          />
          <NavButton
            id="tracker"
            icon={Briefcase}
            label="Applications"
            active={activeTab}
            setActive={setActiveTab}
            colors={colors}
          />
          <NavButton
            id="mail"
            icon={LayoutTemplate}
            label="Mail Wizard"
            active={activeTab}
            setActive={setActiveTab}
            colors={colors}
          />
          <NavButton
            id="notes"
            icon={FileText}
            label="Notes"
            active={activeTab}
            setActive={setActiveTab}
            colors={colors}
          />
          <div className={`h-px w-full my-4 ${isDark ? "bg-zinc-800" : "bg-gray-100"}`}></div>
          <NavButton
            id="profile"
            icon={User}
            label="Profile"
            active={activeTab}
            setActive={setActiveTab}
            colors={colors}
          />
        </nav>
        <div className="p-4 flex flex-col items-center lg:items-stretch mt-auto">
          <button
            onClick={() => setTheme(isDark ? "clean" : "nothing")}
            className={`w-full p-3 mb-2 rounded-xl flex items-center justify-center lg:justify-start transition-all ${colors.secondary}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="ml-3 hidden lg:block text-xs font-bold uppercase tracking-wider">
              Switch Theme
            </span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className={`w-full p-3 rounded-xl flex items-center justify-center lg:justify-start transition-all border text-red-500 border-red-500/20 hover:bg-red-500/10`}
          >
            <LogOut size={18} />
            <span className="ml-3 hidden lg:block text-xs font-bold uppercase tracking-wider">
              Log Out
            </span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div
        className={`md:hidden fixed top-0 w-full z-30 px-5 py-4 bg-opacity-95 backdrop-blur-md border-b ${isDark ? "bg-black border-zinc-900" : "bg-white border-gray-100"} flex justify-between items-center`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDark ? "bg-red-600" : "bg-black"}`}
          >
            <span className="font-bold text-white text-xs">JH</span>
          </div>
          <span className="font-bold text-lg tracking-tight">JobHunter</span>
        </div>
        <button
          onClick={() => setTheme(isDark ? "clean" : "nothing")}
          className={`p-2 rounded-full ${colors.secondary}`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar pt-20 pb-32 md:py-4 md:pr-4 md:pb-4 scroll-smooth">
        <div className="max-w-6xl mx-auto min-h-full flex flex-col">
          <DesktopHeader
            activeTab={activeTab}
            profile={profile}
            theme={theme}
            setTheme={setTheme}
            isDark={isDark}
            colors={colors}
            setActive={setActiveTab}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
              className="h-full"
            >
              {activeTab === "dashboard" && (
                <DashboardView
                  applications={applications}
                  goal={goal}
                  colors={colors}
                  isDark={isDark}
                  setActive={setActiveTab}
                  profile={profile}
                />
              )}
              {activeTab === "tracker" && (
                <TrackerView
                  applications={applications}
                  setApplications={setApplications}
                  colors={colors}
                  isDark={isDark}
                />
              )}
              {activeTab === "mail" && (
                <MailWizard
                  templates={templates}
                  setTemplates={setTemplates}
                  profile={profile}
                  onSend={(app) => {
                    setApplications([app, ...applications]);
                    setActiveTab("tracker");
                  }}
                  colors={colors}
                  isDark={isDark}
                />
              )}
              {activeTab === "notes" && (
                <NotesView notes={notes} setNotes={setNotes} colors={colors} isDark={isDark} />
              )}
              {activeTab === "profile" && (
                <ProfileView
                  profile={profile}
                  setProfile={setProfile}
                  goal={goal}
                  setGoal={setGoal}
                  colors={colors}
                  isDark={isDark}
                  onLogout={() => setIsAuthenticated(false)}
                />
              )}
              {!["dashboard", "tracker", "mail", "notes", "profile"].includes(activeTab) && (
                <NotFoundView colors={colors} isDark={isDark} setActive={setActiveTab} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* FIXED MOBILE BOTTOM DOCK */}
      <motion.div
        initial={{ y: 100, x: "-50%" }}
        animate={{ y: 0, x: "-50%" }}
        className={`md:hidden fixed bottom-6 left-1/2 z-50 w-[90%] max-w-sm rounded-full glass-panel shadow-2xl border ${isDark ? "border-zinc-800 bg-black/80" : "border-gray-200 bg-white/90"}`}
      >
        <div className="relative flex items-center justify-between px-2 py-1">
          <div className="flex gap-1">
            <MobileNavBtn
              id="dashboard"
              icon={LayoutGrid}
              active={activeTab}
              setActive={setActiveTab}
              colors={colors}
              isDark={isDark}
            />
            <MobileNavBtn
              id="tracker"
              icon={Briefcase}
              active={activeTab}
              setActive={setActiveTab}
              colors={colors}
              isDark={isDark}
            />
          </div>
          <div className="relative -top-6">
            <button
              onClick={() => setActiveTab("mail")}
              className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transform transition-transform active:scale-90 ${isDark ? "bg-red-600 text-white ring-8 ring-black" : "bg-black text-white ring-8 ring-white"}`}
            >
              <Plus size={28} />
            </button>
          </div>
          <div className="flex gap-1">
            <MobileNavBtn
              id="notes"
              icon={FileText}
              active={activeTab}
              setActive={setActiveTab}
              colors={colors}
              isDark={isDark}
            />
            <MobileNavBtn
              id="profile"
              icon={User}
              active={activeTab}
              setActive={setActiveTab}
              colors={colors}
              isDark={isDark}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
