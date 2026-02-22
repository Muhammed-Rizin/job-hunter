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

// import { transporter } from "../utils/mailer.js";
// import models from "../model/index.js";

// export const sendMail = asyncErrorHandler(async (req, res) => {
//   const { to, subject, body, company, role } = req.body;

//   if (isNull(to)) throw new Error("Recipient email required", 400);

//   await transporter.sendMail({
//     from: `"Job Apply" <${process.env.MAIL_USER}>`,
//     to,
//     subject,
//     text: body,
//   });

//   // log application automatically
//   await models.Application.create({
//     company,
//     role,
//     source: "mail",
//     mail: { to, subject, body },
//     appliedDate: moment().format("YYYY-MM-DD"),
//     user: req.user._id,
//   });

//   return new Response("Mail sent & logged", null, 200);
// });
