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
    console.log("🔍 Running Global Bounce Auditor...");

    const normalizedList = BOUNCE_LIST.map(e => e.toLowerCase().trim());

    // 1. Mark existing applications as bounced if they are in the list
    const applyBounces = await models.Application.updateMany(
      { 
        "mail.to": { $in: normalizedList },
        statusFlag: 0 
      },
      { $set: { status: "bounced" } }
    );

    // 2. Mark corresponding plans as bounced if they are in the list
    const planBounces = await models.Plan.updateMany(
      { 
        email: { $in: normalizedList },
        statusFlag: 0 
      },
      { $set: { status: "bounced" } }
    );

    console.log(`✅ System Sync Complete.`);
    console.log(`📡 Applications updated: ${applyBounces.modifiedCount}`);
    console.log(`📋 Plans updated:        ${planBounces.modifiedCount}`);

  } catch (e) {
    console.error("❌ Audit Error:", e.message);
  } finally {
    process.exit(0);
  }
};

processBounces();
