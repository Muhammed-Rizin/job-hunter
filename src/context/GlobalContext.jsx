import { createContext, useContext, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useAuth } from "./AuthContext";

const GlobalContext = createContext(null);

const DEFAULT_PROFILE = {
  userId: null,
  name: "",
  title: "",
  email: "",
  mobile: "",
  location: "",
  summary: "",
  skills: "",
  noticePeriod: "",
  currentCtc: "",
  expectedCtc: "",
  resumeName: "",
  resumeLink: "",
  image: "",
};

const normalizeProfile = (value = {}) => {
  const merged = { ...DEFAULT_PROFILE, ...value };
  if (!merged.mobile && value?.phone) merged.mobile = value.phone;
  return merged;
};

const isLegacySeedProfile = (value) =>
  value?.name === "Rizin" && value?.email === "rizin@example.com";

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
  const { user } = useAuth();
  const [profile, setProfileState] = useLocalStorage("jh_profile_v6", DEFAULT_PROFILE);
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

  const setProfile = (updater) => {
    setProfileState((prev) => {
      const nextValue = typeof updater === "function" ? updater(prev) : updater;
      return normalizeProfile(nextValue);
    });
  };

  useEffect(() => {
    setProfileState((prev) => {
      const normalized = normalizeProfile(prev);
      return isLegacySeedProfile(normalized) ? normalizeProfile({}) : normalized;
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setProfileState((prev) => {
      const normalized = normalizeProfile(prev);
      const userId = user?._id || user?.id || user?.userId || normalized.userId;
      const base =
        normalized.userId && userId && normalized.userId !== userId
          ? normalizeProfile({ userId })
          : normalized;

      return normalizeProfile({
        ...base,
        userId,
        name: user?.name || base.name,
        email: user?.email || base.email,
        mobile: user?.mobile || user?.phone || base.mobile,
        image: user?.image || base.image,
      });
    });
  }, [user]);

  const normalizedProfile = useMemo(() => normalizeProfile(profile), [profile]);

  return (
    <GlobalContext.Provider
      value={{
        profile: normalizedProfile,
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
