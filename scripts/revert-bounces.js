import 'dotenv/config';
import connectDB from '../database/index.js';
import models from '../model/index.js';

const revertBounces = async () => {
  try {
    await connectDB();
    console.log("⏪ Reverting bounced status to 'applied' for all applications...");

    const result = await models.Application.updateMany(
      { status: "bounced" },
      { $set: { status: "applied" } }
    );

    console.log(`✅ Successfully reverted ${result.modifiedCount} applications.`);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
};

revertBounces();
