import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

import logger from "@shared/Logger";

const { OK } = StatusCodes;

logger.info("Loading env route");
/**
 * Get all env vars.
 *
 * @param req
 * @param res
 * @returns
 */
export function getAllVars(req: Request, res: Response): Response {
  const envs = process.env;
  logger.info("Returning env vars.");
  return res.status(OK).json({ envs });
}
