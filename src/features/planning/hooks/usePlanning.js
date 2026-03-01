import { useCallback, useEffect, useState } from "react";
import {
  deletePlan as deletePlanRecord,
  listPlans,
  markPlanAsApplied,
  createPlanRecord,
} from "@/features/planning/services/planning.service";

export const usePlanning = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
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
  }, []);

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

  return { plans, loading, error, fetchPlans, markApplied, deletePlan, createPlan };
};
