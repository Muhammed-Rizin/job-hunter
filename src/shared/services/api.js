import axios from "axios";
import { API_URL } from "@/shared/config/app.config";
import { getDeviceId } from "@/shared/utils/device";
import { clearSession, getAccessToken, getRefreshToken, setAccessToken } from "@/shared/utils/session";

axios.defaults.withCredentials = true;

const axiosApi = axios.create({ baseURL: API_URL });

axiosApi.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  const deviceId = getDeviceId();

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers["x-access-token"] = accessToken;
  }

  if (deviceId) {
    config.headers = config.headers || {};
    config.headers["x-device-id"] = deviceId;
  }

  return config;
});

let refreshPromise = null;
let refreshFailed = false;

const isRefreshEndpoint = (url = "") => url.includes("auth/refreshToken");

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalConfig = error?.config || {};
    const requestUrl = originalConfig?.url || "";
    const storedRefreshToken = getRefreshToken();
    if (refreshFailed) {
      return Promise.reject(error);
    }

    if (!storedRefreshToken && (status === 401 || status === 403)) {
      return Promise.reject(error);
    }

    if ((status === 401 || status === 403) && !originalConfig._retry && !isRefreshEndpoint(requestUrl)) {
      originalConfig._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshToken().finally(() => {
            refreshPromise = null;
          });
        }
        await refreshPromise;
        return axiosApi(originalConfig);
      } catch (refreshError) {
        refreshFailed = true;
        clearSession();
        window.location = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then((response) => response.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, data, { ...config })
    .then((response) => response.data)
    .catch((error) => {
      throw error?.response?.data;
    });
}

export async function put(url, data, config = {}) {
  return axiosApi.put(url, { ...data }, { ...config }).then((response) => response.data);
}

export async function patch(url, data, config = {}) {
  return axiosApi.patch(url, { ...data }, { ...config }).then((response) => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi.delete(url, { ...config }).then((response) => response.data);
}

export const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error("No refresh token");
  const response = await put(
    "auth/refreshToken",
    { refreshToken: refresh, deviceId: getDeviceId() },
    {
      headers: refresh ? { "x-refresh-token": refresh } : {},
    },
  );
  if (response?.accessToken) setAccessToken(response.accessToken);
  return response.accessToken;
};
