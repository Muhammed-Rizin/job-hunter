import chalk from "chalk";
import mongoose from "mongoose";
import { DATABASE_URL, IS_PRODUCTION } from "../config/index.js";

import "../model/index.js";

if (!DATABASE_URL) {
  console.error(chalk.red("CRITICAL: DATABASE_URL is not defined in .env"));
  process.exit(1);
}

const options = {
  connectTimeoutMS: 30000,
  serverSelectionTimeoutMS: 5000,
};

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL, options);
    console.log(chalk.whiteBright("Database connection established"));
  } catch (error) {
    console.error(chalk.red("Error connecting to database:"), error.message);

    if (error.message.includes("ETIMEOUT") || error.message.includes("ENOTFOUND")) {
      console.error(chalk.yellow("\n[Troubleshooting]"));
      console.error("1. Check if your current IP is whitelisted in MongoDB Atlas.");
      console.error("2. Verify your internet connection.");
      if (!IS_PRODUCTION) {
        console.error("3. If using Node < 20, you might need a Google DNS (8.8.8.8) override.");
      }
    }

    // We don't process.exit here to allow the caller (like the web server) to handle it
    throw error;
  }
};

export default connectDB;
