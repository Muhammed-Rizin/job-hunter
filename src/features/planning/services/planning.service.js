import { del, get, post, put } from "@/shared/services/api";

export const listPlans = async () => {
  const response = await get("/plans");
  return response?.data || response || [];
};

export const createPlanRecord = async (payload) => {
  return post("/plans", payload);
};

export const markPlanAsApplied = async (id) => {
  return put(`/plans/${id}`, { status: "applied" });
};

export const deletePlan = async (id) => {
  return del(`/plans/${id}`);
};
