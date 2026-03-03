import { del, get, post, put } from "@/shared/services/api";

const normalizeApplication = (application) => {
  if (!application) return null;
  const id = application._id || application.id || application.applicationId || Date.now();
  return {
    ...application,
    id,
    _id: application._id || id,
  };
};

const parseApplicationsPayload = (payload = {}) => {
  const data = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.applications)
      ? payload.applications
      : Array.isArray(payload)
        ? payload
        : payload?.data && Array.isArray(payload.data) // Extra check for wrapped objects
          ? payload.data
          : [];
  const meta = payload?.meta || payload?.pagination;

  return {
    applications: data.map(normalizeApplication),
    meta,
  };
};

const toQueryString = (query = {}) => {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.source) params.set("source", query.source);
  if (query.sort) params.set("sort", query.sort);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  return params.toString();
};

export const listApplications = async (query = {}) => {
  const queryString = toQueryString(query);
  const payload = await get(queryString ? `applications?${queryString}` : "applications");
  return parseApplicationsPayload(payload);
};

export const listBouncedApplications = async () => {
  const payload = await get("applications/bounced");
  const data = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  return data.map(normalizeApplication);
};

export const createApplicationRecord = async (payload) => {
  const response = await post("applications", payload);
  const data = response?.data || response?.application || response;
  return normalizeApplication(data);
};

export const updateApplicationRecordStatus = async (id, status, statusDetails) => {
  return put("applications", { id, status, statusDetails });
};

export const deleteApplicationRecord = async (id) => {
  return del(`applications/${id}`);
};
