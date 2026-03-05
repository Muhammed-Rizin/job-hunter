import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import useLocalStorage from "@/shared/hooks/useLocalStorage";
import { useAuth } from "@/features/auth/context/AuthContext";
import { fetchActiveGoal } from "@/features/profile/services/goal.service";
import { fetchCurrentProfile } from "@/features/profile/services/profile.service";
import { fetchStatsCounts } from "@/features/profile/services/stats.service";
import { DEFAULT_PROFILE, normalizeProfile } from "@/features/profile/utils/profile.model";

const ProfileContext = createContext(null);

const initGoal = {
  title: "",
  targetDate: "",
  startDate: "",
  targetRole: "",
  targetCount: 0,
};

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfileState] = useLocalStorage("jh_profile_v6", DEFAULT_PROFILE);
  const [goal, setGoalState] = useLocalStorage("jh_goal_v2", initGoal);
  const [stats, setStats] = useState({
    totalApps: 0,
    bouncedApps: 0,
    pendingApps: 0,
    offerApps: 0,
    appsToday: 0,
    mailSentTotal: 0,
    mailSuccessfulTotal: 0,
    goalWindowApplied: 0,
    goalWindowStart: "",
    goalWindowEnd: "",
  });
  const profileLoadedRef = useRef(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await fetchStatsCounts();
      if (data) {
        setStats((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      // ignore stats load errors
    }
  }, [setStats]);

  const setProfile = useCallback((updater) => {
    setProfileState((prev) => {
      const nextValue = typeof updater === "function" ? updater(prev) : updater;
      return normalizeProfile(nextValue);
    });
  }, [setProfileState]);

  const setGoal = useCallback((updater) => {
    setGoalState((prev) => (typeof updater === "function" ? updater(prev) : updater));
  }, [setGoalState]);

  useEffect(() => {
    setProfileState((prev) => normalizeProfile(prev));
  }, [setProfileState]);

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
  }, [setProfileState, user]);

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
        const data = await fetchCurrentProfile();
        if (data) {
          setProfileState((prev) => normalizeProfile({ ...prev, ...data }));
        }
      } catch (error) {
        // ignore profile load errors
      }
    };

    loadProfile();
  }, [fetchStats, setProfileState, user]);

  useEffect(() => {
    if (!user) return;

    const loadGoal = async () => {
      try {
        const data = await fetchActiveGoal();
        if (data) {
          setGoalState((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        // ignore goal load errors
      }
    };

    loadGoal();
  }, [setGoalState, user]);

  const value = useMemo(
    () => ({
      profile: normalizeProfile(profile),
      setProfile,
      goal,
      setGoal,
      stats,
      fetchStats,
    }),
    [fetchStats, goal, profile, setGoal, setProfile, stats],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within ProfileProvider");
  return context;
};
