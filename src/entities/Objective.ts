import {
  assignmentCompleted,
  moduleItemCompleted,
  processCourseCompleted,
  processModuleCompletion,
} from "@services/Canvas";

export enum ObjectiveType {
  Course = "Course",
  Meetings = "Meetings",
  PullRequests = "Pull Requests",
  Searchlight = "Searchlight",
  Other = "Other",
}

export enum SprintMilestoneType {
  Assignments = "Assignments",
  Meetings = "Meetings",
  Module = "Module",
  Page = "Page",
  PullRequests = "Pull Requests",
  Searchlight = "Searchlight",
  Other = "Other",
}

export class Objective {
  public id: string;
  public role: string;
  public name: string;
  public type: ObjectiveType;
  // If this is a course-type objective, the course ID
  public course: number | null;
  public points: number;
  public sprintMilestones: SprintMilestone[];
  public completed: boolean | null;
  public objectivesCourse: number;
  // public objectiveAssignment: number | null;

  constructor(
    id: string,
    role: string,
    name: string,
    type: ObjectiveType,
    course: number | null,
    points: number,
    sprintMilestones: SprintMilestone[] | [],
    objectivesCourse: number
    // objectiveAssignment?: number
  ) {
    this.id = id;
    this.role = role;
    this.name = name;
    this.type = type;
    this.course = course;
    this.points = points;
    this.sprintMilestones = sprintMilestones;
    this.completed = null;
    this.objectivesCourse = objectivesCourse;
    // this.objectiveAssignment = objectiveAssignment || null;
  }

  /**
   * Evaluate whether the given learner has completed this objective.
   *
   * @param lambdaId
   * @returns
   */
  public async getCompleted(lambdaId: string): Promise<boolean | null> {
    // Course
    if (this.type === ObjectiveType.Course) {
      if (!this.course) {
        throw new Error(`No defined Course ID for objective ${this.id}`);
      }
      this.completed = await processCourseCompleted(this.course, lambdaId);
      return this.completed;

      // Meetings
    } else if (this.type === ObjectiveType.Meetings) {
      // TODO
      this.completed = null;

      // Pull Requests
    } else if (this.type === ObjectiveType.PullRequests) {
      // TODO
      this.completed = null;

      // Searchlight
    } else if (this.type === ObjectiveType.Searchlight) {
      // TODO
      this.completed = null;

      // Other
    } else if (this.type === ObjectiveType.Other) {
      // TODO
      this.completed = null;
    }

    return this.completed;
  }
}

export class SprintMilestone {
  public id: string;
  public name: string;
  public objective: string;
  public type: SprintMilestoneType;
  // If this is a module-type milestone, the course ID associated with the module
  public course: number | null;
  // The module ID is required to get Canvas completion criteria for module-,
  // assignments-, and page-type milestones
  public module: number | null;
  // If this is an assignment-type milestone, the assignment IDs
  public assignments: number[] | [] | null;
  // If this is an page-type milestone, the module item ID
  public moduleItemId: number | null;
  public points: number;
  public sprint: number;
  public objectivesCourse: number;
  // public milestoneAssignment: number | null;
  public completed: boolean | null;

  constructor(
    id: string,
    name: string,
    objective: string,
    type: SprintMilestoneType,
    course: number | null,
    module: number | null,
    assignments: string | number[] | [] | null,
    moduleItemId: number | null,
    points: number,
    sprint: number,
    objectivesCourse: number
  ) {
    this.id = id;
    this.name = name;
    this.objective = objective;
    this.type = type;
    this.course = course;
    this.module = module;
    if (!assignments) {
      this.assignments = [];
    } else if (Array.isArray(assignments)) {
      this.assignments = assignments;
    } else {
      this.assignments = JSON.parse(assignments) as number[];
    }
    this.moduleItemId = moduleItemId;
    this.points = points;
    this.sprint = sprint;
    this.objectivesCourse = objectivesCourse;
    this.completed = null;
  }

  /**
   * Evaluate whether the given learner has completed this milestone.
   *
   * @param lambdaId
   * @returns
   */
  public async getCompleted(lambdaId: string): Promise<boolean | null> {
    // Assignments
    if (this.type === SprintMilestoneType.Assignments) {
      if (!this.course) {
        throw new Error(`No defined Course ID for milestone ${this.id}`);
      }
      if (!this.module) {
        throw new Error(`No defined Module ID for milestone ${this.id}`);
      }
      if (!this.assignments) {
        throw new Error(`No defined Course ID for milestone ${this.id}`);
      }
      for (const assignment of this.assignments) {
        const complete = await assignmentCompleted(
          this.course,
          this.module,
          assignment,
          lambdaId
        );
        if (!complete) {
          this.completed = false;
          return this.completed;
        }
      }
      this.completed = true;
      return this.completed;

      // Meetings
    } else if (this.type === SprintMilestoneType.Meetings) {
      // TODO
      this.completed = null;

      // Module
    } else if (this.type === SprintMilestoneType.Module) {
      if (!this.course) {
        throw new Error(`No defined Course ID for milestone ${this.id}`);
      }
      if (!this.module) {
        throw new Error(`No defined Module ID for milestone ${this.id}`);
      }
      const moduleCompletion = await processModuleCompletion(
        this.course,
        this.module,
        lambdaId
      );
      if (!moduleCompletion) {
        throw new Error(
          `No completion information found for module ${this.module} for milestone ${this.id}`
        );
      }
      this.completed = moduleCompletion.completed;
      return this.completed;

      // Page
    } else if (this.type === SprintMilestoneType.Page) {
      if (!this.course) {
        throw new Error(`No defined Course ID for milestone ${this.id}`);
      }
      if (!this.module) {
        throw new Error(`No defined Module ID for milestone ${this.id}`);
      }
      if (!this.moduleItemId) {
        throw new Error(`No defined Module Item ID for milestone ${this.id}`);
      }
      this.completed = await moduleItemCompleted(
        this.course,
        this.module,
        this.moduleItemId,
        lambdaId
      );
      return this.completed;

      // Pull Requests
    } else if (this.type === SprintMilestoneType.PullRequests) {
      // TODO
      this.completed = null;

      // Searchlight
    } else if (this.type === SprintMilestoneType.Searchlight) {
      // TODO
      this.completed = null;

      // Other
    } else if (this.type === SprintMilestoneType.Other) {
      // TODO
      this.completed = null;
    }

    return this.completed;
  }
}
