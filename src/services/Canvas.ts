import AssignmentsDao from "@daos/Canvas/AssignmentsDao";
import ModulesDao from "@daos/Canvas/ModulesDao";
import UsersDao from "@daos/Canvas/UsersDao";
import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";
import CanvasUser from "@entities/CanvasUser";
import Module from "@entities/Module";
import ModuleCompletion from "@entities/ModuleCompletion";

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
 * Process completion information for one module in a given Canvas course.
 *
 * @param courseId
 * @param moduleId
 * @param lambdaId
 * @returns
 */
export async function processModuleCompletion (
  courseId: number,
  moduleId: number,
  lambdaId: string
): Promise<ModuleCompletion | null> {
  const userId : number | null = await getUserIdBySisId (lambdaId);

  if (!userId) {
    return Promise.reject ("Canvas user ID not found for that SIS ID.")
  }

  const module: Module | null =
    await modulesDao.getCompletion(courseId, moduleId, userId);

  const moduleCompletion = module ? new ModuleCompletion (
    module.id,
    module.name,
    module.state === "completed",
    module.completed_at || undefined
  ) : null;

  return moduleCompletion;
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
): Promise<ModuleCompletion[] | null> {
  const userId : number | null = await getUserIdBySisId (lambdaId);

  if (!userId) {
    return Promise.reject ("Canvas user ID not found for that SIS ID.")
  }

  const modules: Module[] | null =
    await modulesDao.getAllCompletionInCourse(courseId, userId);

  const moduleCompletion = modules?.map (module => { return new ModuleCompletion (
    module.id,
    module.name,
    module.state === "completed",
    module.completed_at || undefined
  )});

  return moduleCompletion || null;
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
    const modules: ModuleCompletion[] | null =
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
      if (!module?.completed) {
        return false;
      }
    }
    
    return true;

  } catch (error) {
    return Promise.reject (error);
  }
}