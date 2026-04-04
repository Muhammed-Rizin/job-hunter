import "./helper/dns.js";
import "./helper/global.js";

import connectDB from "./database/index.js";
import models from "./model/index.js";
import { createLead } from "./services/lead.service.js";
import { generateLetter, submitApplication } from "./services/application.service.js";
import { orchestrateBatch } from "./services/automation.service.js";
import { syncInbox } from "./services/inbox.service.js";
import { log, getArgValue, parseJson, resolveUser } from "./helper/cli.js";
import { setupErrorHandlers } from "./helper/error.js";
import chalk from "chalk";

// Global Error Handling for CLI
setupErrorHandlers("CLI");

const run = async () => {
  const command = process.argv[2];
  if (!command || ["--help", "-h"].includes(command)) {
    console.log(chalk.bold("\nJob Hunter CLI"));
    console.log("  plan --add --json '{...}'");
    console.log("  plan --bulk --json '[{...}, {...}]'");
    console.log("  apply --plan <id> [--json '{...}']");
    console.log("  apply --pending [--limit 10] [--target 5] [--proceed]");
    console.log("  sync --mails [--bounced]");
    process.exit(0);
  }

  try {
    await connectDB();
    const user = await resolveUser();

    if (command === "plan") {
      if (process.argv.includes("--add")) {
        const payload = parseJson("--json");
        const res = await createLead(user._id, payload);
        res.skipped ? log.warn(res.reason) : log.success(`Lead added: ${res.plan.companyName}`);
      } else if (process.argv.includes("--bulk")) {
        const payload = parseJson("--json");
        let created = 0,
          skipped = 0;
        for (const item of payload) {
          const res = await createLead(user._id, item);
          res.skipped ? skipped++ : created++;
        }
        log.success(`Bulk complete. Added: ${created}, Skipped: ${skipped}`);
      }
    } else if (command === "apply") {
      if (process.argv.includes("--pending")) {
        const limit = Number(getArgValue("--limit")) || 10;
        const target = Number(getArgValue("--target")) || 5;
        const proceed = process.argv.includes("--proceed");
        const res = await orchestrateBatch(user, { limit, target, proceed });

        if (res.leads) {
          log.info(res.message);
          res.leads.forEach((p) => console.log(`  - ${p.company} (${p.email})`));
        } else {
          log.success(`Batch complete. Sent: ${res.sent}, Skipped: ${res.skipped}`);
          res.reports.forEach((r) =>
            log[r.status === "sent" ? "success" : "warn"](
              `${r.company}: ${r.status} ${r.messageId || r.error || ""}`,
            ),
          );
        }
      } else {
        const planId = getArgValue("--plan");
        const custom = parseJson("--json") || {};
        const plan = planId ? await models.Plan.findById(planId) : null;

        const letter = await generateLetter(plan, custom);
        const subject =
          custom.subject ||
          `Application for ${plan?.roleTitle || "Developer"} role - Muhammed Rizin`;

        await submitApplication(user, {
          planId: plan?._id,
          to: custom.to || plan?.email,
          subject,
          body: letter.body,
          letterFile: letter.filename,
          company: plan?.companyName,
          role: plan?.roleTitle,
          source: custom.source || "mail",
        });

        log.success(`Application submitted for ${plan?.companyName || custom.company}`);
      }
    } else if (command === "sync") {
      const type = process.argv.includes("--bounced") ? "bounced" : "all";
      log.info(`Syncing inbox for ${type}...`);
      const res = await syncInbox(user, { type });

      if (res.bounced.length > 0) {
        log.warn(`Detected ${res.bounced.length} bounced applications:`);
        res.bounced.forEach((b) => console.log(`  - ${b.company} (${b.email})`));
      }
      if (res.replies.length > 0) {
        log.success(`Found ${res.replies.length} new potential HR replies:`);
        res.replies.forEach((r) => console.log(`  - From: ${r.from} | Subject: ${r.subject}`));
      }
      if (res.bounced.length === 0 && res.replies.length === 0) {
        log.info("Inbox is clean. No new bounces or replies detected.");
      }
    }

    process.exit(0);
  } catch (err) {
    log.error(err.message);
    process.exit(1);
  }
};

run();
