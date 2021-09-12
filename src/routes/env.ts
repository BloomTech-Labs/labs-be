import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

import { paramMissingError } from "@shared/constants";

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all env vars.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getAllVars(req: Request, res: Response) {
  const envs = process.env;
  return res.status(OK).json({ envs });
}
