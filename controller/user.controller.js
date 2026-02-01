import models from "../model/index.js";
import { getDate, getTime } from "../helper/functions.js";

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
  const payload = req.body;

  const updated = await models.User.findOneAndUpdate(
    { _id: req.user._id, status: 0 },
    {
      ...payload,
      upDate: getDate(),
      upTime: getTime(),
    },
    { new: true, projection: { password: 0 } },
  );

  if (!updated) throw new Error("User not found", 404);

  return new Response("Profile updated successfully", updated, 200);
});

/**
 * @desc    Update goal only
 * @route   PUT /user/goal
 */
export const updateGoal = asyncErrorHandler(async (req, res) => {
  const { targetRole, targetCount, targetDate } = req.body;

  if (isNull(targetRole)) throw new Error("Target role required", 400);
  if (isNull(targetCount)) throw new Error("Target count required", 400);

  const updated = await models.User.findOneAndUpdate(
    { _id: req.user._id, status: 0 },
    {
      goal: {
        targetRole,
        targetCount,
        targetDate,
      },
      upDate: getDate(),
      upTime: getTime(),
    },
    { new: true, projection: { password: 0 } },
  );

  if (!updated) throw new Error("User not found", 404);

  return new Response("Goal updated successfully", updated, 200);
});
