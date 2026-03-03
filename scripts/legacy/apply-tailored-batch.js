import "dotenv/config";
import "../helper/global.js";
import connectDB from "../database/index.js";
import models from "../model/index.js";
import { sendMailService } from "../services/mail.service.js";
import { markdownToHtml } from "../utils/email.js";

const run = async () => {
  try {
    await connectDB();
    const user = await models.User.findOne({ email: "rizin7427@gmail.com" });

    const leads = [
      {
        company: "Colate",
        email: "connect@colate.io",
        role: "MERN Stack + GenAI Developer",
        pitch: "As an engineer who builds with agentic frameworks like OpenClaw and Antigravity, I was thrilled to see Colate's focus on GenAI datasets. I recently automated my own job-hunting pipeline using custom AI agents, demonstrating my ability to ship high-velocity, production-grade logic."
      },
      {
        company: "SmartXAlgo",
        email: "hr@smartxalgo.com",
        role: "MERN Stack Developer",
        pitch: "I am a performance-obsessed engineer who maintains a strict 5:30 AM logic and DSA grind. My experience leading state-level platforms like the KSEB EV subsidy system has equipped me to handle the high-speed algorithmic challenges at SmartXAlgo."
      },
      {
        company: "PathPresenter",
        email: "hr@pathpresenter.com",
        role: "Full Stack Developer",
        pitch: "With experience building secure document verification and financial modules for Kerala government initiatives, I am well-prepared to contribute to PathPresenter's mission in remote pathology and secure medical data consultation."
      },
      {
        company: "STORYSKIMO",
        email: "jobs@storyskimo.com",
        role: "MERN Stack Developer",
        pitch: "My background in integrating conversational technologies like Twilio IVR and WATI (WhatsApp) APIs aligns perfectly with STORYSKIMO's audio-centric platform for kids. I specialize in building intuitive, interactive web experiences."
      },
      {
        company: "Klima.Metrix",
        email: "jobs@klimametrix.com",
        role: "Full-Stack Engineer (MERN)",
        pitch: "Having led the development of the KSEB PM E-DRIVE (State EV Subsidy platform), I have first-hand experience building technical infrastructure for large-scale sustainability initiatives—matching the core mission of Klima.Metrix."
      },
      {
        company: "DATATRONiQ",
        email: "jobs@datatroniq.com",
        role: "Senior Full Stack Developer",
        pitch: "I specialize in high-volume data workflows and optimized MongoDB architectures. Managing 70M+ in transactions for government portals has given me the technical depth required to handle complex IoT data at DATATRONiQ."
      },
      {
        company: "Climatiq",
        email: "jobs@climatiq.io",
        role: "Fullstack Engineer",
        pitch: "I bring a track record of delivering critical state-level infrastructure, most recently leading the EV platform for Kerala's nodal energy agency. My focus on secure, high-availability APIs is a strong match for Climatiq's intelligence layer."
      },
      {
        company: "Aidar",
        email: "jobs@aidar.com",
        role: "Full-Stack Developer (MERN)",
        pitch: "My experience leading project cycles for government systems (ASAP/KSEB) involved handling sensitive candidate data and secure multi-level approvals—experience that translates directly to the security-first culture at Aidar."
      },
      {
        company: "FarmAct",
        email: "jobs@farmact.io",
        role: "Frontend Engineer (React)",
        pitch: "I excel at building complex operational dashboards and internal management tools. My work on HRMS and state-level subsidy platforms has refined my ability to deliver performant, user-centric React interfaces for industrial use-cases."
      },
      {
        company: "Alliance International",
        email: "hr@allianceinternational.com",
        role: "MERN Stack Developer",
        pitch: "As a Project Lead with over 2 years of experience delivering production-grade web systems, I have the autonomy and technical depth required for the high-impact remote roles managed by Alliance International."
      }
    ];

    console.log(`🚀 Dispatching tailored applications to ${leads.length} Remote Targets...`);

    for (const lead of leads) {
      const body = `Dear Hiring Team,

I am writing to express my strong interest in the **${lead.role}** position at **${lead.company}**. ${lead.pitch}

With over **2 years of experience** as a Project Lead and Full Stack Developer, I have a proven track record of building high-scale, state-level digital platforms in Kerala, including the **KSEB PM E-DRIVE** and **ASAP Career Link** systems.

**Why I am a strong fit for ${lead.company}:**
* **Technical Depth**: Highly proficient in **React, Angular, Node.js, and MongoDB**.
* **Financial Integrity**: Designed secure payment modules handling **70M+ in transactions**.
* **Scalability**: Experienced in building candidate portals serving **14,000+ users**.
* **AI-Native Workflow**: I leverage **OpenClaw, Antigravity, and Codex** to maintain high code quality and velocity.

I am eager to bring my expertise to your team. Please find my resume attached for review.

Best regards,

Muhammed Rizin
rizin7427@gmail.com
+91 8156886609
LinkedIn: https://linkedin.com/in/muhammed-rizin
Portfolio: https://muhammedrizin.in
GitHub: https://github.com/Muhammed-Rizin`;

      try {
        console.log(`📧 Applying to ${lead.company} (${lead.email})...`);
        
        await sendMailService({
          to: lead.email,
          subject: `Application for ${lead.role} - Muhammed Rizin`,
          text: body,
          html: markdownToHtml(body),
          user: user._id,
          company: lead.company,
          role: lead.role,
          source: "mail",
          notes: `JD-Tailored Outreach. Pitch: ${lead.pitch}`,
          resumeLink: user.resumeLink,
          resumeName: user.resumeName
        });

        console.log(`✅ SUCCESS: ${lead.company}`);

      } catch (err) {
        console.error(`❌ FAILED: ${lead.company} - ${err.message}`);
      }
      
      // Delay to avoid rate limits
      await new Promise(r => setTimeout(r, 4000));
    }

    console.log("\n🏁 Tailored remote batch completed.");
    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
