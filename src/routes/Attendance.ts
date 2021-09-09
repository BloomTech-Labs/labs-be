import StatusCodes from 'http-status-codes';
import { Request, Response } from 'express';
import { join } from "path";
import fs from 'fs';
import logger from '@shared/Logger';
import * as Papa from 'papaparse';
import util from 'util';

import StudentDao from '@daos/Airtable/StudentDao';
import CanvasCoursesDao from '@daos/Airtable/CanvasCoursesDao';
import ModulesDao from '@daos/Canvas/ModulesDao';
import { paramMissingError } from '@shared/constants';
import path from 'path/posix';
import SubmissionDao from '@daos/Canvas/SubmissionDao';


const studentDao = new StudentDao();
const canvasCoursesDao = new CanvasCoursesDao();
const modulesDao = new ModulesDao();
const submissionDao = new SubmissionDao();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;


/**
 * Process attendance for the given event for the given learners by their
 * email addresses.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
 export async function putEventAttendance(req: Request, res: Response) {
  
  const { eventType, eventDate } = req.params;
  const learners : Array<any> = req.body; // TODO: Type validation

  // Get each learner's Lambda ID and Labs Role from Airtable by their email.
  const emails = learners.map (learner => learner.Email);
  const airtableStudents : any = await studentDao.getByEmails(emails);

  for (let learner of learners) {

    let airtableRecord = airtableStudents.find ((elm : any) => elm.fields ['Email'] == learner ['Email']) // TODO: Type validation
    learner ['Lambda ID'] = airtableRecord.fields ['Lambda ID'];
    learner ['Labs Role'] = airtableRecord.fields ['Labs Role'];

    // Look up this learner's Objectives course ID.
    const courseId = await canvasCoursesDao.getObjectiveCourseByRole (learner ['Labs Role']);
    learner ['Objectives Course ID'] = courseId;

    // Get that course's modules from Canvas.
    const modules = await modulesDao.getAllInCourse (courseId);

    // For each module, find the relevant assignment in each module by name
    // (e.g. has "Stakeholder Meeting"), and get the first ungraded assignment.
    let sprintMilestones = [];
    for (let module of (modules || [])) {
      if (module.name.match (/^Sprint [1-9]*$/)) {
        // Get the relevant event assignment from this module
        const moduleItems = await modulesDao.getItems (courseId, module.id);
        for (let item of (moduleItems || [])) {
          if (item.title.includes (eventType)) {
            const id = item ['content_id'];
            const points = (item ['completion_requirement'] || {}).min_score;
            const userSubmission = await submissionDao.getByAssignmentAndUser (
              courseId, id, learner ['Lambda ID']
            );
            const completed = userSubmission.grade === 'complete';
            sprintMilestones.push ({ name: module.name, itemId: id, points, completed });
          }
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

    if (nextAssignment) {
      // Create a new submission for this assignment with grade = full points 
      submissionDao.putOne (courseId, nextAssignment.itemId, learner ['Lambda ID'], nextAssignment.points);
    }
  }


  return res.status(OK).json(learners);
}
