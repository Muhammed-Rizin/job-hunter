import "dotenv/config";
import connectDB from "../database/index.js";
import models from "../model/index.js";

const run = async () => {
  try {
    await connectDB();
    
    const companyName = "Classera";
    const status = "hr_contact";
    const note = "Replied: Automatic acknowledgement received (jobs@classera.com)";

    const result = await models.Application.updateMany(
      { company: { $regex: new RegExp(companyName, "i") } },
      { $set: { status: status, notes: note } }
    );
    console.log(`✅ Updated ${companyName}: ${result.modifiedCount} records`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
