import { transporter } from "../utils/mailer.js";
import models from "../model/index.js";
import { fetchResumeBuffer } from "../utils/resume.js";
import { MAIL_USER } from "../config/index.js";

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
  if (!to) throw new Error("Recipient email is required", 400);
  if (!subject) throw new Error("Mail subject is required", 400);
  if (!text && !html) throw new Error("Mail content is required", 400);

  const attachments = [];

  /**
   * 🔗 Attach resume from URL
   */
  if (resumeLink) {
    const resume = await fetchResumeBuffer(resumeLink, resumeName);
    attachments.push({
      filename: resume?.filename || "Resume.pdf",
      content: resume?.buffer,
    });
  }

  // 1️⃣ Send mail
  console.log(`📡 Attempting to send mail to ${to}...`);
  const mailOptions = {
    from: `"${company || "Job Application"}" <${MAIL_USER}>`,
    to,
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
  console.log(`✅ Mail sent! Message ID: ${info.messageId}`);

  // 2️⃣ Log as application
  if (logApplication && user) {
    await models.Application.create({
      company: company || "",
      role: role || "",
      source: source || "mail",
      appliedDate: appliedDate || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }),
      notes: notes || "",
      mail: {
        to,
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
