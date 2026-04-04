import chalk from "chalk";
import { resolveUser as resolveUserFromService } from "../services/user.service.js";

export const log = {
  info: (m) => console.log(chalk.blue("[INFO] ") + m),
  success: (m) => console.log(chalk.green("[OK] ") + m),
  error: (m) => console.log(chalk.red("[ERROR] ") + m),
  warn: (m) => console.log(chalk.yellow("[WARN] ") + m),
};

export const getArgValue = (flag) => {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : null;
};

export const parseJson = (flag) => {
  const val = getArgValue(flag);
  try {
    return val ? JSON.parse(val) : null;
  } catch {
    throw new Error(`Invalid JSON for ${flag}`);
  }
};

export const resolveUser = async () => {
  const email = getArgValue("--user-email");
  return resolveUserFromService(email);
};
