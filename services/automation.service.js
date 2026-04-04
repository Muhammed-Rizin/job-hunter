import { getPendingLeads, updateLeadStatus } from "./lead.service.js";
import { generateLetter, submitApplication } from "./application.service.js";
import { verifyDomain, isHighRiskEmail, getRandomSubject } from "../helper/email-safety.js";

/**
 * @desc    Batch process pending leads with randomized throttle and safety checks
 */
export const orchestrateBatch = async (user, { limit = 10, target = 5, proceed = false }) => {
  const pending = await getPendingLeads(user._id, { limit, hasEmail: true });
  if (pending.length === 0) return { message: "No pending leads with emails found." };

  if (!proceed) {
    return {
      message: "Preview mode. Set proceed=true to send batch.",
      leads: pending.map((p) => ({
        id: p._id,
        company: p.companyName,
        email: p.email,
        priority: p.priority,
      })),
    };
  }

  let sent = 0;
  let skipped = 0;
  const reports = [];

  for (const plan of pending) {
    if (sent >= target) break;

    try {
      // 1. Domain Safety Check (MX)
      const isValidDomain = await verifyDomain(plan.email);
      if (!isValidDomain) {
        throw new Error(`Domain verification failed for ${plan.email} (No MX records)`);
      }

      // 2. High-Risk Email Prefix Check
      if (isHighRiskEmail(plan.email)) {
        throw new Error(`Skipped high-risk email prefix: ${plan.email}`);
      }

      const letter = await generateLetter(plan);

      // 3. Randomized Subject Line (Anti-Spam)
      const subject = getRandomSubject(
        plan.companyName,
        plan.roleTitle || plan.techStack || "Developer",
      );

      const res = await submitApplication(user, {
        planId: plan._id,
        to: plan.email,
        subject,
        body: letter.body,
        letterFile: letter.filename,
        company: plan.companyName,
        role: plan.roleTitle || "Developer",
        source: "mail",
      });

      sent++;
      reports.push({ company: plan.companyName, status: "sent", messageId: res.messageId });

      // 4. Randomized Stealth Throttle (15s to 45s)
      if (sent < target) {
        const delay = Math.floor(Math.random() * (45000 - 15000 + 1) + 15000);
        console.log(`Stealth Throttle: Waiting ${delay / 1000}s before next application...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      skipped++;
      reports.push({ company: plan.companyName, status: "error", error: error.message });
      console.error(`Batch Error [${plan.companyName}]: ${error.message}`);
    }
  }

  return { sent, skipped, reports };
};
