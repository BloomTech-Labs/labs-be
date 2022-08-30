import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { getListOfLabsLearners } from "src/services/Contact";

const { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, OK } = StatusCodes;

/**
 * Check if a Labs Application exists in Salesforce for a given learner.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getActiveLabsLearners(
  req: Request,
  res: Response
): Promise<Response> {
  let results;
  try {
    results = await getListOfLabsLearners();
  } catch (error) {
    return res.json({ status: INTERNAL_SERVER_ERROR, message: error });
  }

  return res.json({ results });
}