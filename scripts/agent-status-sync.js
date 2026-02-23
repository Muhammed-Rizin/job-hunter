import "dotenv/config";
import "../helper/global.js";
import connectDB from "../database/index.js";
import models from "../model/index.js";

/**
 * 🤖 AGENT-STATUS-SYNC
 * Allows AI agents to sync bounce status from external sources.
 * Usage: node agent-status-sync.js --bounced --email <email_address>
 */

const run = async () => {
  const args = process.argv.slice(2);
  const action = args[0];
  const email = args[2];

  if (!email || action !== "--bounced") {
    console.log("Usage: node agent-status-sync.js --bounced --email <email>");
    process.exit(1);
  }

  try {
    await connectDB();
    console.log(`🔍 Syncing bounce status for: ${email}`);

    // Update Applications
    const appResult = await models.Application.updateMany(
      { "mail.to": email },
      { $set: { status: "bounced" } }
    );

    // Update Plans
    const planResult = await models.Plan.updateMany(
      { email: email },
      { $set: { status: "bounced" } }
    );

    console.log(`✅ Sync Complete.`);
    console.log(`📡 Applications updated: ${appResult.modifiedCount}`);
    console.log(`📋 Plans updated: ${planResult.modifiedCount}`);
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    process.exit(1);
  }
};

run();
