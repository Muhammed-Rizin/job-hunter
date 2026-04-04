import { createLead, getPendingLeads, updateLeadStatus } from "../services/lead.service.js";

/**
 * @desc    List all active plans for a user
 * @route   GET /plans
 */
export const list = asyncErrorHandler(async (req, res) => {
  const { status, limit = 20 } = req.query;
  const data = await getPendingLeads(req.user._id, {
    limit: Number(limit),
    hasEmail: status !== "all",
  });

  return new Response("Plans fetched successfully", { data }, 200);
});

/**
 * @desc    Create a new planning entry
 * @route   POST /plans
 */
export const create = asyncErrorHandler(async (req, res) => {
  const { skipped, plan, reason } = await createLead(req.user._id, req.body);

  if (skipped) throw new Error(reason, 409);

  return new Response("Plan created successfully", { plan }, 201);
});

/**
 * @desc    Update an existing plan (e.g., set status to 'applied')
 * @route   PUT /plans/:id
 */
export const update = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updated = await models.Plan.findOneAndUpdate(
    { _id: id, user: req.user._id, statusFlag: 0 },
    updateData,
    { new: true },
  );

  if (!updated) throw new Error("Plan not found or unauthorized", 404);

  return new Response("Plan updated successfully", null, 200);
});

/**
 * @desc    Soft delete a plan
 * @route   DELETE /plans/:id
 */
export const del = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await models.Plan.findOneAndUpdate(
    { _id: id, user: req.user._id, statusFlag: 0 },
    { statusFlag: 1 },
  );

  if (!deleted) throw new Error("Plan not found", 404);

  return new Response("Plan deleted successfully", null, 200);
});
