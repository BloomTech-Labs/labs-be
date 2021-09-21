import StatusCodes from "http-status-codes";
import e, { Request, Response } from "express";
import { join } from "path";
import fs from "fs";
import logger from "@shared/Logger";
import path from "path/posix";
import util from "util";

import { FieldSet, Records } from "airtable";

import StudentDao from "@daos/Airtable/StudentDao";
import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";
import ModulesDao from "@daos/Canvas/ModulesDao";
import { paramMissingError } from "@shared/constants";
import SubmissionDao from "@daos/Canvas/SubmissionDao";
import Module from "@entities/Module";
import Submission from "@entities/Submission";
import ModuleItem from "@entities/ModuleItem";

const studentDao = new StudentDao();
const canvasCoursesDao = new CanvasCoursesDao();
const modulesDao = new ModulesDao();
const submissionDao = new SubmissionDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

interface IMilestone {
  name: string;
  itemId: number;
  points: number;
  completed: boolean;
}

/**
 * Get a set of learners' student records from Airtable by their email.
 *
 * @param learners
 * @returns
 */
async function getStudentRecords(
  learners: Record<string, unknown>[]
): Promise<Records<FieldSet>> {
  const emails: string[] = learners.map((learner) => learner.Email as string);
  return await studentDao.getByEmails(emails);
}

/**
 * Merge each learner's Lambda ID and Labs Role from their student record.
 * (Mutates learners array.)
 *
 * @param learners
 * @returns
 */
function mergeStudentRecords(
  learners: Record<string, unknown>[],
  studentRecords: Records<FieldSet>
): Record<string, unknown>[] {
  for (const learner of learners) {
    const airtableRecord = studentRecords.find(
      (elm) => elm.fields["Email"] == learner["Email"]
    );
    if (!airtableRecord) {
      learner["Lambda ID"] = null;
      learner["Labs Role"] = null;
    } else {
      learner["Lambda ID"] = airtableRecord.fields["Lambda ID"];
      learner["Labs Role"] = airtableRecord.fields["Labs Role"];
    }
  }

  return learners;
}

/**
 * Look up a learner's Objectives course ID in Airtable by their Labs role.
 *
 * @param labsRole
 * @returns
 */
async function getObjectivesCourseId(labsRole: string): Promise<number | null> {
  const courseId = await canvasCoursesDao.getObjectiveCourseIdByRole(labsRole);
  return courseId || null;
}

/**
 * Get whether a sprint milestone in Canvas is marked complete.
 *
 * @param courseId
 * @param assignmentId
 * @param learnerId
 * @returns
 */
async function getMilestoneCompleted(
  courseId: number,
  assignmentId: number,
  learnerId: string
): Promise<boolean | null> {
  const userSubmission = await submissionDao.getByAssignmentAndUser(
    courseId,
    assignmentId,
    learnerId
  );

  return userSubmission ? userSubmission.grade === "complete" : null;
}

/**
 * Get the assignment submission for the given event.
 *
 * @param learnerId
 * @param eventType
 * @param courseId
 * @param moduleId
 * @returns
 */
async function getMilestone(
  learnerId: string,
  eventType: string,
  courseId: number,
  module: Module
): Promise<IMilestone | null> {
  const moduleItems: ModuleItem[] = (await modulesDao.getItems(
    courseId,
    module.id
  )) as ModuleItem[];
  for (const item of moduleItems || []) {
    if (item.title.includes(eventType)) {
      const assignmentId = item["content_id"];
      const points = item["completion_requirement"]?.min_score;
      const completed = await getMilestoneCompleted(
        courseId,
        assignmentId,
        learnerId
      );
      // Defaulting to points=0, completed=false anticipating those values somehow
      // getting omitted even if we get an otherwise valid response object.
      const milestone: IMilestone = {
        name: module.name,
        itemId: assignmentId,
        points: points || 0,
        completed: completed || false,
      };

      return milestone;
    }
  }
  return null;
}

/**
 * Get the next ungraded assignment for a learner for a given event type from
 * their Objectives course in Canvas.
 *
 * @param learnerId
 * @param eventType
 * @param courseId
 * @param modules
 * @returns
 */
async function getNextAssignment(
  learnerId: string,
  eventType: string,
  courseId: number,
  modules: Array<Module> | null
) {
  const sprintMilestones = [];
  for (const module of modules || []) {
    if (/^Sprint [1-9]*$/.exec(module.name)) {
      // Matches "Sprint #"
      // Get the relevant milestone from this module.
      const milestone = await getMilestone(
        learnerId,
        eventType,
        courseId,
        module
      );
      if (milestone) {
        sprintMilestones.push(milestone);
      }
    }
  }

  // Alphabetize sprintMilestones and check each for completion
  let nextAssignment = null;
  sprintMilestones.sort((a, b) => a.name.localeCompare(b.name));
  for (const milestone of sprintMilestones) {
    if (!milestone.completed) {
      nextAssignment = milestone;
      break;
    }
  }

  return nextAssignment;
}

/**
 * Submit the next open slot for an event type's attendance in the Canvas
 * gradebook for the given learner.
 *
 * @param learner
 * @param eventType
 * @returns
 */
async function submitNextEventAttendance(
  lambdaId: string,
  labsRole: string,
  eventType: string
): Promise<void> {
  // Look up this learner's Objectives course ID.
  const courseId = await getObjectivesCourseId(labsRole);
  if (!courseId) {
    // eslint-disable-next-line no-console
    console.error(`Objectives course not found for role: ${labsRole}`);
    return;
  }

  // Get that course's modules from Canvas.
  const modules = await modulesDao.getAllInCourse(courseId);

  // For each module, find the relevant assignment by name (e.g., has
  // "Stakeholder Meeting"), and get the first ungraded assignment.
  const nextAssignment = await getNextAssignment(
    lambdaId,
    eventType,
    courseId,
    modules
  );

  if (nextAssignment) {
    // Create a new submission for this assignment with grade = full points
    await submissionDao.putOne(
      courseId,
      nextAssignment.itemId,
      lambdaId,
      nextAssignment.points
    );
  }
}

/**
 * Process attendance for the given event for the given learners by their
 * email addresses.
 *
 * @param eventType
 * @param eventDate
 * @param learners
 * @returns
 */
export async function processAttendance(
  eventType: string,
  eventDate: string,
  learners: Record<string, unknown>[]
): Promise<Record<string, unknown>[]> {
  // Get each learner's student record from Airtable by their email.
  const studentRecords = await getStudentRecords(learners);

  // Merge each learner's Lambda ID and Labs Role from their student record.
  learners = mergeStudentRecords(learners, studentRecords);

  // For each learner, submit the next open attendance slot in the Canvas
  // gradebook for the given event type.
  for (const learner of learners) {
    try {
      await submitNextEventAttendance(
        learner["Lambda ID"] as string,
        learner["Labs Role"] as string,
        eventType
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      continue;
    }
  }

  return learners;
}

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
