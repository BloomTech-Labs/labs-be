import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import logger from "@shared/Logger";

import AssignmentsDao from "@daos/Canvas/AssignmentsDao";
import { paramMissingError } from "@shared/constants";
import Assignment from "@entities/Assignment";
import Submission from "@entities/Submission";

const assignmentsDao = new AssignmentsDao();
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
