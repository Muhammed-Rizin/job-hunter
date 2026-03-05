import { transporter } from "../utils/mailer.js";
import models from "../model/index.js";
import { fetchResumeBuffer } from "../utils/resume.js";
import { MAIL_USER } from "../config/index.js";

const normalizeRecipientEmail = (email = "") => String(email).trim().toLowerCase();
const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Send mail with optional resume attachment
 */
export const sendMailService = async ({
  to,
  subject,
  text,
  html,
  user,
  company,
  role,
  resumeLink,
  resumeName,
  source = "mail",
  notes = "",
  appliedDate = null,
  logApplication = true,
}) => {
  const normalizedTo = normalizeRecipientEmail(to);

  if (!normalizedTo) throw new Error("Recipient email is required", 400);
  if (!subject) throw new Error("Mail subject is required", 400);
  if (!text && !html) throw new Error("Mail content is required", 400);

  if (user) {
    const duplicate = await models.Application.findOne({
      user,
      "mail.to": { $regex: new RegExp(`^${escapeRegex(normalizedTo)}$`, "i") },
    }).select("_id mail.to");

    if (duplicate) {
      throw new Error(`Email already contacted: ${normalizedTo}`, 409);
    }
  }

  const attachments = [];

  if (resumeLink) {
    const resume = await fetchResumeBuffer(resumeLink, resumeName);
    attachments.push({
      filename: resume?.filename || "Resume.pdf",
      content: resume?.buffer,
    });
  }

  console.log(`Attempting to send mail to ${normalizedTo}...`);

  const mailOptions = {
    from: `"${company || "Job Application"}" <${MAIL_USER}>`,
    to: normalizedTo,
    subject,
    text: text || "Please open this mail in an HTML-compatible client.",
    html,
    attachments: attachments.map((att) => ({
      filename: att.filename,
      content: att.buffer || att.content,
      contentType: "application/pdf",
    })),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Mail sent. Message ID: ${info.messageId}`);

  if (logApplication && user) {
    await models.Application.create({
      company: company || "",
      role: role || "",
      source: source || "mail",
      appliedDate:
        appliedDate || new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }),
      notes: notes || "",
      mail: {
        to: normalizedTo,
        subject,
        body: html || text,
        hasAttachment: attachments.length > 0,
        sent: true,
        messageId: info.messageId,
      },
      user,
    });
  }

  return {
    messageId: info.messageId,
    accepted: info.accepted,
    hasAttachment: attachments.length > 0,
  };
};

/**
 * Marks a plan as applied and logs the messageId.
 */
export const markPlanAsApplied = async (planId, messageId) => {
  await models.Plan.findByIdAndUpdate(planId, {
    status: "applied",
    "mail.sent": true,
    "mail.messageId": messageId,
    "details.messageId": messageId,
  });
};
