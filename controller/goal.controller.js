import models from "../model/index.js";
import { getDate, getTime } from "../helper/functions.js";

const normalizeDate = (value) => {
  if (isNull(value)) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().split("T")[0];
};

/**
 * @desc    Get active goal
 * @route   GET /goals/active
 */
export const getActive = asyncErrorHandler(async (req, res) => {
  const data = await models.Goal.findOne({
    user: req.user._id,
    status: 0,
    isActive: true,
  }).sort({ updatedAt: -1 });

  if (data && isNull(data.startDate)) {
    const fallbackStartDate = normalizeDate(data.createdAt) || normalizeDate(data.date);
    if (fallbackStartDate) {
      data.startDate = fallbackStartDate;
    }
  }

  return new Response("Active goal fetched", { data }, 200);
});

/**
 * @desc    Create/update active goal (only one active per user)
 * @route   PUT /goals/active
 */
export const upsertActive = asyncErrorHandler(async (req, res) => {
  const { id, title, targetRole, targetCount, startDate, targetDate } = req.body || {};

  if (isNull(targetCount)) throw new Error("Target count required", 400);
  const numericTargetCount = Number(targetCount);
  if (Number.isNaN(numericTargetCount) || numericTargetCount <= 0) {
    throw new Error("Target count must be greater than 0", 400);
  }
  if (isNull(startDate)) throw new Error("Start date required", 400);
  if (isNull(targetDate)) throw new Error("Target date required", 400);
  if (isNull(title) && isNull(targetRole)) {
    throw new Error("Goal title or target role required", 400);
  }

  const normalizedStartDate = normalizeDate(startDate);
  if (!normalizedStartDate) throw new Error("Invalid start date", 400);
  const normalizedTargetDate = normalizeDate(targetDate);
  if (!normalizedTargetDate) throw new Error("Invalid target date", 400);
  if (normalizedStartDate > normalizedTargetDate) {
    throw new Error("Start date must be before or equal to target date", 400);
  }

  await models.Goal.updateMany(
    { user: req.user._id, status: 0, isActive: true },
    { isActive: false, upDate: getDate(), upTime: getTime() },
  );

  const payload = {
    title: title || targetRole,
    targetRole,
    targetCount: numericTargetCount,
    startDate: normalizedStartDate,
    targetDate: normalizedTargetDate,
    isActive: true,
    upDate: getDate(),
    upTime: getTime(),
  };

  let data;
  if (!isNull(id)) {
    data = await models.Goal.findOneAndUpdate({ _id: id, user: req.user._id, status: 0 }, payload, {
      new: true,
    });
  }

  if (!data) {
    data = await models.Goal.create({
      ...payload,
      user: req.user._id,
    });
  }

  return new Response("Goal updated", { data }, 200);
});
