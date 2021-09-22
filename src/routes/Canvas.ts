import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import logger from "@shared/Logger";

import AssignmentsDao from "@daos/Canvas/AssignmentsDao";
import ModulesDao from "@daos/Canvas/ModulesDao";
import UsersDao from "@daos/Canvas/UsersDao";
import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";
import { paramMissingError } from "@shared/constants";
import Assignment from "@entities/Assignment";
import Submission from "@entities/Submission";
import Module from "@entities/Module";
import CanvasUser from "@entities/CanvasUser";

const assignmentsDao = new AssignmentsDao();
const modulesDao = new ModulesDao();
const usersDao = new UsersDao();
const canvasCoursesDao = new CanvasCoursesDao();
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
 * Process completion information for all modules in a given Canvas course.
 * TODO: Move to a service layer
 *
 * @param courseId
 * @param lambdaId
 * @returns
 */
export async function processCourseModuleCompletion (
  courseId: number,
  lambdaId: string
): Promise<Module[] | null> {
  const userId : number | null = await getUserIdBySisId (lambdaId);

  if (!userId) {
    return Promise.reject ("Canvas user ID not found for that SIS ID.")
  }

  const modules: Module[] | null = await modulesDao.getAllCompletionInCourse(
    courseId, userId
  );

  return modules;
}


/**
 * Process whether a given Canvas course was completed by a given learner.
 * TODO: Move to a service layer
 *
 * @param courseId
 * @param lambdaId
 * @returns
 */
export async function processCourseCompleted (
  courseId: number,
  lambdaId: string
): Promise<boolean> {
  try {

    // Get all modules from the course along with completion information.
    const modules: Module[] | null =
      await processCourseModuleCompletion(courseId, lambdaId);
    if (!modules) {
      throw new Error ("No course modules found.");
    }

    // Get which modules must be completed from Airtable (SMT: "Labs - Courses")
    const completionModuleIds: number[] | null =
      await canvasCoursesDao.getCompletionModules(courseId);

    // Check if all modules that need to be completed have been completed.
    for (const completionModuleId of completionModuleIds || []) {
      const module = modules.find(x => x.id === completionModuleId);
      if (module?.state !== "completed") {
        return false;
      }
    }
    
    return true;

  } catch (error) {
    return Promise.reject (error);
  }
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