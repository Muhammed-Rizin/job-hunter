import { Globe, Mail, Linkedin, Briefcase, Search } from "lucide-react";

export const APPLICATION_STATUSES = [
  { id: "all", label: "All", color: "bg-gray-100 text-gray-600" },
  { id: "applied", label: "Applied", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  { id: "hr_contact", label: "HR Call", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "interview", label: "Interview", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "technical", label: "Tech", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "rejected", label: "Rejected", color: "bg-red-50 text-red-700 border-red-200" },
  { id: "offer", label: "Offer", color: "bg-green-50 text-green-700 border-green-200" },
];

export const PLATFORMS = [
  { id: "all", label: "All Sources", icon: Globe },
  { id: "mail", label: "Email", icon: Mail },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "indeed", label: "Indeed", icon: Briefcase },
  { id: "naukri", label: "Naukri", icon: Search },
  { id: "website", label: "Website", icon: Globe },
];
