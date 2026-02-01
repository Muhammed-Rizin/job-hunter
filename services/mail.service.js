import { transporter } from "../utils/mailer.js";
import models from "../model/index.js";
import axios from "axios";

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
    try {
      const response = await axios.get(resumeLink, {
        responseType: "arraybuffer",
      });

      attachments.push({
        filename: resumeName || "Resume.pdf",
        content: Buffer.from(response.data),
      });
    } catch (err) {
      throw new Error("Unable to fetch resume file", 400);
    }
  }

  // 1️⃣ Send mail
  const info = await transporter.sendMail({
    from: `"Job Apply" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html,
    attachments,
  });

  // 2️⃣ Log as application
  if (logApplication && user) {
    await models.Application.create({
      company: company || "Unknown",
      role: role || "Unknown",
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
