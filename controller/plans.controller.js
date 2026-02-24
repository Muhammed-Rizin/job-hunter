import models from "../model/index.js";

/**
 * @desc    List all active plans for a user
 * @route   GET /plans
 */
export const list = asyncErrorHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {
    user: req.user._id,
    statusFlag: 0,
  };

  if (!isNull(status) && status !== "all") filter.status = status;

  const data = await models.Plan.find(filter).sort({ createdAt: -1 });

  return new Response("Plans fetched successfully", { data }, 200);
});

/**
 * @desc    Create a new planning entry
 * @route   POST /plans
 */
export const create = asyncErrorHandler(async (req, res) => {
  const {
    companyName,
    jobLink,
    email,
    details,
    package: pkg,
    location,
    visaSupport,
    priority,
    techStack,
    winningMove,
    theHook,
  } = req.body;

  if (isNull(companyName)) throw new Error("Company name is required", 400);

  const data = await models.Plan.create({
    companyName,
    jobLink,
    email,
    package: pkg,
    location,
    visaSupport,
    priority,
    techStack,
    winningMove,
    theHook,
    details,
    user: req.user._id,
  });

  return new Response("Plan created successfully", data, 201);
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

  return new Response("Plan updated successfully", updated, 200);
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
