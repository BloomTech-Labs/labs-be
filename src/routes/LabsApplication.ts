import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { paramMissingError } from "@shared/constants";
import TeamBuildingPayload, {
  ILabsApplicationSubmission,
} from "@entities/TeambuildingPayload";

import {
  getLabsApplicationByOktaId,
  processLabsApplication,
} from "src/services/Teambuilding";

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
  let results;
  try {
    results = await getLabsApplicationByOktaId(oktaId);
  } catch (error) {
    return res.json({ status: INTERNAL_SERVER_ERROR, message: error });
  }

  return res.json({ exists: results ? true : false, data: results });
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
    return res.json(await processLabsApplication(labsApplicationSubmission));
  } catch (error) {
    return res.json({ status: INTERNAL_SERVER_ERROR, message: error });
  }
}
