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
    email: "rizin@example.com",
    phone: "+1 555 000 1234",
    noticePeriod: "Immediate",
    currentCtc: "$80k",
    expectedCtc: "$120k",
    resumeName: "Rizin_Resume_2026.pdf",
    resumeLink: "",
    location: "Austin, TX",
    skills: "React, TypeScript, Node.js, Tailwind CSS",
    summary:
      "Full stack developer focused on clean UI and scalable systems. Loves shipping fast and iterating with users.",
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
      body:
        "Hi {{HiringManager}},\n\nI'm writing to apply for the {{Role}} position at {{Company}}.\n\nI have experience in frontend technologies and I'm passionate about building great products.\n\nNotice Period: {{NoticePeriod}}\nExpected CTC: {{ExpectedCTC}}\n\nResume attached.\n\nBest,\n{{Name}}",
    },
  ]);
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
