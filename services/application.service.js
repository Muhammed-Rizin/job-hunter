import fs from "fs";
import path from "path";
import models from "../model/index.js";
import { sendMailService, markPlanAsApplied } from "./mail.service.js";
import { markdownToHtml } from "../helper/email.js";

import { fetchResumeBuffer } from "../utils/resume.js";

/**
 * @desc    Generate a tailored cover letter from Markdown template
 */
export const generateLetter = async (plan, { customBody, customHook, customPitch } = {}) => {
  const templatePath = path.resolve(process.cwd(), "STANDARD_COVER_LETTER.md");
  if (!fs.existsSync(templatePath)) {
    throw new Error("Cover letter template (STANDARD_COVER_LETTER.md) not found", 404);
  }

  let body = fs.readFileSync(templatePath, "utf8");
  const company = plan?.companyName || "Company";
  const role = plan?.roleTitle || plan?.techStack || "Developer";

  // Content Variation (Anti-Spam)
  const greetings = [
    "Dear Hiring Manager,",
    "To the Hiring Team at {{company}},",
    "Greetings,",
    "Hello Hiring Team,",
  ];
  const signoffs = [
    "Best regards,",
    "Sincerely,",
    "Kind regards,",
    "Looking forward to connecting,",
  ];

  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  const signoff = signoffs[Math.floor(Math.random() * signoffs.length)];

  body = body.replace(/Dear Hiring Manager,/g, greeting).replace(/Best regards,/g, signoff);

  body = body
    .replace(/{{company}}/g, company)
    .replace(/{{role}}/g, role)
    .replace(/{{theHook}}/g, "") // Clear the placeholder to avoid double injection
    .replace(/{{customPitch}}/g, customPitch || plan?.customPitch || "");

  const pitch = customPitch || customHook || plan?.customPitch || plan?.theHook;
  const pitchMarker = "**Key Highlights of my Experience:**";
  const markerRegex = new RegExp(`${pitchMarker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "i");

  if (pitch && markerRegex.test(body)) {
    const customizedSection = `**Why I am a Great Fit for ${company}:**\n${pitch}\n\n${pitchMarker}`;
    body = body.replace(markerRegex, customizedSection + "\n");
  }

  // File logging
  const safeCompany = company.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  const timestamp = Date.now();
  const filename = `${safeCompany}_${timestamp}.md`;
  const appDir = path.resolve(process.cwd(), "applications");

  if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });
  const fullPath = path.join(appDir, filename);
  fs.writeFileSync(fullPath, body, "utf8");

  return { body: customBody || body, filename, path: fullPath };
};

const isNull = (val) => val === undefined || val === null || val === "";

/**
 * @desc    Check for duplicate applications by email
 */
export const checkDuplicateApplication = async (userId, toEmail) => {
  if (isNull(toEmail)) return null;
  return await models.Application.findOne({
    user: userId,
    statusFlag: 0,
    "mail.to": { $regex: new RegExp(`^${toEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  });
};

/**
 * @desc    Submit a job application via SMTP
 */
export const submitApplication = async (
  user,
  { planId, to, subject, body, role, company, source, notes, appliedDate, letterFile },
) => {
  const userId = user._id;
  const emailTo = String(to || "")
    .trim()
    .toLowerCase();

  if (isNull(emailTo)) throw new Error("Recipient email is required", 400);

  const duplicateEmail = await checkDuplicateApplication(userId, emailTo);
  if (duplicateEmail) {
    throw new Error(`Already applied to email: ${emailTo}`, 409);
  }

  // Double Wall: Check if company already has an application
  if (company) {
    const duplicateCompany = await models.Application.findOne({
      user: userId,
      statusFlag: 0,
      company: { $regex: new RegExp(`^${company.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });
    if (duplicateCompany) {
      throw new Error(`Already applied to company: ${company}`, 409);
    }
  }

  const result = await sendMailService({
    to: emailTo,
    subject,
    html: markdownToHtml(body),
    user: userId,
    company,
    role,
    source,
    notes,
    appliedDate,
    letterFile,
    resumeLink: user.resumeLink,
    resumeName: user.resumeName,
  });

  if (planId) {
    await markPlanAsApplied(planId, result.messageId);
  }

  return result;
};
