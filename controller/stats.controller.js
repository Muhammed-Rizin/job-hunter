import models from "../model/index.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import Response from "../utils/responseHandler.js";

export const getCounts = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  const [allApps, plans] = await Promise.all([
    models.Application.find({ user: userId, statusFlag: 0 }),
    models.Plan.find({ user: userId, statusFlag: 0 }),
  ]);

  const pendingLeads = plans.filter(p => p.status === "pending").length;
  const appliedLeads = plans.filter(p => p.status === "applied").length;
  
  const bouncedApps = allApps.filter(a => a.status === "bounced").length;
  const totalApplied = allApps.length - bouncedApps;
  const offerApps = allApps.filter(a => a.status === "offer").length;
  const appsToday = allApps.filter(a => a.appliedDate === todayStr).length;

  return new Response(
    "Counts fetched",
    {
      totalApplied,
      pendingLeads,
      appliedLeads,
      bouncedApps,
      offerApps,
      appsToday,
    },
    200,
  );
});
