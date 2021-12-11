import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import logger from "@shared/Logger";

import ObjectivesDao from "@daos/Airtable/ObjectivesDao";
import {
  getProgress as getObjectiveProgress,
  putProgress as putObjectiveProgress,
  putCohortProgress as putCohortObjectiveProgress,
  getCohortProgress as getCohortObjectiveProgress,
} from "@services/Objectives";

import { paramMissingError } from "@shared/constants";
import { Objective } from "@entities/Objective";

const objectivesDao = new ObjectivesDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all objectives and sprint milestones.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getAllObjectives(
  req: Request,
  res: Response
): Promise<Response> {
  const objectives = await objectivesDao.getAll();

  return res.status(OK).json(objectives);
}

/**
 * Get a learner's progress toward all their objectives.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getProgress(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params;
  const progress = await getObjectiveProgress(id);

  return res.status(OK).json(progress);
}

/**
 * Put a learner's progress toward all their objectives and sprint milestones
 * to their Objectives course in Canvas.
 *
 * @param req
 * @param res
 * @returns
 */
export async function putProgress(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params; // Learner ID
  const progress = await putObjectiveProgress(id);

  return res.status(OK).json(progress);
}

/**
 * For an entire cohort, get all learners' progress toward all their objectives
 * and sprint milestones.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getCohortProgress(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params; // Cohort ID
  // Any progress retrieved by FE
  const _progress = req.body as Record<string, Objective[]>;
  const progress = await getCohortObjectiveProgress(id, _progress);

  return res.status(OK).json(progress);
}

/**
 * For an entire cohort, put all learners' progress toward all their objectives
 * and sprint milestones to their Objectives courses in Canvas.
 *
 * @param req
 * @param res
 * @returns
 */
export async function putCohortProgress(
  req: Request,
  res: Response
): Promise<Response> {
  const { id } = req.params; // Cohort ID
  // Any progress retrieved by FE
  const _progress = req.body as Record<string, Objective[]>;
  const progress = await putCohortObjectiveProgress(id, _progress);

  return res.status(OK).json(progress);
}
