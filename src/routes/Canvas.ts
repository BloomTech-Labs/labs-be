import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import logger from "@shared/Logger";

import AssignmentsDao from "@daos/Canvas/AssignmentsDao";
import { paramMissingError } from "@shared/constants";

const assignmentsDao = new AssignmentsDao(1482);
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all env vars.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getAllAssignments(
  req: Request,
  res: Response
): Promise <Response<any, Record<string, any>>> {
  const { unitId } = req.params;
  logger.info("unitID: " + unitId);
  const assignments: unknown = await assignmentsDao.getAll();
  // Roles entity
  // get application data
  // Get teams with members (and role)
  // current roles with counts
  // current learner count
  // unit learner count

  return res.status(OK).json(assignments);
}

export function getAssignment(
  req: Request,
  res: Response
): Response<any, Record<string, any>> {
  const { id } = req.params;
  const assignment: unknown = (async () => {
    await assignmentsDao.getOne(parseInt(id));
  })();
  return res.status(OK).json(assignment);
}

export function getAssignmentSubmissions(
  req: Request,
  res: Response
): Response<any, Record<string, any>> {
  const { id } = req.params;
  const assignment: unknown = (async () => {
    await assignmentsDao.getSubmissions(parseInt(id));
  })();
  return res.status(OK).json(assignment);
}
