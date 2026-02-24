import models from "../model/index.js";

export const getCounts = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const todayStr = new Date().toISOString().split("T")[0];

  const [totalApps, bouncedApps, pendingPlans, offerApps, appsToday] = await Promise.all([
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: { $ne: "bounced" } }),
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: "bounced" }),
    models.Plan.countDocuments({ user: userId, statusFlag: 0, status: "pending" }),
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: "offer" }),
    models.Application.countDocuments({ user: userId, statusFlag: 0, appliedDate: todayStr }),
  ]);

  return new Response(
    "Counts fetched",
    {
      data: {
        totalApps: totalApps || 0,
        bouncedApps: bouncedApps || 0,
        pendingApps: pendingPlans || 0,
        offerApps: offerApps || 0,
        appsToday: appsToday || 0,
      },
    },
    200,
  );
});
