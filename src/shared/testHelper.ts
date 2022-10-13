// Set the env file, must be first
import dotenv from "dotenv";

const envResult = dotenv.config();

if (envResult.error) {
  throw envResult.error;
}

// console.log("🚀 ~ file: testHelper.ts ~ line 1 ~ envResult", envResult);
