import { sendMailService } from "../services/mail.service.js";
import models from "../model/index.js";
import { markdownToHtml } from "../utils/email.js";

export const sendMail = asyncErrorHandler(async (req, res) => {
  const { to, subject, body, company, role } = req.body;

  if (isNull(to)) throw new Error("Recipient email required", 400);

  const userProfile = await models.User.findById(req.user._id, {
    resumeLink: 1,
    resumeName: 1,
  });

  await sendMailService({
    to,
    subject,
    text: body,
    html: markdownToHtml(body),
    user: req.user._id,
    company,
    role,
    resumeLink: userProfile?.resumeLink,
    resumeName: userProfile?.resumeName,
  });

  return new Response("Mail sent successfully", null, 200);
});
