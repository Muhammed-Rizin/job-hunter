import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useAuth } from "./AuthContext";
import { del, get, post, put } from "../services/api";

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
  const [goal, setGoalState] = useLocalStorage("jh_goal_v2", {
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 2))
      .toISOString()
      .split("T")[0],
    targetRole: "Frontend Dev",
    targetCount: 50,
    title: "Apply to 50 roles",
  });
  const [applications, setApplications] = useLocalStorage("jh_apps_v3", DUMMY_APPS);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const applicationsLoadedRef = useRef(false);
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

  const setGoal = (updater) => {
    setGoalState((prev) => (typeof updater === "function" ? updater(prev) : updater));
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
        title: user?.title || base.title,
        location: user?.location || base.location,
        summary: user?.summary || base.summary,
        skills: user?.skills || base.skills,
        noticePeriod: user?.noticePeriod || base.noticePeriod,
        currentCtc: user?.currentCtc || base.currentCtc,
        expectedCtc: user?.expectedCtc || base.expectedCtc,
        resumeName: user?.resumeName || base.resumeName,
        resumeLink: user?.resumeLink || base.resumeLink,
      });
    });
  }, [user]);

  const normalizeApplication = useCallback((application) => {
    if (!application) return null;
    const id = application._id || application.id || application.applicationId || Date.now();
    return {
      ...application,
      id,
      _id: application._id || id,
    };
  }, []);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    try {
      setApplicationsLoading(true);
      const response = await get("applications");
      const data = response?.data || response?.applications || response;
      if (Array.isArray(data)) {
        setApplications(data.map(normalizeApplication));
      }
    } catch (error) {
      // ignore application load errors
    } finally {
      setApplicationsLoading(false);
    }
  }, [normalizeApplication, setApplications, user]);

  const createApplication = useCallback(
    async (payload) => {
      const response = await post("applications", payload);
      const data = response?.data || response?.application || response;
      const normalized = normalizeApplication(data);
      if (normalized) {
        setApplications((prev) => [normalized, ...prev]);
      }
      return normalized;
    },
    [normalizeApplication, setApplications],
  );

  const updateApplicationStatus = useCallback(
    async (id, status, statusDetails) => {
      if (!id) return;
      await put("applications", { id, status, statusDetails });
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status, statusDetails: statusDetails || app.statusDetails } : app,
        ),
      );
    },
    [setApplications],
  );

  const deleteApplication = useCallback(
    async (id) => {
      if (!id) return;
      await del(`applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    },
    [setApplications],
  );

  useEffect(() => {
    if (!user) return;

    const loadGoal = async () => {
      try {
        const response = await get("goals/active");
        const data = response?.data || response?.goal;
        if (data) {
          setGoalState((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        // ignore goal load errors
      }
    };

    loadGoal();
  }, [user]);

  useEffect(() => {
    if (!user) {
      applicationsLoadedRef.current = false;
      return;
    }
    if (applicationsLoadedRef.current) return;
    applicationsLoadedRef.current = true;
    fetchApplications();
  }, [user, fetchApplications]);

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
        applicationsLoading,
        fetchApplications,
        createApplication,
        updateApplicationStatus,
        deleteApplication,
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
