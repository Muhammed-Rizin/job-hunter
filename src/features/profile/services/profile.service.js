import { get, put } from "@/shared/services/api";

export const fetchCurrentProfile = async () => {
  const response = await get("user/me");
  return response?.data || response?.user || response?.profile || null;
};

export const updateProfile = async (profilePayload) => {
  return put("user/profile", profilePayload);
};
