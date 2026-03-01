import models from "../model/index.js";

export const getCounts = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const todayStr = new Date().toISOString().split("T")[0];

  // We fetch all records and filter in JS to avoid Mongoose $ne issues in production environments
  const [allApps, pendingPlans] = await Promise.all([
    models.Application.find({ user: userId, statusFlag: 0 }),
    models.Plan.countDocuments({ user: userId, statusFlag: 0, status: "pending" }),
  ]);

  const bouncedApps = allApps.filter(a => a.status === "bounced").length;
  const totalApps = allApps.length - bouncedApps;
  const offerApps = allApps.filter(a => a.status === "offer").length;
  const appsToday = allApps.filter(a => a.appliedDate === todayStr).length;

  return new Response(
    "Counts fetched",
    {
      totalApps,
      bouncedApps,
      pendingApps: pendingPlans || 0,
      offerApps,
      appsToday,
    },
    200,
  );
});
