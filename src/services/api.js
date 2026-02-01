import axios from "axios";
import { API_URL } from "../config/app.config";

axios.defaults.withCredentials = true;

const axiosApi = axios.create({ baseURL: API_URL });

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 403) {
      try {
        await refreshToken();
        const response = await axios(error.config);
        return response;
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // await logout ();
        window.location = "/login";

        return Promise.reject(refreshError);
      }
    }
    console.log("Not a 401 or 403 error, or token refresh failed");
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
  const response = await put("auth/refreshToken");
  return response.accessToken;
};

export const logout = async () => {
  console.log("Log out function");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
