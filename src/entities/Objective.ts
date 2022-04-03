import {
  assignmentCompleted,
  moduleItemCompleted,
  processCourseCompleted,
  processModuleCompletion,
} from "@services/Canvas";
import { Track } from "./TeambuildingOutput";

export enum ObjectiveType {
  Course = "Course",
  PullRequests = "Pull Requests",
  Other = "Other",
}

export enum SprintMilestoneType {
  Assignments = "Assignments",
  Module = "Module",
  Page = "Page",
  PullRequests = "Pull Requests",
  Other = "Other",
}

export class Objective {
  public id: string;
  public name: string;
  public type: ObjectiveType;
  public tracks: Track[];
  // If this is a course-type objective, the course ID
  public course: number | null;
  public points: number;
  public sprintMilestones: SprintMilestone[];
  public completed: boolean | null;
  public objectivesCourse: number;

  constructor(
    id: string,
    name: string,
    type: ObjectiveType,
    tracks: Track[],
    course: number | null,
    points: number,
    sprintMilestones: SprintMilestone[] | [],
    objectivesCourse: number
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.tracks = tracks;
    this.course = course;
    this.points = points;
    this.sprintMilestones = sprintMilestones;
    this.completed = null;
    this.objectivesCourse = objectivesCourse;
  }

  /**
   * Evaluate whether the given learner has completed this objective.
   *
   * @param lambdaId
   * @returns
   */
  public async getCompleted(lambdaId: string): Promise<boolean | null> {
    switch (this.type) {
      // Course
      case ObjectiveType.Course: {
        if (!this.course) {
          throw new Error(`No defined Course ID for objective ${this.id}`);
        }
        this.completed = await processCourseCompleted(this.course, lambdaId);
        return this.completed;
      }

      // Pull Requests
      case ObjectiveType.PullRequests: {
        this.completed = null;
        return this.completed;
      }

      // Other
      case ObjectiveType.Other: {
        this.completed = null;
        return this.completed;
      }

      default: {
        this.completed = null;
        return this.completed;
      }
    }
  }
}

export class SprintMilestone {
  public id: string;
  public name: string;
  public objective: string;
  public type: SprintMilestoneType;
  public tracks: Track[];
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
  public completed: boolean | null;

  constructor(
    id: string,
    name: string,
    objective: string,
    type: SprintMilestoneType,
    tracks: Track[],
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
    this.tracks = tracks;
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
    switch (this.type) {
      // Assignments
      case SprintMilestoneType.Assignments: {
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
      }

      // Module
      case SprintMilestoneType.Module: {
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
      }

      // Page
      case SprintMilestoneType.Page: {
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
      }

      // Pull Requests
      case SprintMilestoneType.PullRequests: {
        this.completed = null;
        return this.completed;
      }

      // Other
      case SprintMilestoneType.Other: {
        this.completed = null;
        return this.completed;
      }

      default: {
        this.completed = null;
        return this.completed;
      }
    }
  }
}
