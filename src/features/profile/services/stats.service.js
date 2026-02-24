import { get } from "@/shared/services/api";

export const fetchStatsCounts = async () => {
  const response = await get("stats/counts");
  return response?.data || response || null;
};
