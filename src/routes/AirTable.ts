import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import logger from "@shared/Logger";

import SurveyDao from "@daos/AirTable/SurveyDao";
import { paramMissingError } from "@shared/constants";

const surveyDao = new SurveyDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all surveys from `Labs - TBSurveys`.
 *
 * @param req
 * @param res
 * @returns
 */
export function getAllSurveys(req: Request, res: Response) {
  const surveys: unknown = (async () => {
    await surveyDao.getAll();
  })();
  console.log(surveys);
  return res.status(OK).json(surveys);
}

/**
 * Get all surveys from the given cohort view.
 *
 * @param req
 * @param res
 * @returns
 */
export function getCohortSurveys(req: Request, res: Response) {
  const { cohort } = req.params;
  const surveys: unknown = (async () => {
    await surveyDao.getCohort(cohort);
  })();
  return res.status(OK).json(surveys);
}
