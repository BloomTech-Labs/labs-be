import AssignmentsDao from "@daos/Canvas/AssignmentsDao";
import ModulesDao from "@daos/Canvas/ModulesDao";
import UsersDao from "@daos/Canvas/UsersDao";
import CanvasCoursesDao from "@daos/Airtable/CanvasCoursesDao";
import CanvasUser from "@entities/CanvasUser";
import Module from "@entities/Module";
import ModuleCompletion from "@entities/ModuleCompletion";
import StudentDao from "@daos/Airtable/StudentDao";
import SubmissionDao from "@daos/Canvas/SubmissionDao";
import { CanvasError, isCanvasError } from "@entities/CanvasError";
import { hasOwnProperty } from "@shared/functions";

const assignmentsDao = new AssignmentsDao();
const submissionDao = new SubmissionDao();
const studentDao = new StudentDao();
const modulesDao = new ModulesDao();
const usersDao = new UsersDao();
const canvasCoursesDao = new CanvasCoursesDao();

/**
 * Get a user's Canvas ID by their SIS ID.
 *
 * @param userSisId
 * @returns
 */
export async function getUserIdBySisId(
  userSisId: string
): Promise<number | null> {
  const user: CanvasUser | null = await usersDao.getOneBySisId(userSisId);
  return user?.id || null;
}

/**
 * Get the required courses for a given learner.
 *
 * @param lambdaId
 * @returns
 */
export async function getRequiredCourses(
  lambdaId: string
): Promise<number[] | null> {
  // Get the learner's track
  const track = await studentDao.getTrack(lambdaId);
  if (!track) {
    throw new Error(`Track not found for learner ID: ${lambdaId}`);
  }

  // Get the learner's courses
  const courses = await canvasCoursesDao.getCoursesByTrack(track);

  return courses;
}

/**
 * Process completion information for one module in a given Canvas course.
 *
 * @param courseId
 * @param moduleId
 * @param lambdaId
 * @returns
 */
export async function processModuleCompletion(
  courseId: number,
  moduleId: number,
  lambdaId: string
): Promise<ModuleCompletion | null> {
  const module: Module | CanvasError | null = await modulesDao.getCompletion(
    courseId,
    moduleId,
    lambdaId
  );

  if (isCanvasError(module)) {
    console.error(module);
    return null;
  }

  const moduleCompletion = module
    ? new ModuleCompletion(
        module.id,
        module.name,
        module.state === "completed",
        module.completed_at || undefined
      )
    : null;

  return moduleCompletion;
}

/**
 * Process completion information for all modules in a given Canvas course.
 *
 * @param courseId
 * @param lambdaId
 * @returns
 */
export async function processCourseModuleCompletion(
  courseId: number,
  lambdaId: string
): Promise<ModuleCompletion[] | null> {
  console.log(courseId, lambdaId);
  const modules: Module[] | CanvasError | null =
    await modulesDao.getAllCompletionInCourse(courseId, lambdaId);

  if (isCanvasError(modules)) {
    console.error(modules);
    return null;
  }

  const moduleCompletion = modules?.map((module) => {
    return new ModuleCompletion(
      module.id,
      module.name,
      module.state === "completed",
      module.completed_at || undefined
    );
  });

  return moduleCompletion || null;
}

/**
 * Process whether a given Canvas assignment was completed by a given learner.
 * Returns true if the learner met the completion criteria for the assignment.
 *
 * @param courseId
 * @param moduleId
 * @param assignmentId
 * @param lambdaId
 * @returns
 */
export async function assignmentCompleted(
  courseId: number,
  moduleId: number,
  assignmentId: number,
  lambdaId: string
): Promise<boolean> {
  try {
    // List the module items for this assignment's module and find the module item ID
    // for this assignment along with completion criteria.
    const moduleItems = await modulesDao.getItems(courseId, moduleId, lambdaId);
    if (!moduleItems || isCanvasError(moduleItems)) {
      throw new Error("No module items found for the given module ID.");
    }
    const moduleItem = moduleItems.find((x) => x.content_id === assignmentId);
    if (!moduleItem) {
      throw new Error(
        `No module item found for the given assignment ID ${assignmentId}`
      );
    }

    // Check whether the item was completed.
    return moduleItem.completion_requirement?.completed;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Process whether a given Canvas module item was completed by a given learner.
 * Returns true if the learner met the completion criteria for the module item.
 *
 * @param courseId
 * @param moduleId
 * @param moduleItemId
 * @param lambdaId
 * @returns
 */
export async function moduleItemCompleted(
  courseId: number,
  moduleId: number,
  moduleItemId: number,
  lambdaId: string
): Promise<boolean> {
  try {
    // Get the module item from Canvas along with completion criteria.
    const moduleItem = await modulesDao.getItem(
      courseId,
      moduleId,
      moduleItemId,
      lambdaId
    );
    if (!moduleItem || isCanvasError(moduleItem)) {
      throw new Error(
        `No module item found for module item ID ${moduleItemId} in course ${courseId} for learner ${lambdaId}`
      );
    }

    // Check whether the module item was completed.
    return moduleItem.completion_requirement.completed;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Process whether a given Canvas course was completed by a given learner.
 *
 * @param courseId
 * @param lambdaId
 * @returns
 */
export async function processCourseCompleted(
  courseId: number,
  lambdaId: string
): Promise<boolean> {
  try {
    // Get all modules from the course along with completion information.
    const modules: ModuleCompletion[] | null =
      await processCourseModuleCompletion(courseId, lambdaId);
    if (!modules) {
      //return false;
      throw new Error(
        `No course modules found for course ${courseId} and learner ${lambdaId}`
      );
    }

    // Get which modules must be completed from Airtable (SMT: "Labs - Courses")
    const completionModuleIds: number[] | null =
      await canvasCoursesDao.getCompletionModules(courseId);

    // Check if all modules that need to be completed have been completed.
    for (const completionModuleId of completionModuleIds || []) {
      const module = modules.find((x) => x.id === completionModuleId);
      if (!module?.completed) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * Process whether all required Canvas courses have been completed by a given learner.
 *
 * @param lambdaId
 * @returns
 */
export async function processAllRequiredCoursesCompleted(
  lambdaId: string
): Promise<boolean> {
  try {
    // Get which courses must be completed for this learner.
    const courseIds: number[] | null = await getRequiredCourses(lambdaId);

    for (const courseId of courseIds || []) {
      // Get all modules from the course along with completion information.
      const modules: ModuleCompletion[] | null =
        await processCourseModuleCompletion(courseId, lambdaId);
      if (!modules) {
        throw new Error(
          `No course modules found for course ${courseId} and learner ${lambdaId}`
        );
      }

      // Get which modules must be completed from Airtable (SMT: "Labs - Courses")
      const completionModuleIds: number[] | null =
        await canvasCoursesDao.getCompletionModules(courseId);

      // Check if all modules that need to be completed have been completed.
      for (const completionModuleId of completionModuleIds || []) {
        const module = modules.find((x) => x.id === completionModuleId);
        if (!module?.completed) {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    return Promise.reject(error);
  }
}
