import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import logger from '@shared/Logger';

import SurveyDao from '@daos/AirTable/SurveyDao';
import { paramMissingError } from '@shared/constants';



const surveyDao = new SurveyDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all env vars.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
 export async function getAllSurveys(req: Request, res: Response) {



  const surveys = await surveyDao.getAll();

  console.log(surveys);
  return res.status(OK).json(surveys);
}