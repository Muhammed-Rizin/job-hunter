import models from "../model/index.js";
import Response from "../utils/responseHandler.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
} from "../services/lead.service.js";

/**
 * @desc    List all active plans for a user
 * @route   GET /plans
 */
export const list = asyncErrorHandler(async (req) => {
  const { status = "all", limit = 100 } = req.query;
  const data = await getLeads(req.user._id, {
    limit: Number(limit),
    status,
  });

  return new Response("Plans fetched successfully", { data }, 200);
});

/**
 * @desc    Create a new planning entry
 * @route   POST /plans
 */
export const create = asyncErrorHandler(async (req) => {
  const { skipped, plan, reason } = await createLead(req.user._id, req.body);

  if (skipped) throw new Error(reason, 409);

  return new Response("Plan created successfully", { plan }, 201);
});

/**
 * @desc    Update an existing plan (e.g., set status to 'applied')
 * @route   PUT /plans/:id
 */
export const update = asyncErrorHandler(async (req) => {
  const { id } = req.params;
  const updated = await updateLeadStatus(req.user._id, id, req.body);

  return new Response("Plan updated successfully", { updated }, 200);
});

/**
 * @desc    Soft delete a plan
 * @route   DELETE /plans/:id
 */
export const del = asyncErrorHandler(async (req) => {
  const { id } = req.params;
  await deleteLead(req.user._id, id);

  return new Response("Plan deleted successfully", null, 200);
});
