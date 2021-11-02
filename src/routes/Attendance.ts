import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import { paramMissingError } from "@shared/constants";
import { processAttendance } from "src/services/Attendance";

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Put attendance scores in the Canvas gradebook for the given event for
 * the given learners by their email addresses.
 *
 * @param req
 * @param res
 * @returns
 */
export async function putEventAttendance(
  req: Request,
  res: Response
): Promise<Response> {
  const { eventType, eventDate } = req.params;
  const learners: Record<string, unknown>[] = req.body as Record<
    string,
    unknown
  >[];

  await processAttendance(eventType, eventDate, learners);

  return res.status(OK).json(learners);
}
