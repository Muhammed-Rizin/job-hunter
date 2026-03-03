import "dotenv/config";
import "../helper/global.js";
import connectDB from "../database/index.js";
import models from "../model/index.js";
import { sendMailService } from "../services/mail.service.js";
import { markdownToHtml } from "../utils/email.js";
import fs from "fs";

const run = async () => {
  try {
    await connectDB();
    const user = await models.User.findOne({ email: "rizin7427@gmail.com" });
    const remoteLeads = JSON.parse(fs.readFileSync("scripts/remote-only-batch.json", "utf8"));

    console.log(`🚀 Starting DIRECT apply for ${remoteLeads.length} Remote Companies...`);

    for (const lead of remoteLeads) {
      const hook = lead.theHook || "I am impressed by your company's growth.";
      const winningMove = lead.winningMove || "I bring strong full-stack skills.";
      const role = lead.role || "Full Stack Developer";

      const body = `Dear Hiring Team,

I am writing to express my strong interest in the **${role}** position at **${lead.companyName}**. ${hook}

With over **2 years of experience** as a Project Lead and Full Stack Developer, I have a proven track record of building high-scale, state-level digital platforms in Kerala, including the **KSEB PM E-DRIVE** and **ASAP Career Link** systems.

**Why I am a strong fit for ${lead.companyName}:**
* **${winningMove}**
* **Framework Versatility**: Highly proficient in **React** and **Angular** (NgRx).
* **Scalable Backend**: Specialized in **Node.js** and **MongoDB**, handling financial modules with **70M+ in transactions**.
* **AI-Native Workflow**: I leverage **OpenClaw**, **Antigravity**, and **Codex** daily to maintain high code quality and velocity.

I am eager to bring my technical expertise and leadership experience to your team.

Please find my resume attached for your review.

Best regards,

Muhammed Rizin
rizin7427@gmail.com
+91 8156886609
LinkedIn: https://linkedin.com/in/muhammed-rizin
Portfolio: https://muhammedrizin.in
GitHub: https://github.com/Muhammed-Rizin`;

      try {
        console.log(`📧 Applying DIRECTLY to ${lead.companyName} (${lead.email})...`);
        
        await sendMailService({
          to: lead.email,
          subject: `Application for ${role} - Muhammed Rizin`,
          text: body,
          html: markdownToHtml(body),
          user: user._id,
          company: lead.companyName,
          role: role,
          source: "mail",
          notes: `Direct Remote Apply - Winning Move: ${winningMove}`,
          resumeLink: user.resumeLink,
          resumeName: user.resumeName
        });

        console.log(`✅ SENT: ${lead.companyName}`);

      } catch (err) {
        console.error(`❌ FAILED: ${lead.companyName} - ${err.message}`);
      }
      
      // Safety delay
      await new Promise(r => setTimeout(r, 4000));
    }

    console.log("\n🏁 Direct remote batch completed.");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
