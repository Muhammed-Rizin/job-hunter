export const getCounts = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalApps, bouncedApps, pendingApps, offerApps] = await Promise.all([
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: { $ne: "bounced" } }),
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: "bounced" }),
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: { $in: ["applied", "hr_contact"] } }),
    models.Application.countDocuments({ user: userId, statusFlag: 0, status: "offer" }),
  ]);

  return new Response("Counts fetched", {
    totalApps,
    bouncedApps,
    pendingApps,
    offerApps,
  }, 200);
});
