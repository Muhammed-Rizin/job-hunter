import models from "../model/index.js";

/**
 * @desc    List all active templates
 * @route   GET /templates
 */
export const list = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await models.Template.find({
    user: userId,
    status: 0,
  }).sort({ createdAt: -1 });

  return new Response("Templates fetched successfully", { data }, 200);
});

/**
 * @desc    Create new template
 * @route   POST /templates
 */
export const create = asyncErrorHandler(async (req, res) => {
  const { name, subject, body } = req.body;

  if (isNull(name)) throw new Error("Template name is required", 400);
  if (isNull(subject)) throw new Error("Subject is required", 400);
  if (isNull(body)) throw new Error("Body is required", 400);

  const data = await models.Template.create({
    name,
    subject,
    body,
    user: req.user._id,
  });

  return new Response("Template created successfully", data, 201);
});

/**
 * @desc    Update template
 * @route   PUT /templates
 */
export const update = asyncErrorHandler(async (req, res) => {
  const { id, name, subject, body } = req.body;
  const userId = req.user._id;

  if (isNull(id)) throw new Error("Template ID is required", 400);
  if (isNull(name)) throw new Error("Template name is required", 400);
  if (isNull(subject)) throw new Error("Subject is required", 400);
  if (isNull(body)) throw new Error("Body is required", 400);

  const updated = await models.Template.findOneAndUpdate(
    { _id: id, user: userId, status: 0 },
    { name, subject, body },
    { new: true },
  );

  if (!updated) throw new Error("Template not found", 404);

  return new Response("Template updated successfully", updated, 200);
});

/**
 * @desc    Delete template (soft delete)
 * @route   DELETE /templates/:id
 */
export const del = asyncErrorHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (isNull(id)) throw new Error("Template ID is required", 400);

  const deleted = await models.Template.findOneAndUpdate(
    { _id: id, user: userId, status: 0 },
    { status: 1 },
  );

  if (!deleted) throw new Error("Template not found", 404);

  return new Response("Template deleted successfully", null, 200);
});
