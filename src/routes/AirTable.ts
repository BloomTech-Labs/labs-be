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


//   return res.status(OK).json(assignments);
}

// export async function getAssignment(req: Request, res: Response) {
//   const { id } = req.params;
//   const assignment = await assignmentsDao.getOne(parseInt(id));
//   return res.status(OK).json(assignment);
// }

// export async function getAssignmentSubmissions(req: Request, res: Response) {
//   const { id } = req.params;
//   const assignment = await assignmentsDao.getSubmissions(parseInt(id));
//   return res.status(OK).json(assignment);
// }