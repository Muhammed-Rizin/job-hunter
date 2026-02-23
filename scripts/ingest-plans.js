import "dotenv/config";
import "../helper/global.js";
import connectDB from "../database/index.js";
import models from "../model/index.js";
import fs from "fs";

const run = async () => {
  try {
    await connectDB();
    const user = await models.User.findOne({ email: "rizin7427@gmail.com" });
    const plans = JSON.parse(fs.readFileSync("scripts/global-plans.json", "utf8"));

    for (const plan of plans) {
      await models.Plan.create({
        ...plan,
        user: user._id,
      });
      console.log(`✅ Plan added: ${plan.companyName}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
