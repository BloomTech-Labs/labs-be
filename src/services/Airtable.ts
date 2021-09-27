import { FieldSet, Records } from "airtable";
import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";
import ProjectsDao from "@daos/Airtable/ProjectsDao";


const canvasCoursesDao = new CanvasCoursesDao();
const projectsDao = new ProjectsDao();

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
  const roleQuizzes = await canvasCoursesDao.getRoleQuizIds() as Record<string, number>[];
  return roleQuizzes || null;
}


/**
 * Look up the Labs Application "Final Application" quiz IDs.
 *
 * @returns
 */
export async function getFinalApplicationQuizIds(): Promise<Record<string, number>> {
  const finalQuizzes = await canvasCoursesDao.getFinalApplicationQuizIds() as Record<string, number>;
  return finalQuizzes;
}