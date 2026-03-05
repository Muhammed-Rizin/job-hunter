import models from "../model/index.js";

const normalizeDate = (value) => {
  if (isNull(value)) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().split("T")[0];
};

export const getCounts = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const todayStr = new Date().toISOString().split("T")[0];

  const [allApps, plans, activeGoal] = await Promise.all([
    models.Application.find({ user: userId, statusFlag: 0 }),
    models.Plan.find({ user: userId, statusFlag: 0 }),
    models.Goal.findOne({ user: userId, status: 0, isActive: true }).sort({ updatedAt: -1 }),
  ]);

  const pendingApps = plans.filter((p) => p.status === "pending").length;
  const bouncedApps = allApps.filter((a) => a.status === "bounced").length;
  const appliedApps = allApps.length - bouncedApps;
  const offerApps = allApps.filter((a) => a.status === "offer").length;
  const appsToday = allApps.filter((a) => a.appliedDate === todayStr).length;
  const mailSentTotal = allApps.filter((a) => Boolean(a?.mail?.sent)).length;
  const mailSuccessfulTotal = allApps.filter(
    (a) => Boolean(a?.mail?.sent) && a.status !== "bounced",
  ).length;
  const interviews = allApps.filter((a) =>
    ["interview", "technical", "hr_contact"].includes(a.status),
  ).length;

  const goalWindowStart =
    normalizeDate(activeGoal?.startDate) ||
    normalizeDate(activeGoal?.createdAt) ||
    normalizeDate(activeGoal?.date);
  const goalWindowEnd = normalizeDate(activeGoal?.targetDate);

  const goalWindowApplied =
    goalWindowStart && goalWindowEnd
      ? allApps.filter((a) => {
          const appliedDate = normalizeDate(a.appliedDate);
          if (!appliedDate || a.status === "bounced") return false;
          return appliedDate >= goalWindowStart && appliedDate <= goalWindowEnd;
        }).length
      : 0;

  return new Response(
    "Counts fetched",
    {
      totalApps: allApps.length,
      appliedApps,
      bouncedApps,
      pendingApps,
      offerApps,
      appsToday,
      interviews,
      mailSentTotal,
      mailSuccessfulTotal,
      goalWindowApplied,
      goalWindowStart,
      goalWindowEnd,
    },
    200,
  );
});
