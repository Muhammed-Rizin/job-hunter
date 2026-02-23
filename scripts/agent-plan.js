import "dotenv/config";
import "../helper/global.js";
import connectDB from "../database/index.js";
import models from "../model/index.js";

/**
 * 🤖 AGENT-PLAN v2
 * Allows AI agents to manage application plans with expanded fields.
 * Usage: 
 *   Add: node agent-plan.js --add --json '<json_string>'
 *   Update: node agent-plan.js --update <id> --json '<json_string>'
 */

const run = async () => {
  const args = process.argv.slice(2);
  const action = args[0];

  try {
    await connectDB();
    const user = await models.User.findOne({ email: "rizin7427@gmail.com" });
    if (!user) throw new Error("Main user not found.");

    if (action === "--add") {
      const payload = JSON.parse(args[2]);
      const data = await models.Plan.create({
        ...payload,
        user: user._id,
      });
      console.log("\n✅ Plan created successfully!");
      console.log("📍 ID:", data._id);
      console.log("🏢 Company:", data.companyName);
      console.log("💰 Package:", data.package || "N/A");
      console.log("🌍 Location:", data.location || "N/A");
    } 
    else if (action === "--update") {
      const id = args[1];
      const payload = JSON.parse(args[3]);
      const updated = await models.Plan.findOneAndUpdate(
        { _id: id, user: user._id, statusFlag: 0 },
        payload,
        { new: true }
      );
      if (!updated) throw new Error("Plan not found or already deleted.");
      console.log("\n✅ Plan updated successfully!");
      console.log("📍 ID:", updated._id);
      console.log("📊 Status:", updated.status);
    } 
    else {
      console.log("\n🤖 Usage:");
      console.log("  Add: node agent-plan.js --add --json '<json_string>'");
      console.log("  Update: node agent-plan.js --update <id> --json '<json_string>'");
    }
    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    process.exit(1);
  }
};

run();
