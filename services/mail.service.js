import { transporter } from "../utils/mailer.js";
import models from "../model/index.js";
import { fetchResumeBuffer } from "../utils/resume.js";

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
  logApplication = true,
}) => {
  if (isNull(to)) throw new Error("Recipient email is required", 400);
  if (isNull(subject)) throw new Error("Mail subject is required", 400);
  if (isNull(text) && isNull(html)) throw new Error("Mail content is required", 400);

  const attachments = [];

  /**
   * 🔗 Attach resume from URL
   */
  if (!isNull(resumeLink)) {
    const resume = await fetchResumeBuffer(resumeLink, resumeName);
    attachments.push({
      filename: resume?.filename || "Resume.pdf",
      content: resume?.buffer,
    });
  }


  // 1️⃣ Send mail
  const info = await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
    attachments,
  });

  // 2️⃣ Log as application
  if (logApplication && user) {
    await models.Application.create({
      company: company || "",
      role: role || "",
      source: "mail",
      appliedDate: moment().format("YYYY-MM-DD"),
      mail: {
        to,
        subject,
        body: text || html,
        hasAttachment: attachments.length > 0,
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
