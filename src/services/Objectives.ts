import StudentDao from "@daos/Airtable/StudentDao";
import { Objective, SprintMilestone } from "@entities/Objective";
import ObjectivesDao from "@daos/Airtable/ObjectivesDao";
import SubmissionDao from "@daos/Canvas/SubmissionDao";
import ModulesDao from "@daos/Canvas/ModulesDao";
import Airtable, { FieldSet } from "airtable";
import Module from "@entities/Module";

const modulesDao = new ModulesDao();
const objectivesDao = new ObjectivesDao();
const submissionDao = new SubmissionDao();
const studentDao = new StudentDao();

/**
 *  Update the given objective score for the given learner in Canvas.
 *
 *  @param objective Objective
 *  @param moduleId string
 *  @param lambdaId string
 *  @returns
 */
export async function putObjectiveScore(
  objective: Objective,
  moduleId: number,
  lambdaId: string
): Promise<void> {
  // Get the assignment ID from the Graduation Objectives module by name.
  const moduleItems = await modulesDao.getItems(
    objective.objectivesCourse,
    moduleId,
    lambdaId
  );
  if (!moduleItems) {
    throw new Error(
      `No module items found for module ${moduleId} in course ${objective.objectivesCourse}`
    );
  }
  const moduleItem = moduleItems?.find((x) => x.title === objective.name);
  if (!moduleItem) {
    throw new Error(
      `No module item found for objective ${objective.id} for module ${moduleId} in course ${objective.objectivesCourse}`
    );
  }
  const assignmentId = moduleItem?.content_id;
  if (!assignmentId) {
    throw new Error(
      `Assignment not found for objective ${objective.id} in module ${moduleId} in course ${objective.objectivesCourse}`
    );
  }
  const points = moduleItem?.completion_requirement.min_score;
  if (points === undefined || points === null) {
    throw new Error(
      `Could not read points possible for assignment ${assignmentId} in module ${moduleId} in course ${objective.objectivesCourse}`
    );
  }

  // Put a submission for the assignment in Canvas.
  await submissionDao.putOne(
    objective.objectivesCourse,
    assignmentId,
    lambdaId,
    points
  );
}

/**
 *  Update the given sprint milestone score for the given learner in Canvas.
 *
 *  @param objective Objective
 *  @param moduleId string
 *  @param lambdaId string
 *  @returns
 */
export async function putSprintMilestoneScore(
  sprintMilestone: SprintMilestone,
  moduleId: number,
  lambdaId: string
): Promise<void> {
  // Get the assignment ID from the sprint module by name.
  const moduleItems = await modulesDao.getItems(
    sprintMilestone.objectivesCourse,
    moduleId,
    lambdaId
  );
  if (!moduleItems || !moduleItems.find) {
    throw new Error(
      `No module items found for module ${moduleId} in course ${sprintMilestone.objectivesCourse}`
    );
  }
  const moduleItem = moduleItems?.find((x) => x.title === sprintMilestone.name);
  if (!moduleItem) {
    throw new Error(
      `No module item found for milestone ${sprintMilestone.id} for module ${moduleId} in course ${sprintMilestone.objectivesCourse}`
    );
  }
  const assignmentId = moduleItem?.content_id;
  if (!assignmentId) {
    throw new Error(
      `Assignment not found for objective ${sprintMilestone.id} in module ${moduleId} in course ${sprintMilestone.objectivesCourse}`
    );
  }
  const points = moduleItem?.completion_requirement.min_score;
  if (points === undefined || points === null) {
    throw new Error(
      `Could not read points possible for assignment ${assignmentId} in module ${moduleId} in course ${sprintMilestone.objectivesCourse}`
    );
  }

  // Put a submission for the assignment in Canvas.
  await submissionDao.putOne(
    sprintMilestone.objectivesCourse,
    assignmentId,
    lambdaId,
    points
  );
}

/**
 *  Update all specified objectives and sprint milestones for the given learner
 *  in Canvas.
 *
 *  @param objectives Objective[]
 *  @param moduleIds number[]
 *  @param lambdaId string
 *  @returns
 */
export async function updateScores(
  objectives: Objective[],
  moduleIds: number[],
  lambdaId: string
): Promise<void> {
  // Update the scores for each objective and sprint milestone in Canvas.
  for (const objective of objectives) {
    if (objective.completed) {
      await putObjectiveScore(objective, moduleIds[0], lambdaId);
    }
    for (const milestone of objective.sprintMilestones) {
      if (milestone.completed) {
        await putSprintMilestoneScore(
          milestone,
          moduleIds[milestone.sprint],
          lambdaId
        );
      }
    }
  }
}

/**
 *  Get an array of Module IDs from the modules of an objective course of the form:
 *
 *  [0] = Graduation Objectives Module
 *  [1] = Sprint 1 Milestones Module
 *  ...
 *
 *  @param modules
 *  @param objectivesCourse
 *  @returns
 */
export function getObjectivesCourseModuleIds(
  modules: Module[],
  objectivesCourse: number
): number[] {
  const moduleIds: (number | undefined)[] = [];

  moduleIds[0] = modules.find((x) =>
    x.name.includes("Graduation Objectives")
  )?.id;
  for (const module of modules) {
    // Match "Sprint #"
    const match = /^Sprint ([0-9]*)$/.exec(module.name);
    if (match) {
      moduleIds[Number.parseInt(match[1])] = module.id;
    }
  }

  for (const moduleId of moduleIds) {
    if (!moduleId) {
      throw new Error(
        `Undefined module ID for objectives or sprint milestones for objectives course ${objectivesCourse}`
      );
    }
  }

  return moduleIds as number[];
}

/**
 *  Evaluate the given learner's progress toward their objectives and sprint milestones
 *  using the built-in method on each objective and milestone object. Mutates the passed
 *  objectives array.
 *
 *  Optionally pass in any progress already evaluated for completion—this function will
 *  skip evaluation for any objectives (and all contained sprint milestones) present, and
 *  return both sets of objectives merged together.
 *
 *  @param lambdaId
 *  @param objectives
 *  @param incomingObjectiveData?
 *  @returns
 */
export async function evaluateCompletion(
  lambdaId: string,
  objectives: Objective[],
  incomingObjectiveData?: Objective[]
): Promise<Objective[]> {
  // Add any existing progress to the objectives array.
  if (incomingObjectiveData) {
    for (const _objective of incomingObjectiveData) {
      const index = objectives.findIndex((x) => x.id === _objective.id);
      objectives[index] = _objective;
    }
  }

  // Evaluate completion, skipping any that were already evaluated.
  for (const objective of objectives) {
    if (incomingObjectiveData?.find((x) => x.id === objective.id)) {
      continue;
    }
    await objective.getCompleted(lambdaId);
    for (const sprintMilestone of objective.sprintMilestones) {
      await sprintMilestone.getCompleted(lambdaId);
    }
  }

  return objectives;
}

/**
 *  Get the given learner's progress toward their objectives and sprint milestones.
 *
 *  @param lambdaId
 *  @returns
 */
export async function getProgress(lambdaId: string): Promise<Objective[]> {
  let objectives = await objectivesDao.getAll();

  // Get the learner's role
  const labsRole = (await studentDao.getRole(lambdaId)) as string;
  if (!labsRole) {
    throw new Error(`Labs Role not found for learner ID: ${lambdaId}`);
  }

  // Filter objectives list by this learer's role.
  objectives = objectives.filter((x) => x.role[0] === labsRole);

  // Evaluate completion for this learner's objectives and sprint milestones.
  objectives = await evaluateCompletion(lambdaId, objectives);

  return objectives;
}

/**
 *  Update the given learner's progress toward their objectives and sprint milestones
 *  in their Objectives course in Canvas.
 *
 *  @param lambdaId
 *  @returns
 */
export async function putProgress(lambdaId: string): Promise<Objective[]> {
  const objectives = await getProgress(lambdaId);

  if (!objectives || !objectives.length) {
    throw new Error(`No objectives found for learner ${lambdaId}`);
  }

  // Get the modules from this learner's Objectives course.
  const objectivesCourse = objectives[0].objectivesCourse;
  const modules = await modulesDao.getAllInCourse(objectivesCourse);
  if (!modules || !modules.length) {
    throw new Error(
      `No modules found for objectives course ${objectivesCourse} for learner ${lambdaId}`
    );
  }

  // Get the module IDs for the objectives and each sprint's milestones
  const moduleIds = getObjectivesCourseModuleIds(modules, objectivesCourse);

  // Update the scores for each objective and sprint milestone in Canvas.
  await updateScores(objectives, moduleIds, lambdaId);

  return objectives;
}

/**
 *  For an entire cohort, get all learners' progress toward all their objectives
 *  and sprint milestones. Optionally pass in any progress already retrieved.
 *
 *  @param cohortId
 *  @param progress?
 *  @returns
 */
export async function getCohortProgress(
  cohortId: string,
  incomingObjectiveData?: Record<string, Objective[]>
): Promise<Record<string, Objective[]>> {
  const cohortProgress: Record<string, Objective[]> = {};

  // Get all objectives
  const objectives = await objectivesDao.getAll();

  // Get all learners in this cohort (from cohort view in SMT.Students)
  const learners = await studentDao.getCohort(cohortId);

  // For each learner:
  for (const learner of learners) {
    const lambdaIds = learner.fields["Lambda ID"] as string[];
    const lambdaId = lambdaIds[0] || "";

    // Get their objectives.
    const roleList = learner.fields["Labs Role"] as string[];
    const role = roleList && roleList.length ? roleList[0] : null;
    if (!role) {
      continue;
    }
    let learnerObjectives = objectives.filter((x) => x.role === role);

    // Evaluate completion for their objectives and sprint milestones.
    learnerObjectives = await evaluateCompletion(
      lambdaId,
      learnerObjectives,
      (incomingObjectiveData || {})[lambdaId]
    );

    // Add a record to the 'cohortProgress' object with their Lambda ID as the key
    // and an array of their objectives as the value.
    cohortProgress[lambdaId] = learnerObjectives;
  }

  return cohortProgress;
}

/**
 *  For an entire cohort, put all learners' progress toward all their objectives
 *  and sprint milestones to their Objectives courses in Canvas.
 *
 *  @param cohortId
 *  @param progress?
 *  @returns
 */
export async function putCohortProgress(
  cohortId: string,
  incomingObjectiveData?: Record<string, Objective[]>
): Promise<Record<string, Objective[]>> {
  const cohortProgress = await getCohortProgress(
    cohortId,
    incomingObjectiveData
  );

  // Memoize Canvas data locally to avoid duplicating API calls
  const objectivesMemo: Record<number, Module[]> = {}; // { objectivesCourse, modules }

  // For each learner:
  for (const [lambdaId, objectives] of Object.entries(cohortProgress)) {
    // Get the modules from this learner's Objectives course.
    const objectivesCourse = objectives[0].objectivesCourse;
    const modules =
      objectivesMemo[objectivesCourse] ||
      (await modulesDao.getAllInCourse(objectivesCourse));
    if (!modules || !modules.length) {
      throw new Error(
        `No modules found for objectives course ${objectivesCourse} for learner ${lambdaId}`
      );
    }

    // Get the module IDs for the objectives and each sprint's milestones
    const moduleIds = getObjectivesCourseModuleIds(modules, objectivesCourse);

    // Update the scores for each objective and sprint milestone in Canvas.
    await updateScores(objectives, moduleIds, lambdaId);
  }

  return cohortProgress;
}
