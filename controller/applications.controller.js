import models from "../model/index.js";

export const list = asyncErrorHandler(async (req, res) => {
  const data = await models.Application.find({
    user: req.user._id,
    statusFlag: 0,
  }).sort({ createdAt: -1 });

  return new Response("Applications fetched", { data }, 200);
});

export const create = asyncErrorHandler(async (req, res) => {
  const data = await models
    .Application({
      ...req.body,
      user: req.user._id,
    })
    .save();

  return new Response("Application created", data, 201);
});

export const updateStatus = asyncErrorHandler(async (req, res) => {
  const { id, status } = req.body;

  if (isNull(id)) throw new Error("ID required", 400);

  const updated = await models.Application.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { status },
  );

  if (!updated) throw new Error("Application not found", 404);

  return new Response("Status updated", null, 200);
});

export const del = asyncErrorHandler(async (req, res) => {
  const deleted = await models.Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { statusFlag: 1 },
  );

  if (!deleted) throw new Error("Application not found", 404);

  return new Response("Deleted", null, 200);
});
