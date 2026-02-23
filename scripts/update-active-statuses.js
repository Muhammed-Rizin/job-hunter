import "dotenv/config";
import connectDB from "../database/index.js";
import models from "../model/index.js";

const run = async () => {
  try {
    await connectDB();
    
    const targets = [
      { name: "Zennode Technologies", status: "hr_contact", note: "Replied: Requested form completion (https://forms.gle/9rY8qSG3sDKX5fbD7)" },
      { name: "Armia Systems", status: "hr_contact", note: "Replied: Application received acknowledgement" },
      { name: "Acodez IT Solutions", status: "hr_contact", note: "Replied: Application received acknowledgement" }
    ];

    for (const target of targets) {
      const result = await models.Application.updateMany(
        { company: target.name },
        { $set: { status: target.status, notes: target.note } }
      );
      console.log(`✅ Updated ${target.name}: ${result.modifiedCount} records`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
