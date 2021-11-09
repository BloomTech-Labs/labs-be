
export enum ObjectiveType {
  Course = "Course",
  Meetings = "Meetings",
  PullRequests = "Pull Requests",
  Other = "Other",
}

export enum SprintMilestoneType {
  Module = "Module",
  Assignments = "Assignments",
  Meetings = "Meetings",
  PullRequests = "Pull Requests",
  Other = "Other",
}

export class Objective {
  public id: string;
  public name: string;
  public type: ObjectiveType;
  // If this is a course-type objective, the course ID
  public course: string | null;
  public points: number;
  public sprintMilestones: SprintMilestone[];

  constructor(
    id: string,
    name: string,
    type: ObjectiveType,
    course: string | null,
    points: number,
    sprintMilestones: SprintMilestone[],
  ) {
    this.id = id;
    this.name = name,
    this.type = type,
    this.course = course,
    this.points = points,
    this.sprintMilestones = sprintMilestones
  }

  public completed(): boolean {

    return false;
  }
}

export class SprintMilestone {
  public id: string;
  public name: string;
  public type: SprintMilestoneType;
  // If this is a module-type objective, the course ID associated with the module
  public course: string | null;
  // If this is a module-type objective, the module ID
  public module: string | null;
  // If this is an assignment-type objective, the assignment IDs
  public assignments: string[] | [];
  public points: number;
  public sprint: number;

  constructor(
    id: string,
    name: string,
    type: SprintMilestoneType,
    course: string | null,
    module: string | null,
    assignments: string[] | [],
    points: number,
    sprint: number,
  ) {
    this.id = id;
    this.name = name,
    this.type = type,
    this.course = course,
    this.module = module,
    this.assignments = assignments,
    this.points = points,
    this.sprint = sprint
  }

  public completed(): boolean {
    
    return false;
  }
}
