import { get, put } from "@/shared/services/api";

export const fetchCurrentProfile = async () => {
  const response = await get("user/me");
  if (!response) return null;
  return response?.data || response?.user || response?.profile || response;
};

export const updateProfile = async (profilePayload) => {
  return put("user/profile", profilePayload);
};
