import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const GlobalContext = createContext(null);

const DUMMY_APPS = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Engineer",
    status: "interview",
    source: "linkedin",
    appliedDate: "2025-10-12",
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
  {
    id: 6,
    company: "Microsoft",
    role: "React Developer",
    status: "technical",
    source: "linkedin",
    appliedDate: "2025-10-26",
  },
  {
    id: 7,
    company: "Vercel",
    role: "Design Engineer",
    status: "applied",
    source: "website",
    appliedDate: "2025-10-27",
  },
  {
    id: 8,
    company: "Notion",
    role: "Product Engineer",
    status: "applied",
    source: "mail",
    appliedDate: "2025-10-28",
  },
];

export const GlobalProvider = ({ children }) => {
  const [profile, setProfile] = useLocalStorage("jh_profile_v6", {
    name: "Rizin",
    title: "Full Stack Developer",
  });
  const [goal, setGoal] = useLocalStorage("jh_goal_v2", {
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
      .toISOString()
      .split("T")[0],
    targetRole: "Frontend Dev",
    targetCount: 50,
  });
  const [applications, setApplications] = useLocalStorage("jh_apps_v3", DUMMY_APPS);
  const [templates, setTemplates] = useLocalStorage("jh_templates_v2", []);
  const [notes, setNotes] = useLocalStorage("jh_notes_v2", []);

  return (
    <GlobalContext.Provider
      value={{
        profile,
        setProfile,
        goal,
        setGoal,
        applications,
        setApplications,
        templates,
        setTemplates,
        notes,
        setNotes,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
