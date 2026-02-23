import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

export const GlobalProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfileState] = useLocalStorage("jh_profile_v6", DEFAULT_PROFILE);
  const [goal, setGoalState] = useLocalStorage("jh_goal_v2", {
    targetDate: "",
    targetRole: "",
    targetCount: 0,
    title: "",
  });
  const [applications, setApplications] = useLocalStorage("jh_apps_v3", []);
  const [bouncedApps, setBouncedApps] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsMeta, setApplicationsMeta] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 20,
  });
  const applicationsLoadedRef = useRef(false);
  const applicationsQueryRef = useRef({
    search: "",
    status: "all",
    source: "all",
    sort: "newest",
    page: 1,
    limit: 20,
  });
  const profileLoadedRef = useRef(false);
  const [templates, setTemplates] = useLocalStorage("jh_templates_v2", []);
  const [notes, setNotes] = useLocalStorage("jh_notes_v2", []);
  const [stats, setStats] = useState({ totalApps: 0, bouncedApps: 0, pendingApps: 0, offerApps: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const res = await get("stats/counts");
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (e) {
      console.error("Stats error:", e);
    }
  }, []);

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
    setProfileState((prev) => normalizeProfile(prev));
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

  useEffect(() => {
    if (!user) {
      profileLoadedRef.current = false;
      return;
    }
    if (profileLoadedRef.current) return;
    profileLoadedRef.current = true;
    fetchStats();

    const loadProfile = async () => {
      try {
        const response = await get("user/me");
        const data = response?.data || response?.user || response?.profile;
        if (data) {
          setProfileState((prev) => normalizeProfile({ ...prev, ...data }));
        }
      } catch (error) {
        // ignore profile load errors
      }
    };

    loadProfile();
  }, [user, fetchStats]);

  const normalizeApplication = useCallback((application) => {
    if (!application) return null;
    const id = application._id || application.id || application.applicationId || Date.now();
    return {
      ...application,
      id,
      _id: application._id || id,
    };
  }, []);

  const fetchApplications = useCallback(
    async (query = {}) => {
      if (!user) return;
      try {
        setApplicationsLoading(true);
        fetchStats();
        
        // Fetch bounced separately
        get("applications/bounced").then(res => {
          const list = res?.data || res || [];
          if (Array.isArray(list)) {
            setBouncedApps(list.map(normalizeApplication));
          }
        }).catch(() => {});

        const mergedQuery = { ...applicationsQueryRef.current, ...query };
        applicationsQueryRef.current = mergedQuery;
        const params = new URLSearchParams();
        if (mergedQuery.search) params.set("search", mergedQuery.search);
        if (mergedQuery.status) params.set("status", mergedQuery.status);
        if (mergedQuery.source) params.set("source", mergedQuery.source);
        if (mergedQuery.sort) params.set("sort", mergedQuery.sort);
        if (mergedQuery.page) params.set("page", String(mergedQuery.page));
        if (mergedQuery.limit) params.set("limit", String(mergedQuery.limit));
        const queryString = params.toString();

        const response = await get(queryString ? `applications?${queryString}` : "applications");
        const payload = response?.data || response;
        const data = payload?.data || payload?.applications || payload;
        const meta = payload?.meta || payload?.pagination;
        if (Array.isArray(data)) {
          setApplications(data.map(normalizeApplication));
        }
        if (meta) {
          setApplicationsMeta((prev) => ({
            ...prev,
            ...meta,
          }));
        }
      } catch (error) {
        console.log("Error fetching applications:", error);
        // ignore application load errors
      } finally {
        setApplicationsLoading(false);
      }
    },
    [normalizeApplication, setApplications, user, fetchStats],
  );

  const createApplication = useCallback(
    async (payload) => {
      const response = await post("applications", payload);
      const data = response?.data || response?.application || response;
      const normalized = normalizeApplication(data);
      if (normalized) {
        await fetchApplications({ page: 1 });
      }
      return normalized;
    },
    [fetchApplications, normalizeApplication],
  );

  const updateApplicationStatus = useCallback(
    async (id, status, statusDetails) => {
      if (!id) return;
      await put("applications", { id, status, statusDetails });
      await fetchApplications(applicationsQueryRef.current);
    },
    [fetchApplications],
  );

  const deleteApplication = useCallback(
    async (id) => {
      if (!id) return;
      await del(`applications/${id}`);
      await fetchApplications(applicationsQueryRef.current);
    },
    [fetchApplications],
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
        bouncedApps,
        setApplications,
        applicationsLoading,
        applicationsMeta,
        fetchApplications,
        createApplication,
        updateApplicationStatus,
        deleteApplication,
        stats,
        fetchStats,
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
