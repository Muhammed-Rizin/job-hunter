import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useProfile } from "@/features/profile/context/ProfileContext";
import useLocalStorage from "@/shared/hooks/useLocalStorage";
import {
  createApplicationRecord,
  deleteApplicationRecord,
  listApplications,
  listBouncedApplications,
  updateApplicationRecordStatus,
} from "@/features/applications/services/applications.service";

const ApplicationsContext = createContext(null);

const DEFAULT_QUERY = {
  search: "",
  status: "all",
  source: "all",
  sort: "newest",
  page: 1,
  limit: 20,
};

const DEFAULT_META = {
  total: 0,
  page: 1,
  pages: 1,
  limit: 20,
};

export const ApplicationsProvider = ({ children }) => {
  const { user } = useAuth();
  const { fetchStats } = useProfile();
  const [applications, setApplications] = useLocalStorage("jh_apps_v3", []);
  const [bouncedApps, setBouncedApps] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsMeta, setApplicationsMeta] = useState(DEFAULT_META);
  const queryRef = useRef(DEFAULT_QUERY);

  const fetchApplications = useCallback(
    async (query = {}) => {
      if (!user) return;
      try {
        setApplicationsLoading(true);
        fetchStats();

        listBouncedApplications()
          .then((records) => setBouncedApps(records))
          .catch(() => {});

        const mergedQuery = { ...queryRef.current, ...query };
        queryRef.current = mergedQuery;
        const { applications: records, meta } = await listApplications(mergedQuery);
        setApplications(Array.isArray(records) ? records : []);
        if (meta) {
          setApplicationsMeta((prev) => ({ ...prev, ...meta }));
        }
      } catch (error) {
        // ignore applications load errors
      } finally {
        setApplicationsLoading(false);
      }
    },
    [fetchStats, setApplications, user],
  );

  const createApplication = useCallback(
    async (payload) => {
      const record = await createApplicationRecord(payload);
      if (record) {
        await fetchApplications({ page: 1 });
      }
      return record;
    },
    [fetchApplications],
  );

  const updateApplicationStatus = useCallback(
    async (id, status, statusDetails) => {
      if (!id) return;
      await updateApplicationRecordStatus(id, status, statusDetails);
      await fetchApplications(queryRef.current);
    },
    [fetchApplications],
  );

  const deleteApplication = useCallback(
    async (id) => {
      if (!id) return;
      await deleteApplicationRecord(id);
      await fetchApplications(queryRef.current);
    },
    [fetchApplications],
  );

  const value = useMemo(
    () => ({
      applications,
      bouncedApps,
      setApplications,
      applicationsLoading,
      applicationsMeta,
      fetchApplications,
      createApplication,
      updateApplicationStatus,
      deleteApplication,
    }),
    [
      applications,
      applicationsLoading,
      applicationsMeta,
      bouncedApps,
      createApplication,
      deleteApplication,
      fetchApplications,
      setApplications,
      updateApplicationStatus,
    ],
  );

  return <ApplicationsContext.Provider value={value}>{children}</ApplicationsContext.Provider>;
};

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) throw new Error("useApplications must be used within ApplicationsProvider");
  return context;
};
