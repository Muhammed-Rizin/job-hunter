import 'dotenv/config';
import connectDB from '../database/index.js';
import models from '../model/index.js';

const BOUNCE_LIST = [
  "jobs@techfriar.com",
  "careers@ults.in",
  "hr@sanesquare.com",
  "hr@esynergy.co.in",
  "hr@niveosys.com",
  "careers@mimitsolutions.com",
  "hr@leeye-t.com",
  "careers@edumpus.com",
  "hr@codeace.in",
  "hr@exploreit.co.in"
];

const processBounces = async () => {
  try {
    await connectDB();
    console.log("🔍 Running Bounce Auditor...");

    // 1. Mark existing applications as bounced if they are in the list
    const applyBounces = await models.Application.updateMany(
      { 
        "mail.to": { $in: BOUNCE_LIST },
        status: { $ne: "bounced" }
      },
      { $set: { status: "bounced" } }
    );

    // 2. Mark corresponding plans as bounced if they are in the list
    const planBounces = await models.Plan.updateMany(
      { 
        email: { $in: BOUNCE_LIST },
        status: { $ne: "bounced" }
      },
      { $set: { status: "bounced" } }
    );

    console.log(`✅ Audit Complete.`);
    console.log(`📡 Applications updated: ${applyBounces.modifiedCount}`);
    console.log(`📋 Plans updated: ${planBounces.modifiedCount}`);

  } catch (e) {
    console.error("❌ Audit Error:", e.message);
  } finally {
    process.exit(0);
  }
};

processBounces();
