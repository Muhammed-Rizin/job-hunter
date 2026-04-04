import chalk from "chalk";

/**
 * Setup global error handlers for uncaught exceptions and unhandled rejections.
 * @param {string} prefix - The prefix to include in the error message.
 * @param {boolean} exitOnError - Whether to exit the process after logging the error.
 */
export const setupErrorHandlers = (prefix = "CLI", exitOnError = true) => {
  process.on("uncaughtException", (err) => {
    console.error(chalk.red(`[${prefix}] Uncaught Exception: ${err.message}`));
    if (exitOnError) process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error(chalk.red(`[${prefix}] Unhandled Rejection: ${reason}`));
    if (exitOnError) process.exit(1);
  });
};
