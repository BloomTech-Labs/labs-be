import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { paramMissingError } from "@shared/constants";
import { processTeambuilding } from "src/services/Teambuilding";

const { BAD_REQUEST, CREATED, OK } = StatusCodes;


/** 
 * Build new teams for a given cohort. See /docs/teambuilding.md
 * Post a set of new project teams to the "Labs - Projects" table in SMT.
 *
 * @param req
 * @param res
 * @returns
 */
export async function postBuildTeams(
  req: Request,
  res: Response
): Promise<Response> {
  const { cohort } = req.params;

  const assignments = await processTeambuilding(cohort);

  return res.status(OK).json(assignments);
}
