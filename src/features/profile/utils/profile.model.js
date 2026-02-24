export const DEFAULT_PROFILE = {
  userId: null,
  name: "",
  title: "",
  email: "",
  mobile: "",
  location: "",
  summary: "",
  skills: "",
  noticePeriod: "",
  currentCtc: "",
  expectedCtc: "",
  resumeName: "",
  resumeLink: "",
  image: "",
};

export const normalizeProfile = (value = {}) => {
  const merged = { ...DEFAULT_PROFILE, ...value };
  if (!merged.mobile && value?.phone) merged.mobile = value.phone;
  return merged;
};
