// Set the env file, must be first
import dotenv from "dotenv";

const result2 = dotenv.config({
  path: "./.env",
});

if (result2.error) {
  throw result2.error;
}
