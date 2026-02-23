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
    console.log("🔍 Checking for bounced emails in applications...");

    const result = await models.Application.updateMany(
      { 
        "mail.to": { $in: BOUNCE_LIST },
        status: { $ne: "bounced" }
      },
      { $set: { status: "bounced" } }
    );

    console.log(`✅ Updated ${result.modifiedCount} applications to 'bounced' status.`);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
};

processBounces();
