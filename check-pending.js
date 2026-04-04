import "./helper/dns.js";
import "./helper/global.js";
import connectDB from "./database/index.js";
import { getPendingLeads } from "./services/lead.service.js";
import { DEFAULT_USER_EMAIL } from "./config/index.js";
import models from "./model/index.js";

const run = async () => {
  await connectDB();
  const user = await models.User.findOne({ email: DEFAULT_USER_EMAIL, status: 0 });
  const pending = await getPendingLeads(user._id, { limit: 10, hasEmail: true });
  console.log("PENDING_LEADS_COUNT:", pending.length);
  process.exit(0);
};

run();
