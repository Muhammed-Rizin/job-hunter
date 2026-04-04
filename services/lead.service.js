import models from "../model/index.js";

/**
 * @desc    Check for duplicate leads by company name (case-insensitive)
 */
export const findDuplicateLead = async (userId, companyName) => {
  if (isNull(companyName)) return null;
  return await models.Plan.findOne({
    user: userId,
    statusFlag: 0,
    companyName: {
      $regex: new RegExp(`^${companyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
    },
  });
};

/**
 * @desc    Normalized lead creation with validation
 */
export const createLead = async (userId, payload) => {
  const companyName = String(payload.companyName || "").trim();
  if (isNull(companyName)) throw new Error("Company name is required", 400);

  const duplicate = await findDuplicateLead(userId, companyName);
  if (duplicate) {
    return { skipped: true, reason: `Lead already exists: ${companyName}` };
  }

  const plan = await models.Plan.create({
    ...payload,
    user: userId,
    companyName,
    status: payload.status || "pending",
  });

  return { skipped: false, plan };
};

/**
 * @desc    Fetch leads ready for application
 */
export const getPendingLeads = async (userId, { limit = 10, hasEmail = true } = {}) => {
  const query = {
    user: userId,
    statusFlag: 0,
    status: "pending",
  };
  if (hasEmail) query.email = { $nin: [null, "", "null"] };

  return await models.Plan.find(query).sort({ createdAt: -1 }).limit(limit);
};

/**
 * @desc    Update lead status (e.g., set to applied, bounced)
 */
export const updateLeadStatus = async (userId, leadId, update) => {
  const updated = await models.Plan.findOneAndUpdate(
    { _id: leadId, user: userId, statusFlag: 0 },
    update,
    { new: true },
  );
  if (!updated) throw new Error("Lead not found", 404);
  return updated;
};
