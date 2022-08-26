import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { paramMissingError } from "@shared/constants";
import { ILabsApplicationSubmission } from "@entities/TeambuildingPayload";
import { getLabsApplicationByOktaId, processLabsApplication } from "src/services/Teambuilding";

const { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK } = StatusCodes;

/**
 * Check if a Labs Application exists in Salesforce for a given learner.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getLabsApplication(
  req: Request,
  res: Response
): Promise<Response> {
  const { oktaId } = req.params;

  try {
    await getLabsApplicationByOktaId(oktaId);
  } catch (error) {
    return res.sendStatus(INTERNAL_SERVER_ERROR);
  }

  return res.sendStatus(OK);
}

/**
 * Add a Labs Application to Salesforce for a given learner.
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
    return res.sendStatus(INTERNAL_SERVER_ERROR);
  }

  return res.sendStatus(OK);
}
