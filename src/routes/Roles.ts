import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import logger from "@shared/Logger";

import RoleDao from "@daos/Role/RoleDao.mock";
import { paramMissingError } from "@shared/constants";

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all env vars.
 *
 * @param req
 * @param res
 * @returns
 */
export function assignRolesForUnit(req: Request, res: Response): Response {
  const { unitId } = req.params;
  logger.info("unitID: " + unitId);
  // Roles entity
  // get application data
  // Get teams with members (and role)
  // current roles with counts
  // current learner count
  // unit learner count

  return res.status(OK).json([]);
}
