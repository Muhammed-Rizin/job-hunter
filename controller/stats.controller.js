import models from "../model/index.js";

export const getCounts = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const todayStr = new Date().toISOString().split("T")[0];

  const [allApps, plans] = await Promise.all([
    models.Application.find({ user: userId, statusFlag: 0 }),
    models.Plan.find({ user: userId, statusFlag: 0 }),
  ]);

  const pendingApps = plans.filter((p) => p.status === "pending").length;
  const bouncedApps = allApps.filter((a) => a.status === "bounced").length;
  const appliedApps = allApps.length - bouncedApps;
  const offerApps = allApps.filter((a) => a.status === "offer").length;
  const appsToday = allApps.filter((a) => a.appliedDate === todayStr).length;
  const interviews = allApps.filter((a) =>
    ["interview", "technical", "hr_contact"].includes(a.status),
  ).length;

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
    },
    200,
  );
});
