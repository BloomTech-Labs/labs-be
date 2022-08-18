import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { paramMissingError } from "@shared/constants";
import { ILabsApplicationSubmission } from "@entities/TeambuildingPayload";
import { processLabsApplication } from "src/services/Teambuilding";

const { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK } = StatusCodes;

/**
 * Build new teams for a given cohort. See /docs/teambuilding.md
 * Post a set of new project teams to the "Labs - Projects" table in SMT.
 *
 * @param req
 * @param res
 * @returns
 */
export async function postLabsApplication(
  req: Request,
  res: Response
): Promise<Response> {
  const labsApplicationSubmission = req.body as ILabsApplicationSubmission;

  try {
    await processLabsApplication(labsApplicationSubmission);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR);
  }

  return res.status(OK);
}
