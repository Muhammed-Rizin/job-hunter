import "dotenv/config";
import "./helper/global.js";
import connectDB from "./database/index.js";
import models from "./model/index.js";
import { sendMailService, markPlanAsApplied } from "./services/mail.service.js";
import { markdownToHtml } from "./utils/email.js";
import fs from "fs";
import chalk from "chalk";

/**
 * 🛸 UNIFIED JOB-HUNTER CLI
 * The single entry point for all agent operations.
 */

const log = {
  info: (m) => console.log(chalk.blue("ℹ ") + m),
  success: (m) => console.log(chalk.green("✔ ") + m),
  error: (m) => console.log(chalk.red("✖ ") + m),
  warn: (m) => console.log(chalk.yellow("⚠ ") + m),
};

const printUsage = () => {
  console.log(`
${chalk.bold.red("🛸 Job Hunter Unified CLI")}

${chalk.bold("Usage:")}
  node agent.js <command> [options]

${chalk.bold("Commands:")}
  ${chalk.cyan("apply")}       Send job application mail.
               --json '{"to": "...", "company": "...", ...}'
               --plan <planId> (Auto-fills details from plan)

  ${chalk.cyan("plan")}        Manage lead pipeline.
               --add --json '{"companyName": "...", ...}'
               --update <id> --json '{"status": "applied"}'

  ${chalk.cyan("sync")}        Sync status from external data.
               --bounced --email <email>
               --sent --id <id> --msgid <msgid>

  ${chalk.cyan("cleanup")}     Perform database maintenance.
               --duplicates (Soft-deletes duplicate apps)

  ${chalk.cyan("legacy")}      Access legacy utility scripts.
               --list (List available legacy scripts)
               --run <filename> (Run a script from legacy folder)
  `);
};

const run = async () => {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || ["--help", "-h"].includes(command)) {
    printUsage();
    process.exit(0);
  }

  try {
    await connectDB();
    const user = await models.User.findOne({ email: "rizin7427@gmail.com" });
    if (!user) throw new Error("Primary user context not found.");

    switch (command) {
      case "apply": {
        let payload = {};
        const jsonArg = args.indexOf("--json");
        const planArg = args.indexOf("--plan");

        if (planArg !== -1) {
          const planId = args[planArg + 1];
          log.info(`Fetching details from Plan: ${planId}`);
          const plan = await models.Plan.findById(planId);
          if (!plan) throw new Error("Plan not found.");
          
          payload = {
            to: plan.email,
            company: plan.companyName,
            role: plan.techStack || "Developer",
            subject: `Application for ${plan.techStack || 'Developer'} role - Muhammed Rizin`,
            body: `Hi Team,\n\nI am interested in ${plan.companyName}...`, // Default fallback
            planId: plan._id
          };
        }

        if (jsonArg !== -1) {
          const custom = JSON.parse(args[jsonArg + 1]);
          payload = { ...payload, ...custom };
        }

        if (!payload.to || !payload.company) throw new Error("Target email and company required.");

        // Duplicate Check Prevention
        const duplicate = await models.Application.findOne({
          user: user._id,
          company: payload.company.trim(),
          statusFlag: 0,
          $or: [{ role: payload.role?.trim() }, { "mail.to": payload.to?.trim() }]
        });
        
        if (duplicate) {
           log.warn(`Skipping application to ${payload.company}. Record already exists.`);
           break;
        }

        log.info(`Sending application to ${payload.company}...`);
        const result = await sendMailService({
          to: payload.to,
          subject: payload.subject,
          text: payload.body,
          html: markdownToHtml(payload.body),
          user: user._id,
          company: payload.company,
          role: payload.role || "Developer",
          source: payload.source || "agent-cli",
          resumeLink: user.resumeLink,
          resumeName: user.resumeName,
        });

        if (payload.planId) await markPlanAsApplied(payload.planId, result.messageId);
        log.success(`Application dispatched! ID: ${result.messageId}`);
        break;
      }

      case "plan": {
        const action = args[1];
        const jsonArg = args.indexOf("--json");
        const payload = jsonArg !== -1 ? JSON.parse(args[jsonArg + 1]) : null;

        if (action === "--add" && payload) {
          const duplicate = await models.Plan.findOne({
            user: user._id,
            companyName: payload.companyName.trim(),
            statusFlag: 0
          });

          if (duplicate) {
             log.warn(`Lead ${payload.companyName} already exists in Planning.`);
             break;
          }

          const data = await models.Plan.create({ ...payload, user: user._id });
          log.success(`Lead added: ${data.companyName} (${data._id})`);
        } else if (action === "--update" && payload) {
          const id = args[2];
          await models.Plan.findByIdAndUpdate(id, payload);
          log.success(`Plan ${id} updated.`);
        }
        break;
      }

      case "sync": {
        if (args.includes("--bounced")) {
          const email = args[args.indexOf("--email") + 1];
          await models.Application.updateMany({ "mail.to": email }, { status: "bounced" });
          await models.Plan.updateMany({ email }, { status: "bounced" });
          log.success(`Status synced: ${email} marked as bounced.`);
        }
        break;
      }

      case "cleanup": {
        if (args.includes("--duplicates")) {
          log.info("Scanning for duplicates...");
          const apps = await models.Application.find({ user: user._id, statusFlag: 0 }).sort({ createdAt: -1 });
          const seen = new Set();
          const toDelete = [];
          apps.forEach(app => {
            const key = `${app.company?.trim()}_${app.role?.trim()}_${app.source?.trim()}`.toLowerCase();
            if (seen.has(key)) toDelete.push(app._id);
            else seen.add(key);
          });
          if (toDelete.length > 0) {
            await models.Application.updateMany({ _id: { $in: toDelete } }, { statusFlag: 1 });
            log.success(`Moved ${toDelete.length} duplicates to trash.`);
          } else {
            log.info("Database is already clean.");
          }
        }
        break;
      }

      case "legacy": {
        const path = "./scripts/legacy";
        if (args.includes("--list")) {
          const files = fs.readdirSync(path).filter(f => f.endsWith(".js"));
          log.info("Available legacy scripts:");
          files.forEach(f => console.log(` - ${f}`));
        } else if (args.includes("--run")) {
          const file = args[args.indexOf("--run") + 1];
          log.info(`Executing legacy script: ${file}`);
          const { execSync } = await import("child_process");
          execSync(`node ${path}/${file}`, { stdio: "inherit" });
        }
        break;
      }

      default:
        log.error(`Unknown command: ${command}`);
        printUsage();
    }
    process.exit(0);
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  }
};

run();
