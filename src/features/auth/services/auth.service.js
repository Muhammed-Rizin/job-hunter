import { del, post } from "@/shared/services/api";

export const loginUser = async ({ username, password, deviceId }) => {
  return post("auth/login", { username, password, deviceId });
};

export const registerUser = async ({ name, email, mobile, username, password, deviceId }) => {
  return post("auth/register", {
    name,
    email,
    mobile,
    username,
    password,
    deviceId,
  });
};

export const logoutUser = async ({ deviceId }) => {
  return del("auth/logout", { data: { deviceId } });
};
