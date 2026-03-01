import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  deletePlan as deletePlanRecord,
  listPlans,
  markPlanAsApplied,
  createPlanRecord,
} from "@/features/planning/services/planning.service";
import { useAuth } from "@/features/auth/context/AuthContext";

const PlanningContext = createContext();

export const PlanningProvider = ({ children }) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await listPlans();
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const createPlan = useCallback(
    async (payload) => {
      const data = await createPlanRecord(payload);
      await fetchPlans();
      return data;
    },
    [fetchPlans],
  );

  const markApplied = useCallback(
    async (id) => {
      await markPlanAsApplied(id);
      await fetchPlans();
    },
    [fetchPlans],
  );

  const deletePlan = useCallback(
    async (id) => {
      await deletePlanRecord(id);
      await fetchPlans();
    },
    [fetchPlans],
  );

  return (
    <PlanningContext.Provider
      value={{
        plans,
        loading,
        error,
        fetchPlans,
        markApplied,
        deletePlan,
        createPlan,
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => useContext(PlanningContext);
