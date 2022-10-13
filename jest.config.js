/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/** @type {import('jest').Config} */

const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: false,
  setupFiles: ["<rootDir>/src/shared/testHelper.ts"],
  moduleNameMapper: pathsToModuleNameMapper(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    compilerOptions.paths , { prefix: "<rootDir>" }
  ),
  testPathIgnorePatterns: [ "<rootDir>/spec/" ],
  // automock: true, // will auto inport mock files
};
module.exports = config;
