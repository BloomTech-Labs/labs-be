import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import logger from "@shared/Logger";

import AssignmentsDao from "@daos/Canvas/AssignmentsDao";
import ModulesDao from "@daos/Canvas/ModulesDao";
import UsersDao from "@daos/Canvas/UsersDao";
import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";
import Assignment from "@entities/Assignment";
import Submission from "@entities/Submission";
import Module from "@entities/Module";
import {
  processCourseCompleted,
  processCourseModuleCompletion
} from "src/services/Canvas";

import { paramMissingError } from "@shared/constants";

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

const assignmentsDao = new AssignmentsDao();
const modulesDao = new ModulesDao();
const usersDao = new UsersDao();
const canvasCoursesDao = new CanvasCoursesDao();


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

  try {
    const modules: Module[] | null =
      await processCourseModuleCompletion(parseInt(courseId), lambdaId as string);
    return res.status(OK).json(modules);
  }
  catch (error) {
    return res.status(BAD_REQUEST).json(error);
  }
}


/**
 * Get whether a given Canvas course was completed by a given learner.
 * - A course is completed if all modules requiring completion are completed.
 * - We read which modules require completion from the "Labs - Courses" table in SMT.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getCourseCompleted(
  req: Request,
  res: Response
): Promise<Response> {
  const { courseId } = req.params;
  const { lambdaId } = req.query;
  
  if (!courseId || !lambdaId) {
    return res.status(BAD_REQUEST);
  }

  try {
    const completed: boolean =
      await processCourseCompleted(parseInt(courseId), lambdaId as string);
    return res.status(OK).json(completed);
  }
  catch (error) {
    return res.status(BAD_REQUEST).json(error);
  }
}