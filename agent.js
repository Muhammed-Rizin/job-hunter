import "dotenv/config";
import "./helper/global.js";
import connectDB from "./database/index.js";
import models from "./model/index.js";
import { sendMailService, markPlanAsApplied } from "./services/mail.service.js";
import { markdownToHtml } from "./utils/email.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";

const DEFAULT_USER_EMAIL = "rizin7427@gmail.com";
const DEFAULT_COVER_LETTER_FILE = "STANDARD_COVER_LETTER.md";

const ALLOWED_SOURCES = new Set(["mail", "linkedin", "indeed", "naukri", "website"]);
const ALLOWED_APP_STATUSES = new Set([
  "applied",
  "hr_contact",
  "interview",
  "technical",
  "offer",
  "rejected",
  "bounced",
]);

const PRIORITY_WEIGHT = { High: 1, Medium: 2, Low: 3 };

const log = {
  info: (m) => console.log(chalk.blue("[INFO] ") + m),
  success: (m) => console.log(chalk.green("[OK] ") + m),
  error: (m) => console.log(chalk.red("[ERROR] ") + m),
  warn: (m) => console.log(chalk.yellow("[WARN] ") + m),
};

const getCurrentLocalDate = () => {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
};

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();
const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasFlag = (args, flag) => args.includes(flag);

const getArgValue = (args, flag) => {
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
};

const parseJsonFlag = (args, flag, fallback = null) => {
  const value = getArgValue(args, flag);
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`Invalid JSON for ${flag}`);
  }
};

const toSafeSource = (source) => {
  const normalized = String(source || "").trim().toLowerCase();
  return ALLOWED_SOURCES.has(normalized) ? normalized : "mail";
};

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const buildEmailRegexMatch = (email) => {
  const normalized = normalizeEmail(email);
  return { $regex: new RegExp(`^${escapeRegex(normalized)}$`, "i") };
};

const coverLetterPath = () => path.join(process.cwd(), DEFAULT_COVER_LETTER_FILE);

const loadCoverLetterTemplate = () => {
  const file = coverLetterPath();
  if (!fs.existsSync(file)) {
    throw new Error(`Cover letter template not found: ${DEFAULT_COVER_LETTER_FILE}`);
  }
  return fs.readFileSync(file, "utf8");
};

const renderDefaultCoverLetter = ({ company, role }) => {
  const template = loadCoverLetterTemplate();
  return template.replace(/{{company}}/g, company || "Company").replace(/{{role}}/g, role || "Developer");
};

const resolveAgentUser = async (args) => {
  const email = normalizeEmail(getArgValue(args, "--user-email") || DEFAULT_USER_EMAIL);
  const user = await models.User.findOne({ email, status: 0 });
  if (!user) throw new Error(`User not found for email: ${email}`);
  return user;
};

const findDuplicateByRecipient = async ({ userId, to }) => {
  const normalizedTo = normalizeEmail(to);
  if (!normalizedTo) return null;
  return models.Application.findOne({
    user: userId,
    "mail.to": buildEmailRegexMatch(normalizedTo),
  }).select("_id company role mail.to");
};

const validateApplicationStatus = (status) => {
  if (!ALLOWED_APP_STATUSES.has(status)) {
    throw new Error(`Invalid status '${status}'. Allowed: ${Array.from(ALLOWED_APP_STATUSES).join(", ")}`);
  }
};

const printUsage = () => {
  console.log(`
${chalk.bold("Job Hunter Unified Agent CLI")}

Usage:
  node agent.js <command> [options]

Commands:
  ${chalk.cyan("plan")}         Lead planning actions
    --add --json '{...}'
    --bulk --json '[{...}, {...}]'
    --update <planId> --json '{...}'
    --list [--status pending|applied|bounced|all] [--limit 20]

  ${chalk.cyan("apply")}        Send job applications
    --plan <planId> [--json '{...}']
    --json '{...}'
    --pending [--limit 5] [--json '{...}']           # preview queue only
    --pending --limit 5 --proceed [--json '{...}']   # actually send

  ${chalk.cyan("application")}  Application records and status updates
    --list [--status ...] [--limit 20]
    --create --json '{...}'
    --update <applicationId> --json '{"status":"interview","statusDetails":{...}}'
    --update-by-email <email> --json '{...}'
    --delete <applicationId>

  ${chalk.cyan("sync")}         Sync helpers
    --bounced --email <email>
    --plans

  ${chalk.cyan("cleanup")}      Data cleanup helpers
    --duplicates

Global:
  --user-email <email>    # defaults to ${DEFAULT_USER_EMAIL}
  --help
`);
};

const normalizePlanPayload = (raw = {}) => {
  const companyName = String(raw.companyName || "").trim();
  if (!companyName) throw new Error("companyName is required");

  const priority = ["High", "Medium", "Low"].includes(raw.priority) ? raw.priority : "Medium";
  const status = ["pending", "applied", "bounced"].includes(raw.status) ? raw.status : "pending";

  return {
    companyName,
    jobLink: String(raw.jobLink || "").trim(),
    email: normalizeEmail(raw.email || ""),
    package: String(raw.package || "").trim(),
    location: String(raw.location || "").trim(),
    visaSupport: Boolean(raw.visaSupport),
    priority,
    techStack: String(raw.techStack || "").trim(),
    winningMove: String(raw.winningMove || "").trim(),
    theHook: String(raw.theHook || "").trim(),
    portalType: String(raw.portalType || "").trim(),
    customPitch: String(raw.customPitch || "").trim(),
    details: raw.details && typeof raw.details === "object" ? raw.details : {},
    status,
  };
};

const addPlan = async ({ user, payload }) => {
  const normalized = normalizePlanPayload(payload);

  const duplicate = await models.Plan.findOne({
    user: user._id,
    statusFlag: 0,
    companyName: { $regex: new RegExp(`^${escapeRegex(normalized.companyName)}$`, "i") },
  });

  if (duplicate) {
    return { skipped: true, reason: `Duplicate company in planning: ${normalized.companyName}` };
  }

  const created = await models.Plan.create({ ...normalized, user: user._id });
  return { skipped: false, created };
};

const listPlans = async ({ user, status = "all", limit = 20 }) => {
  const query = { user: user._id, statusFlag: 0 };
  if (status && status !== "all") query.status = status;

  const plans = await models.Plan.find(query).sort({ createdAt: -1 }).limit(Math.max(1, Math.min(limit, 200)));

  if (plans.length === 0) {
    log.warn("No plans found.");
    return;
  }

  plans.forEach((plan, idx) => {
    log.info(`${idx + 1}. ${plan.companyName} | ${plan.status} | ${plan.priority} | ${plan.email || "no-email"} | ${plan._id}`);
  });
};

const buildApplyPayload = ({ plan, custom = {} }) => {
  const role = String(custom.role || plan?.techStack || "Developer").trim() || "Developer";
  const company = String(custom.company || plan?.companyName || "").trim();
  const to = normalizeEmail(custom.to || plan?.email || "");
  const subject = custom.subject || `Application for ${role} role - Muhammed Rizin`;
  const body = custom.body || renderDefaultCoverLetter({ company, role });

  return {
    to,
    company,
    role,
    subject,
    body,
    source: toSafeSource(custom.source || "mail"),
    notes: String(custom.notes || "").trim(),
    appliedDate: custom.appliedDate || getCurrentLocalDate(),
    planId: custom.planId || plan?._id || null,
  };
};

const sendApplication = async ({ user, payload, dryRun = false }) => {
  if (!payload.to) throw new Error("Recipient email is required");
  if (!payload.company) throw new Error("Company is required");

  const duplicate = await findDuplicateByRecipient({ userId: user._id, to: payload.to });
  if (duplicate) {
    return {
      sent: false,
      skipped: true,
      reason: `Blocked duplicate recipient: ${normalizeEmail(payload.to)}`,
    };
  }

  if (dryRun) {
    return {
      sent: false,
      skipped: false,
      dryRun: true,
      preview: {
        to: payload.to,
        company: payload.company,
        role: payload.role,
        subject: payload.subject,
      },
    };
  }

  const result = await sendMailService({
    to: payload.to,
    subject: payload.subject,
    text: payload.body,
    html: markdownToHtml(payload.body),
    user: user._id,
    company: payload.company,
    role: payload.role,
    source: payload.source,
    notes: payload.notes,
    appliedDate: payload.appliedDate,
    resumeLink: user.resumeLink,
    resumeName: user.resumeName,
  });

  if (payload.planId) {
    await markPlanAsApplied(payload.planId, result.messageId);
  }

  return {
    sent: true,
    skipped: false,
    messageId: result.messageId,
    to: payload.to,
    company: payload.company,
  };
};

const processPendingPlans = async ({ args, user }) => {
  const limit = Math.max(1, Math.min(toNumber(getArgValue(args, "--limit"), 5), 50));
  const proceed = hasFlag(args, "--proceed");
  const custom = parseJsonFlag(args, "--json", {});

  const pendingPlans = await models.Plan.find({
    user: user._id,
    statusFlag: 0,
    status: "pending",
    email: { $nin: [null, "", "null"] },
  });

  const ordered = pendingPlans
    .slice()
    .sort((a, b) => {
      const priorityDiff = (PRIORITY_WEIGHT[a.priority] || 99) - (PRIORITY_WEIGHT[b.priority] || 99);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    .slice(0, limit);

  if (ordered.length === 0) {
    log.warn("No pending plans with email found.");
    return;
  }

  if (!proceed) {
    log.info("Approval gate: preview mode. Use --proceed to actually send.");
    for (const plan of ordered) {
      const payload = buildApplyPayload({ plan, custom });
      log.info(`Preview | ${plan._id} | ${payload.company} | ${payload.to} | ${payload.role}`);
    }
    return;
  }

  let sent = 0;
  let skipped = 0;

  for (const plan of ordered) {
    const payload = buildApplyPayload({ plan, custom });
    const result = await sendApplication({ user, payload, dryRun: false });

    if (result.sent) {
      sent += 1;
      log.success(`Sent | ${result.company} | ${result.to} | ${result.messageId}`);
    } else {
      skipped += 1;
      log.warn(`Skipped | ${plan.companyName} | ${result.reason}`);
    }
  }

  log.success(`Batch apply completed. Sent: ${sent}, Skipped: ${skipped}`);
};

const handlePlanCommand = async ({ args, user }) => {
  if (hasFlag(args, "--add")) {
    const payload = parseJsonFlag(args, "--json");
    if (!payload || Array.isArray(payload)) throw new Error("--add expects a JSON object");

    const result = await addPlan({ user, payload });
    if (result.skipped) {
      log.warn(result.reason);
    } else {
      log.success(`Lead added: ${result.created.companyName} (${result.created._id})`);
    }
    return;
  }

  if (hasFlag(args, "--bulk")) {
    const payload = parseJsonFlag(args, "--json");
    if (!Array.isArray(payload) || payload.length === 0) {
      throw new Error("--bulk expects a non-empty JSON array");
    }

    let created = 0;
    let skipped = 0;

    for (const item of payload) {
      try {
        const result = await addPlan({ user, payload: item });
        if (result.skipped) {
          skipped += 1;
          log.warn(result.reason);
        } else {
          created += 1;
          log.success(`Lead added: ${result.created.companyName}`);
        }
      } catch (error) {
        skipped += 1;
        log.warn(`Skipped entry: ${error.message}`);
      }
    }

    log.success(`Bulk planning complete. Added: ${created}, Skipped: ${skipped}`);
    return;
  }

  if (hasFlag(args, "--update")) {
    const id = getArgValue(args, "--update");
    const payload = parseJsonFlag(args, "--json");
    if (!id) throw new Error("--update requires a plan id");
    if (!payload || Array.isArray(payload)) throw new Error("--update expects a JSON object");

    const updated = await models.Plan.findOneAndUpdate(
      { _id: id, user: user._id, statusFlag: 0 },
      payload,
      { new: true },
    );

    if (!updated) throw new Error("Plan not found");
    log.success(`Plan updated: ${updated.companyName} (${updated._id})`);
    return;
  }

  if (hasFlag(args, "--list")) {
    const status = getArgValue(args, "--status") || "all";
    const limit = toNumber(getArgValue(args, "--limit"), 20);
    await listPlans({ user, status, limit });
    return;
  }

  throw new Error("Unknown plan action. Use --add, --bulk, --update, or --list");
};

const handleApplyCommand = async ({ args, user }) => {
  if (hasFlag(args, "--pending")) {
    await processPendingPlans({ args, user });
    return;
  }

  const planId = getArgValue(args, "--plan");
  const custom = parseJsonFlag(args, "--json", {});
  const dryRun = hasFlag(args, "--dry-run");

  let plan = null;
  if (planId) {
    plan = await models.Plan.findOne({ _id: planId, user: user._id, statusFlag: 0 });
    if (!plan) throw new Error("Plan not found");

    if (plan.status === "applied") {
      log.warn(`Plan already marked as applied: ${plan.companyName}`);
      return;
    }
  }

  const payload = buildApplyPayload({ plan, custom });
  const result = await sendApplication({ user, payload, dryRun });

  if (result.sent) {
    log.success(`Application sent: ${result.company} -> ${result.to} | ${result.messageId}`);
    return;
  }

  if (result.dryRun) {
    log.info(`Dry run preview: ${result.preview.company} -> ${result.preview.to} | ${result.preview.subject}`);
    return;
  }

  if (result.skipped) {
    log.warn(result.reason);
  }
};

const buildAppUpdatePayload = (payload = {}) => {
  const update = {};

  if (Object.prototype.hasOwnProperty.call(payload, "status")) {
    const status = String(payload.status || "").trim();
    validateApplicationStatus(status);
    update.status = status;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "statusDetails")) {
    update.statusDetails = payload.statusDetails || {};
  }

  if (Object.prototype.hasOwnProperty.call(payload, "notes")) {
    update.notes = String(payload.notes || "").trim();
  }

  if (Object.keys(update).length === 0) {
    throw new Error("No valid fields to update. Use status, statusDetails, or notes");
  }

  return update;
};

const handleApplicationCommand = async ({ args, user }) => {
  if (hasFlag(args, "--list")) {
    const status = getArgValue(args, "--status");
    const limit = Math.max(1, Math.min(toNumber(getArgValue(args, "--limit"), 20), 200));
    const query = { user: user._id, statusFlag: 0 };
    if (status) query.status = status;

    const apps = await models.Application.find(query).sort({ createdAt: -1 }).limit(limit);
    if (apps.length === 0) {
      log.warn("No applications found.");
      return;
    }

    apps.forEach((app, idx) => {
      log.info(`${idx + 1}. ${app.company} | ${app.role} | ${app.status} | ${app.mail?.to || "-"} | ${app._id}`);
    });
    return;
  }

  if (hasFlag(args, "--create")) {
    const payload = parseJsonFlag(args, "--json");
    if (!payload || Array.isArray(payload)) throw new Error("--create expects a JSON object");

    const status = String(payload.status || "applied").trim();
    validateApplicationStatus(status);

    const created = await models.Application.create({
      company: String(payload.company || "").trim(),
      role: String(payload.role || "").trim(),
      status,
      source: toSafeSource(payload.source || "website"),
      appliedDate: payload.appliedDate || getCurrentLocalDate(),
      notes: String(payload.notes || "").trim(),
      mail: payload.mail && typeof payload.mail === "object" ? payload.mail : {},
      statusDetails: payload.statusDetails && typeof payload.statusDetails === "object" ? payload.statusDetails : {},
      user: user._id,
    });

    log.success(`Application created: ${created.company} (${created._id})`);
    return;
  }

  if (hasFlag(args, "--update")) {
    const id = getArgValue(args, "--update");
    const payload = parseJsonFlag(args, "--json");
    if (!id) throw new Error("--update requires an application id");
    if (!payload || Array.isArray(payload)) throw new Error("--update expects a JSON object");

    const updatePayload = buildAppUpdatePayload(payload);

    const updated = await models.Application.findOneAndUpdate(
      { _id: id, user: user._id },
      updatePayload,
      { new: true },
    );

    if (!updated) throw new Error("Application not found");

    log.success(`Application updated: ${updated.company} (${updated._id}) -> ${updated.status}`);
    return;
  }

  if (hasFlag(args, "--update-by-email")) {
    const email = normalizeEmail(getArgValue(args, "--update-by-email"));
    const payload = parseJsonFlag(args, "--json");
    if (!email) throw new Error("--update-by-email requires an email");
    if (!payload || Array.isArray(payload)) throw new Error("--update-by-email expects a JSON object");

    const updatePayload = buildAppUpdatePayload(payload);
    const result = await models.Application.updateMany(
      { user: user._id, "mail.to": buildEmailRegexMatch(email) },
      updatePayload,
    );

    if (updatePayload.status === "bounced") {
      await models.Plan.updateMany(
        { user: user._id, email: buildEmailRegexMatch(email), statusFlag: 0 },
        { status: "bounced" },
      );
    }

    log.success(`Applications updated by email (${email}). Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    return;
  }

  if (hasFlag(args, "--delete")) {
    const id = getArgValue(args, "--delete");
    if (!id) throw new Error("--delete requires an application id");

    const deleted = await models.Application.findOneAndUpdate(
      { _id: id, user: user._id, statusFlag: 0 },
      { statusFlag: 1 },
      { new: true },
    );

    if (!deleted) throw new Error("Application not found");
    log.success(`Application soft-deleted: ${deleted.company} (${deleted._id})`);
    return;
  }

  throw new Error(
    "Unknown application action. Use --list, --create, --update, --update-by-email, or --delete",
  );
};

const handleSyncCommand = async ({ args, user }) => {
  if (hasFlag(args, "--bounced")) {
    const email = normalizeEmail(getArgValue(args, "--email"));
    if (!email) throw new Error("--bounced requires --email");

    const emailMatch = buildEmailRegexMatch(email);
    const [appsResult, plansResult] = await Promise.all([
      models.Application.updateMany(
        { user: user._id, "mail.to": emailMatch },
        { status: "bounced" },
      ),
      models.Plan.updateMany(
        { user: user._id, email: emailMatch, statusFlag: 0 },
        { status: "bounced" },
      ),
    ]);

    log.success(
      `Bounce synced for ${email}. Applications: ${appsResult.modifiedCount}, Plans: ${plansResult.modifiedCount}`,
    );
    return;
  }

  if (hasFlag(args, "--plans")) {
    log.info("Syncing pending plans with existing application history...");
    const pendingPlans = await models.Plan.find({ user: user._id, status: "pending", statusFlag: 0 });

    let synced = 0;
    for (const plan of pendingPlans) {
      const hasApp = await models.Application.findOne({
        user: user._id,
        company: { $regex: new RegExp(`^${escapeRegex(plan.companyName)}$`, "i") },
        statusFlag: 0,
      });

      if (hasApp) {
        await models.Plan.findByIdAndUpdate(plan._id, {
          status: "applied",
          "mail.sent": true,
          "mail.messageId": hasApp.mail?.messageId || "legacy-sync",
        });
        synced += 1;
        log.info(`Synced plan: ${plan.companyName} -> applied`);
      }
    }

    log.success(`Plan sync complete. Updated: ${synced}`);
    return;
  }

  throw new Error("Unknown sync action. Use --bounced or --plans");
};

const handleCleanupCommand = async ({ args, user }) => {
  if (!hasFlag(args, "--duplicates")) {
    throw new Error("Unknown cleanup action. Use --duplicates");
  }

  log.info("Scanning for duplicate applications by company/role/source...");
  const apps = await models.Application.find({ user: user._id, statusFlag: 0 }).sort({ createdAt: -1 });

  const seen = new Set();
  const toDelete = [];

  for (const app of apps) {
    const key = `${app.company || ""}_${app.role || ""}_${app.source || ""}`.trim().toLowerCase();
    if (seen.has(key)) {
      toDelete.push(app._id);
    } else {
      seen.add(key);
    }
  }

  if (toDelete.length === 0) {
    log.info("No duplicates found.");
    return;
  }

  await models.Application.updateMany({ _id: { $in: toDelete } }, { statusFlag: 1 });
  log.success(`Soft-deleted duplicates: ${toDelete.length}`);
};

const run = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || hasFlag(args, "--help") || hasFlag(args, "-h")) {
    printUsage();
    process.exit(0);
  }

  try {
    await connectDB();
    const user = await resolveAgentUser(args);

    if (command === "plan") {
      await handlePlanCommand({ args, user });
    } else if (command === "apply") {
      await handleApplyCommand({ args, user });
    } else if (command === "application") {
      await handleApplicationCommand({ args, user });
    } else if (command === "sync") {
      await handleSyncCommand({ args, user });
    } else if (command === "cleanup") {
      await handleCleanupCommand({ args, user });
    } else {
      throw new Error(`Unknown command: ${command}`);
    }

    process.exit(0);
  } catch (error) {
    log.error(error.message || "Unknown error");
    process.exit(1);
  }
};

run();
