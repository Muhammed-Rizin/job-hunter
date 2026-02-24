import { get, put } from "@/shared/services/api";

export const fetchActiveGoal = async () => {
  const response = await get("goals/active");
  return response?.data || response?.goal || null;
};

export const updateActiveGoal = async (payload) => {
  return put("goals/active", payload);
};
