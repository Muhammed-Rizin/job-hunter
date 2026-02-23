import "dotenv/config";
import "../helper/global.js";
import connectDB from "../database/index.js";
import models from "../model/index.js";

/**
 * 🤖 AGENT-STATUS-SYNC
 * Allows AI agents to sync bounce or delivery status from external sources.
 * Usage: 
 *   node agent-status-sync.js --bounced --email <email_address>
 *   node agent-status-sync.js --sent --id <plan_id> --msgid <message_id>
 */

const run = async () => {
  const args = process.argv.slice(2);
  const action = args[0];

  try {
    await connectDB();

    if (action === "--bounced") {
      const email = args[2];
      if (!email) throw new Error("Email required for bounce sync.");
      console.log(`🔍 Syncing bounce status for: ${email}`);

      const appResult = await models.Application.updateMany(
        { "mail.to": email },
        { $set: { status: "bounced" } }
      );

      const planResult = await models.Plan.updateMany(
        { email: email },
        { $set: { status: "bounced" } }
      );

      console.log(`✅ Sync Complete. Apps: ${appResult.modifiedCount}, Plans: ${planResult.modifiedCount}`);
    } 
    else if (action === "--sent") {
      const id = args[2];
      const msgid = args[4];
      if (!id || !msgid) throw new Error("ID and MsgID required for sent sync.");
      console.log(`📡 Marking plan ${id} as applied with MsgID: ${msgid}`);

      const updated = await models.Plan.findByIdAndUpdate(id, {
        status: "applied",
        "mail.sent": true,
        "mail.messageId": msgid,
        "details.messageId": msgid,
      });

      if (!updated) throw new Error("Plan not found.");
      console.log(`✅ Plan marked as applied.`);
    }
    else {
      console.log("Usage: node agent-status-sync.js --bounced --email <email> | --sent --id <id> --msgid <msgid>");
    }
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    process.exit(1);
  }
};

run();
