/**
 * Setup the jet-logger.
 *
 * Documentation: https://github.com/seanpmaxwell/jet-logger
 */

import jetLogger from "jet-logger";

// Apply logger settings (Note you could also using a tool "dotenv" to set env variables)
// These must be set before logger is imported
// const logFilePath = path.join(__dirname, "../sampleProject.log");
// process.env.JET_LOGGER_MODE = LoggerModes.File; // Can also be Console, Custom, or Off
// process.env.JET_LOGGER_FILEPATH = logFilePath;

export default jetLogger;
