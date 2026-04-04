const DEVICE_ID_KEY = "jh_device_id_v1";

export const getDeviceId = () => {
  if (typeof window === "undefined") return "";
  let deviceId = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId =
      window.crypto?.randomUUID?.() || `dev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};
