import Assignment from "@entities/Assignment";
import CanvasClient from "@daos/Canvas/client";
import { SubmissionArrayResponse } from "./SubmissionDao";

export type AssignmentResponse = Promise<Assignment | null>;
export type AssignmentArrayResponse = Promise<Assignment[] | null>;

export interface IAssignmentsDao {
  getOne: (courseId: number, assignmentId: number) => AssignmentResponse;
  getAll: (courseId: number) => AssignmentArrayResponse;
  getSubmissions: (
    courseId: number,
    assignmentId: number
  ) => SubmissionArrayResponse;
}

class AssignmentsDao implements IAssignmentsDao {
  private client: CanvasClient<Assignment>;

  constructor() {
    this.client = new CanvasClient<Assignment>();
  }

  /**
   * @param courseId
   * @param assignmentId
   */
  public getOne(courseId: number, assignmentId: number): AssignmentResponse {
    const path = `courses/${courseId}/assignments/${assignmentId}?include=submission`;
    return this.client.get(path) as AssignmentResponse;
  }

  /**
   * @param courseId
   */
  public getAll(courseId: number): AssignmentArrayResponse {
    const path = `courses/${courseId}/assignments/`;
    return this.client.get(path) as AssignmentArrayResponse;
  }

  /**
   * @param courseId
   * @param assignmentId
   */
  public getSubmissions(
    courseId: number,
    assignmentId: number
  ): SubmissionArrayResponse {
    const path = `courses/${courseId}/assignments/${assignmentId}/submissions?include=user`;
    return this.client.get(path) as SubmissionArrayResponse;
  }
}

export default AssignmentsDao;
