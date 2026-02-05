import models from "../model/index.js";
import { getDate, getTime } from "../helper/functions.js";
import { validateResumeLink } from "../utils/resume.js";

/**
 * @desc    Get logged-in user (profile)
 * @route   GET /user/me
 */
export const me = asyncErrorHandler(async (req, res) => {
  const data = await models.User.findOne({ _id: req.user._id, status: 0 }, { password: 0 });

  if (!data) throw new Error("User not found", 404);

  return new Response("User fetched successfully", { data }, 200);
});

/**
 * @desc    Update user profile
 * @route   PUT /user/profile
 */
export const updateProfile = asyncErrorHandler(async (req, res) => {
  const payload = req.body || {};
  const allowedFields = [
    "name",
    "image",
    "email",
    "mobile",
    "username",
    "title",
    "location",
    "summary",
    "skills",
    "noticePeriod",
    "currentCtc",
    "expectedCtc",
    "resumeName",
    "resumeLink",
  ];

  const updates = allowedFields.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      acc[key] = payload[key];
    }
    return acc;
  }, {});

  if (isNull(updates.mobile) && !isNull(payload.phone)) {
    updates.mobile = payload.phone;
  }

  if (Object.prototype.hasOwnProperty.call(updates, "resumeLink")) {
    const trimmedLink = updates.resumeLink ? String(updates.resumeLink).trim() : "";
    if (!trimmedLink) {
      updates.resumeLink = "";
      updates.resumeName = "";
    } else {
      const resumeInfo = await validateResumeLink(trimmedLink, updates.resumeName);
      updates.resumeLink = resumeInfo?.link || trimmedLink;
      updates.resumeName = resumeInfo?.filename || updates.resumeName || "Resume.pdf";
    }
  }

  const updated = await models.User.findOneAndUpdate(
    { _id: req.user._id, status: 0 },
    {
      ...updates,
      upDate: getDate(),
      upTime: getTime(),
    },
    { new: true, projection: { password: 0 } },
  );

  if (!updated) throw new Error("User not found", 404);

  return new Response("Profile updated successfully", updated, 200);
});
