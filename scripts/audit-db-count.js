import "dotenv/config";
import connectDB from "../database/index.js";
import models from "../model/index.js";

const run = async () => {
  try {
    await connectDB();
    const user = await models.User.findOne({ email: "rizin7427@gmail.com" });
    
    const stats = await models.Application.aggregate([
      { $match: { user: user._id, statusFlag: 0 } },
      { $group: { _id: "$company", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log(`\n📊 UNIQUE COMPANIES LOGGED: ${stats.length}`);
    console.log(`📊 TOTAL ACTIVE RECORDS: ${stats.reduce((acc, curr) => acc + curr.count, 0)}`);
    console.log(`\nTOP RECORDS:`);
    console.log(stats.slice(0, 10));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
