import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { join } from "path";
import fs from 'fs';
import logger from '@shared/Logger';
import util from 'util';

import StudentDao from '@daos/Airtable/StudentDao';
import CanvasCoursesDao from '@daos/Airtable/CanvasCoursesDao';
import ModulesDao from '@daos/Canvas/ModulesDao';
import { paramMissingError } from '@shared/constants';
import path from 'path/posix';
import SubmissionDao from '@daos/Canvas/SubmissionDao';

import Module, { IModule } from '@entities/Module';


const studentDao = new StudentDao();
const canvasCoursesDao = new CanvasCoursesDao();
const modulesDao = new ModulesDao();
const submissionDao = new SubmissionDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;


/**
 * Get a set of learners' student records from Airtable by their email.
 * 
 * @param learners
 * @returns 
 */
async function getStudentRecords(learners: Array<any>): Promise<Array<any>> {
  const emails = learners.map (learner => learner.Email);
  return await studentDao.getByEmails(emails);
}


 /**
 * Merge each learner's Lambda ID and Labs Role from their student record.
 * (Mutates learners array.)
 * 
 * @param learners
 * @returns 
 */
async function mergeStudentRecords(learners: Array<any>, studentRecords: any): Promise<Array<any>> {
  for (let learner of learners) {
    let airtableRecord = studentRecords.find ((elm : any) => elm.fields ['Email'] == learner ['Email']) // TODO: Type validation
    learner ['Lambda ID'] = airtableRecord.fields ['Lambda ID'];
    learner ['Labs Role'] = airtableRecord.fields ['Labs Role'];
  }

  return learners;
}


/**
 * Look up a learner's Objectives course ID in Airtable by their Labs role.
 * 
 * @param learner
 * @param labsRole
 * @returns 
 */
async function getObjectivesCourseId(learner: any, labsRole: string): Promise<number> {
  return await canvasCoursesDao.getObjectiveCourseByRole (learner ['Labs Role']);
}


/**
 * Get whether a sprint milestone in Canvas is marked complete.
 * 
 * @param courseId
 * @param assignmentId
 * @param learnerId
 * @returns 
 */
async function getMilestoneCompleted(courseId: number, assignmentId: number, learnerId: string) {
  const userSubmission = await submissionDao.getByAssignmentAndUser (
    courseId, assignmentId, learnerId
  );
  return userSubmission.grade === 'complete';
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
async function getMilestone(learnerId: string, eventType: string, courseId: number, module: IModule) {
  const moduleItems = await modulesDao.getItems (courseId, module.id);
  for (let item of (moduleItems || [])) {
    if (item.title.includes (eventType)) {
      const assignmentId = item ['content_id'];
      const points = (item ['completion_requirement'] || {}).min_score;
      const completed = await getMilestoneCompleted (courseId, assignmentId, learnerId);
      const milestone = { name: module.name, itemId: assignmentId, points, completed };

      return milestone;
    }
  }
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
async function getNextAssignment(learnerId: string, eventType: string, courseId: number, modules: Array<IModule> | null) {
let sprintMilestones = [];
  for (let module of (modules || [])) {
    if (module.name.match (/^Sprint [1-9]*$/)) { // Matches "Sprint #"
      // Get the relevant milestone from this module.
      const milestone = await getMilestone (learnerId, eventType, courseId, module);
      if (milestone) {
        sprintMilestones.push (milestone);
      }
    }
  }

  // Alphabetize sprintMilestones and check each for completion
  let nextAssignment = null;
  sprintMilestones.sort ((a, b) => a.name.localeCompare(b.name));
  for (let milestone of sprintMilestones) {
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
async function submitNextEventAttendance(learner: any, eventType: string) {

    // Look up this learner's Objectives course ID.
    const courseId = await getObjectivesCourseId (learner, learner ['Labs Role']);

    // Get that course's modules from Canvas.
    const modules = await modulesDao.getAllInCourse (courseId);

    // For each module, find the relevant assignment by name (e.g., has
    // "Stakeholder Meeting"), and get the first ungraded assignment.
    const nextAssignment = await getNextAssignment (learner ['Lambda Id'], eventType, courseId, modules);

    if (nextAssignment) {
      // Create a new submission for this assignment with grade = full points 
      await submissionDao.putOne (courseId, nextAssignment.itemId, learner ['Lambda ID'], nextAssignment.points);
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
 export async function processAttendance(eventType: string, eventDate: string, learners:Array<any>) {

  // Get each learner's student record from Airtable by their email.
  const studentRecords = await getStudentRecords (learners);

  // Merge each learner's Lambda ID and Labs Role from their student record.
  learners = await mergeStudentRecords (learners, studentRecords);

  // For each learner, submit the next open attendance slot in the Canvas
  // gradebook for the given event type.
  for (let learner of learners) {
    try {
      await submitNextEventAttendance (learner, eventType);
    } catch (e) {
      console.error (e);
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
 export async function putEventAttendance(req: Request, res: Response) {
  
  const { eventType, eventDate } = req.params;
  let learners : Array<any> = req.body; // TODO: Type validation

  await processAttendance (eventType, eventDate, learners);

  return res.status(OK).json(learners);
}
