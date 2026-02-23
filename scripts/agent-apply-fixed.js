import "dotenv/config";
import "../helper/global.js";
import connectDB from "../database/index.js";
import models from "../model/index.js";
import { sendMailService } from "../services/mail.service.js";
import { markdownToHtml } from "../utils/email.js";
import fs from "fs";
import { Resolver } from 'dns';

/**
 * 🤖 AGENT-APPLY v2.1 (Fixed DNS)
 */

const dnsResolver = new Resolver();
dnsResolver.setServers(['8.8.8.8']);

const run = async () => {
  const args = process.argv.slice(2);
  let payload = {};

  try {
    if (args[0] === "--file") {
      payload = JSON.parse(fs.readFileSync(args[1], "utf8"));
    } else if (args[0] === "--json") {
      payload = JSON.parse(args[1]);
    } else {
      process.exit(1);
    }

    // 1. Setup Environment
    await connectDB();
    
    // 2. Resolve User (Rizin)
    const user = await models.User.findOne({ email: "rizin7427@gmail.com" });
    if (!user) throw new Error("Main user not found.");

    // 3. Send Mail & Log
    await sendMailService({
      to: payload.to,
      subject: payload.subject,
      html: markdownToHtml(payload.body),
      user: user._id,
      company: payload.company,
      role: payload.role,
      source: payload.source || "mail",
      notes: payload.notes || "Automatically applied by AI Agent",
      resumeLink: user.resumeLink,
      resumeName: user.resumeName,
    });

    console.log(`✅ SUCCESS: ${payload.company}`);
  } catch (error) {
    console.error(`\n❌ ERROR (${payload.company || 'Unknown'}):`, error.message);
  }
};

run();
