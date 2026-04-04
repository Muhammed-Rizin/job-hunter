import models from "../model/index.js";
import { sendMailService, markPlanAsApplied } from "../services/mail.service.js";
import { markdownToHtml } from "../utils/email.js";

export const list = asyncErrorHandler(async (req, res) => {
  const { search, status, source, sort = "newest", page = 1, limit = 20 } = req.query;

  const filter = {
    user: req.user._id,
    statusFlag: 0,
  };

  // If status is provided, use it.
  if (!isNull(status) && status !== "all") {
    filter.status = status;
  }

  if (!isNull(source) && source !== "all") filter.source = source;

  if (!isNull(search)) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ company: regex }, { role: regex }];
  }

  const resolvedLimit = Math.min(Number(limit) || 20, 100);
  const resolvedPage = Math.max(Number(page) || 1, 1);
  const skip = (resolvedPage - 1) * resolvedLimit;

  const sortField = sort === "oldest" ? 1 : -1;

  const [data, total] = await Promise.all([
    models.Application.find(filter)
      .sort({ appliedDate: sortField, createdAt: sortField })
      .skip(skip)
      .limit(resolvedLimit),
    models.Application.countDocuments(filter),
  ]);

  const pages = Math.ceil(total / resolvedLimit) || 1;

  return new Response(
    "Applications fetched",
    {
      applications: data,
      meta: {
        total,
        page: resolvedPage,
        limit: resolvedLimit,
        pages,
      },
    },
    200,
  );
});

export const create = asyncErrorHandler(async (req, res) => {
  const data = await models
    .Application({
      ...req.body,
      user: req.user._id,
    })
    .save();

  return new Response("Application created", null, 201);
});

export const updateStatus = asyncErrorHandler(async (req, res) => {
  const { id, status, statusDetails } = req.body;

  if (isNull(id)) throw new Error("ID required", 400);
  if (isNull(status)) throw new Error("Status required", 400);

  const application = await models.Application.findOne({ _id: id, user: req.user._id });

  if (!application) throw new Error("Application not found", 404);

  const previousStatus = application.status;
  application.status = status;

  if (statusDetails) {
    application.statusDetails = statusDetails;
  }

  if (!Array.isArray(application.statusHistory) || application.statusHistory.length === 0) {
    application.statusHistory = [
      {
        fromStatus: null,
        toStatus: previousStatus,
        statusDetails: application.statusDetails || {},
        changedAt: application.createdAt || new Date(),
        changedBy: req.user._id,
      },
    ];
  }

  application.statusHistory.push({
    fromStatus: previousStatus,
    toStatus: application.status,
    statusDetails: application.statusDetails || {},
    changedAt: new Date(),
    changedBy: req.user._id,
  });

  await application.save();

  return new Response("Status updated", { data: application }, 200);
});

export const del = asyncErrorHandler(async (req, res) => {
  const deleted = await models.Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { statusFlag: 1 },
  );

  if (!deleted) throw new Error("Application not found", 404);

  return new Response("Deleted", null, 200);
});

export const listBounced = asyncErrorHandler(async (req, res) => {
  const data = await models.Application.find({
    user: req.user._id,
    status: "bounced",
    statusFlag: 0,
  }).sort({ createdAt: -1 });

  return new Response("Bounced applications fetched", { data }, 200);
});

import { submitApplication } from "../services/application.service.js";

/** ... other methods ... **/

export const manual = asyncErrorHandler(async (req, res) => {
  const { to, subject, body, company, role, source, notes, appliedDate, planId } = req.body;

  const result = await submitApplication(req.user, {
    to,
    subject,
    body,
    company,
    role,
    source,
    notes,
    appliedDate,
    planId,
  });

  return new Response("Application manually entered & mail sent", { result }, 200);
});
