import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import logger from "@shared/Logger";

import AssignmentsDao from "@daos/Canvas/AssignmentsDao";
import ModulesDao from "@daos/Canvas/ModulesDao";
import UsersDao from "@daos/Canvas/UsersDao";
import { paramMissingError } from "@shared/constants";
import Assignment from "@entities/Assignment";
import Submission from "@entities/Submission";
import Module from "@entities/Module";
import CanvasUser from "@entities/CanvasUser";

const assignmentsDao = new AssignmentsDao();
const modulesDao = new ModulesDao();
const usersDao = new UsersDao();
const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/**
 * Get all Canvas assignments for a given course.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getAllAssignments(
  req: Request,
  res: Response
): Promise<Response> {
  const { courseId } = req.params;
  const assignments: Assignment[] | null = await assignmentsDao.getAll(
    parseInt(courseId)
  );
  // Roles entity
  // get application data
  // Get teams with members (and role)
  // current roles with counts
  // current learner count
  // unit learner count

  return res.status(OK).json(assignments);
}

/**
 * Get one assignment by its ID.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getAssignment(
  req: Request,
  res: Response
): Promise<Response> {
  const { courseId, assignmentId } = req.params;
  const assignment: Assignment | null = await assignmentsDao.getOne(
    parseInt(courseId),
    parseInt(assignmentId)
  );
  return res.status(OK).json(assignment);
}

/**
 * Get all submissions for an assignment by the assignment's ID.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getAssignmentSubmissions(
  req: Request,
  res: Response
): Promise<Response> {
  const { courseId, assignmentId } = req.params;
  const assignment: Submission[] | null = await assignmentsDao.getSubmissions(
    parseInt(courseId),
    parseInt(assignmentId)
  );
  return res.status(OK).json(assignment);
}


/**
 * Get all modules in a given Canvas course.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getCourseModules(
  req: Request,
  res: Response
): Promise<Response> {
  const { courseId } = req.params;
  const modules: Module[] | null = await modulesDao.getAllInCourse(
    parseInt(courseId)
  );

  return res.status(OK).json(modules);
}


/**
 * Get a user's Canvas ID by their SIS ID.
 * TODO: Move to a service layer
 *
 * @param userSisId
 * @returns
 */
export async function getUserIdBySisId(userSisId: string): Promise<number | null> {
  const user: CanvasUser | null = await usersDao.getOneBySisId (userSisId);
  return user?.id || null;
} 


/**
 * Get completion information for all modules in a given Canvas course.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getCourseModuleCompletion(
  req: Request,
  res: Response
): Promise<Response> {
  const { courseId } = req.params;
  const { lambdaId } = req.query;
  
  if (!courseId || !lambdaId) {
    return res.status(BAD_REQUEST);
  }

  const userId : number | null = await getUserIdBySisId (lambdaId as string);

  if (!userId) {
    return res.status(BAD_REQUEST).json("Canvas user ID not found for that SIS ID.");
  }

  const modules: Module[] | null = await modulesDao.getAllCompletionInCourse(
    parseInt(courseId), userId
  );

  return res.status(OK).json(modules);
}
