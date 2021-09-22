import AssignmentsDao from "@daos/Canvas/AssignmentsDao";
import ModulesDao from "@daos/Canvas/ModulesDao";
import UsersDao from "@daos/Canvas/UsersDao";
import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";
import CanvasUser from "@entities/CanvasUser";
import Module from "@entities/Module";

const assignmentsDao = new AssignmentsDao();
const modulesDao = new ModulesDao();
const usersDao = new UsersDao();
const canvasCoursesDao = new CanvasCoursesDao();

/**
 * Get a user's Canvas ID by their SIS ID.
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