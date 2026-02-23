import "dotenv/config";
import "../helper/global.js";
import connectDB from "../database/index.js";
import models from "../model/index.js";
import fs from "fs";

const run = async () => {
  try {
    await connectDB();
    const data = JSON.parse(fs.readFileSync("scripts/update-hooks.json", "utf8"));

    for (const item of data) {
      await models.Plan.findByIdAndUpdate(item.id, {
        "details.hook": item.hook,
        "details.winningMove": item.winningMove
      });
      console.log(`✅ Updated: ${item.id}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
