import { CronJob } from "cron";
import models from "./model/index.js";
import moment from "moment";

import {
  getTransactionsForRange,
  calculateStats,
  generateAISummary,
  generateHTML,
} from "./service/analysis.js";

import { sendReportEmail } from "./helper/mail.js";

const startCronJobs = () => {
  console.log("🕒 Cron Jobs Initialized (cron package)…");

  // --------------------------------------------------
  // 1. DAILY REPORT – Runs every day at 08:00 AM IST
  // --------------------------------------------------
  const dailyJob = new CronJob(
    "0 8 * * *",
    async () => {
      console.log("▶ Running Daily Report Job...");

      try {
        const users = await models.User.find({});

        const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

        for (const user of users) {
          const txs = await getTransactionsForRange(user._id, yesterday, yesterday);

          if (txs.length > 0) {
            const stats = calculateStats(txs);
            const aiSummary = await generateAISummary(stats, `Yesterday (${yesterday})`);
            const html = generateHTML(user.name, stats, aiSummary, "Daily Snapshot");

            await sendReportEmail(user.email, `Mono Daily: ${yesterday}`, html);
          }
        }
      } catch (error) {
        console.error("Daily Cron Error:", error);
      }
    },
    null,
    true,
    "Asia/Kolkata"
  );

  // --------------------------------------------------
  // 2. WEEKLY REPORT – Runs every Sunday at 05:00 AM IST
  // --------------------------------------------------
  const weeklyJob = new CronJob(
    "0 5 * * 0", // second minute hour day month weekday
    async () => {
      console.log("▶ Running Weekly Report Job...");

      try {
        const users = await models.User.find({});

        const lastMonday = moment().subtract(1, "weeks").startOf("isoWeek").format("YYYY-MM-DD");
        const lastSaturday = moment()
          .subtract(1, "weeks")
          .startOf("isoWeek")
          .add(5, "days")
          .format("YYYY-MM-DD");

        for (const user of users) {
          const txs = await getTransactionsForRange(user._id, lastMonday, lastSaturday);

          if (txs.length > 0) {
            const stats = calculateStats(txs);
            const aiSummary = await generateAISummary(
              stats,
              `Week (${lastMonday} to ${lastSaturday})`
            );
            const html = generateHTML(user.name, stats, aiSummary, "Weekly Report");

            await sendReportEmail(user.email, `Mono Weekly: ${lastMonday} – ${lastSaturday}`, html);
          }
        }
      } catch (error) {
        console.error("Weekly Cron Error:", error);
      }
    },
    null,
    true,
    "Asia/Kolkata"
  );

  dailyJob.start();
  weeklyJob.start();
};

export default startCronJobs;
