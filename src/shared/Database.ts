import "reflect-metadata";
import { ConnectionOptions, createConnection } from "typeorm";
import * as config from "../../ormconfig";
import logger from "./Logger";

export async function intializeDB(): Promise<void> {
  await createConnection(config as ConnectionOptions);
  logger.info("Database successfully initialized");
  return Promise.resolve(undefined);
}
