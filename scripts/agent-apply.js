import "dotenv/config";
import "../helper/global.js";
import connectDB from "../database/index.js";
import models from "../model/index.js";
import { sendMailService, markPlanAsApplied } from "../services/mail.service.js";
import { markdownToHtml } from "../utils/email.js";
import fs from "fs";

/**
 * 🤖 AGENT-APPLY v2
 * Designed for easy use by other AI agents.
 * Supports positional arguments OR a JSON file/string.
 */

const printUsage = () => {
  console.log(`
🤖 Job Hunter Agent CLI

Option A (Positional):
  node agent-apply.js <to> <company> <role> <subject> <body>

Option B (JSON File):
  node agent-apply.js --file <path_to_json>

Option C (JSON String):
  node agent-apply.js --json '<json_string>'

JSON Structure:
{
  "to": "hr@company.com",
  "company": "Company Name",
  "role": "Position",
  "subject": "Email Subject",
  "body": "Markdown enabled body...",
  "source": "optional source",
  "notes": "optional notes"
}
`);
};

const run = async () => {
  const args = process.argv.slice(2);
  let payload = {};

  try {
    if (args[0] === "--file") {
      payload = JSON.parse(fs.readFileSync(args[1], "utf8"));
    } else if (args[0] === "--json") {
      payload = JSON.parse(args[1]);
    } else if (args.length >= 5) {
      payload = {
        to: args[0],
        company: args[1],
        role: args[2],
        subject: args[3],
        body: args[4],
        source: args[5] || "agent-automatic",
        notes: args[6] || "Automatically applied by AI Agent",
      };
    } else {
      printUsage();
      process.exit(1);
    }

    // Validation
    const required = ["to", "company", "role", "subject", "body"];
    for (const field of required) {
      if (!payload[field]) throw new Error(`Missing required field: ${field}`);
    }

    // 1. Setup Environment
    await connectDB();
    
    // 2. Resolve User (Rizin)
    const user = await models.User.findOne({ email: "rizin7427@gmail.com" });
    if (!user) throw new Error("Main user (rizin7427@gmail.com) not found.");

    console.log(`\n🚀 Processing application for ${user.name}...`);

    // 3. Send Mail & Log
    const result = await sendMailService({
      to: payload.to,
      subject: payload.subject,
      text: payload.body,
      html: markdownToHtml(payload.body),
      user: user._id,
      company: payload.company,
      role: payload.role,
      source: payload.source || "agent-automatic",
      notes: payload.notes || `Winning Move: ${payload.winningMove || 'N/A'}`,
      resumeLink: user.resumeLink,
      resumeName: user.resumeName,
      appliedDate: payload.appliedDate || new Date().toISOString().split("T")[0]
    });

    console.log("✅ SUCCESS: Mail dispatched and logged.");
    console.log(`📍 Message ID: ${result.messageId}`);

    // 4. Mark plan as applied if planId exists
    if (payload.planId) {
      await markPlanAsApplied(payload.planId, result.messageId);
      console.log(`✅ Plan [${payload.planId}] marked as applied.`);
    }

    process.exit(0);

  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    process.exit(1);
  }
};

run();
