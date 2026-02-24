import models from "../model/index.js";
import { sendMailService, markPlanAsApplied } from "../services/mail.service.js";
import { markdownToHtml } from "../utils/email.js";

export const list = asyncErrorHandler(async (req, res) => {
  const {
    search,
    status,
    source,
    sort = "newest",
    page = 1,
    limit = 20,
  } = req.query;

  const filter = {
    user: req.user._id,
    statusFlag: 0,
  };

  // If status is provided, use it. If 'all', explicitly allow all statuses EXCEPT bounced.
  if (!isNull(status) && status !== "all") {
    filter.status = status;
  } else {
    filter.status = { $ne: "bounced" };
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
    models.Application.find(filter).sort({ appliedDate: sortField, createdAt: sortField }).skip(skip).limit(resolvedLimit),
    models.Application.countDocuments(filter),
  ]);

  const pages = Math.ceil(total / resolvedLimit) || 1;

  return new Response("Applications fetched", {
    data,
    meta: {
      total,
      page: resolvedPage,
      limit: resolvedLimit,
      pages,
    },
  }, 200);
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
  const { id, status, statusDetails } = req.body;

  if (isNull(id)) throw new Error("ID required", 400);

  const updatePayload = { status };
  if (statusDetails) {
    updatePayload.statusDetails = statusDetails;
  }

  const updated = await models.Application.findOneAndUpdate(
    { _id: id, user: req.user._id },
    updatePayload,
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

export const listBounced = asyncErrorHandler(async (req, res) => {
  const data = await models.Application.find({
    user: req.user._id,
    status: "bounced",
    statusFlag: 0,
  }).sort({ createdAt: -1 });

  return new Response("Bounced applications fetched", data, 200);
});

export const manual = asyncErrorHandler(async (req, res) => {
  const { to, subject, body, company, role, source, notes, appliedDate, planId } = req.body;

  if (isNull(to)) throw new Error("Recipient email required", 400);
  if (isNull(subject)) throw new Error("Mail subject required", 400);
  if (isNull(body)) throw new Error("Mail body required", 400);

  const userProfile = await models.User.findById(req.user._id, {
    resumeLink: 1,
    resumeName: 1,
  });

  const result = await sendMailService({
    to,
    subject,
    html: markdownToHtml(body),
    user: req.user._id,
    company,
    role,
    source,
    notes,
    appliedDate,
    resumeLink: userProfile?.resumeLink,
    resumeName: userProfile?.resumeName,
  });

  if (planId) {
    await markPlanAsApplied(planId, result.messageId);
  }

  return new Response("Application manually entered & mail sent", null, 200);
});
