import models from "../model/index.js";

export const getCounts = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalApps, bouncedApps, pendingPlans, offerApps] = await Promise.all([
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: { $ne: "bounced" } }),
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: "bounced" }),
    models.Plan.countDocuments({ user: userId, statusFlag: 0, status: "pending" }),
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: "offer" }),
  ]);

  return new Response("Counts fetched", {
    totalApps: totalApps || 0,
    bouncedApps: bouncedApps || 0,
    pendingApps: pendingPlans || 0,
    offerApps: offerApps || 0,
  }, 200);
});
