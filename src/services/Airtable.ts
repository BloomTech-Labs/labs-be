import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";

const canvasCoursesDao = new CanvasCoursesDao();

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