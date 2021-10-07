/**
 * Pre-start is where we want to place things that must run BEFORE the express server is started.
 * This is useful for environment variables, command-line arguments, and cron-jobs.
 */

import dotenv from "dotenv";

// Set the env file
const result2 = dotenv.config();
if (result2.error) {
  throw result2.error;
}
