import "./helper/dns.js";
import "./helper/global.js";
import connectDB from "./database/index.js";
import models from "./model/index.js";

const run = async () => {
  await connectDB();
  const apps = await models.Application.find({})
    .sort({ createdAt: -1 })
    .limit(5);
  
  console.log("NEWEST_APPLICATIONS:");
  apps.forEach(a => {
    console.log(`- ${a.company}: Status=${a.status}, Source=${a.source}, MsgID=${a.mail.messageId}`);
  });
  
  process.exit(0);
};

run();
