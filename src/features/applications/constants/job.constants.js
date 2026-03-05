import { Globe, Mail, Linkedin, Briefcase, Search, XCircle } from "lucide-react";

export const APPLICATION_STATUSES = [
  {
    id: "all",
    label: "All",
    color: "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  },
  {
    id: "applied",
    label: "Applied",
    color:
      "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  },
  {
    id: "hr_contact",
    label: "HR Call",
    color:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  {
    id: "interview",
    label: "Interview",
    color:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  {
    id: "technical",
    label: "Tech",
    color:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
  },
  {
    id: "rejected",
    label: "Rejected",
    color:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
  {
    id: "bounced",
    label: "Bounced",
    color:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
  {
    id: "offer",
    label: "Offer",
    color:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  },
];

export const PLATFORMS = [
  { id: "all", label: "All Sources", icon: Globe },
  { id: "mail", label: "Email", icon: Mail },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "indeed", label: "Indeed", icon: Briefcase },
  { id: "naukri", label: "Naukri", icon: Search },
  { id: "website", label: "Website", icon: Globe },
];
