import { FieldSet, Records } from "airtable";
import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";
import ProjectsDao from "@daos/Airtable/ProjectsDao";
import StudentDao from "@daos/Airtable/StudentDao";


const canvasCoursesDao = new CanvasCoursesDao();
const projectsDao = new ProjectsDao();
const studentDao = new StudentDao();

/**
 * Look up the course IDs of "General" courses (courses all Labs learners must complete).
 *
 * @returns
 */
export async function getGeneralCourseIds(): Promise<number[] | null> {
  const courseIds: number[] | null = await canvasCoursesDao.getGeneralCourseIds();
  return courseIds;
}

/**
 * Look up a learner's Objectives course ID in Airtable by their Labs role.
 *
 * @param labsRole
 * @returns
 */
export async function getObjectivesCourseId(labsRole: string): Promise<number | null> {
  const courseId = await canvasCoursesDao.getObjectiveCourseIdByRole(labsRole);
  return courseId || null;
}

/**
 * Look up all Labs Application role quiz IDs.
 *
 * @returns
 */
export async function getRoleQuizIds(): Promise<Record<string, number>[] | null> {
  const roleQuizzes = await canvasCoursesDao.getRoleQuizIds() ;
  return roleQuizzes || null;
}


/**
 * Look up the Labs Application "Final Application" quiz IDs.
 *
 * @returns
 */
export async function getFinalApplicationQuizIds(): Promise<Record<string, number>> {
  const finalQuizzes =
    await canvasCoursesDao.getFinalApplicationQuizIds() as Record<string, number>;
  return finalQuizzes;
}


/**
 * Look up a learner's Lambda ID in Airtable by their Airtable record ID.
 *
 * @param recordId
 * @returns
 */
export async function getLambdaId(recordId: string): Promise<string | null> {
  const student = await studentDao.getByRecordId(recordId);
  const lambdaId = ((student || {}) ["Lambda ID"] as string[]) [0];
  return lambdaId || null;
}
