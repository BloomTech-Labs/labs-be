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
  public async getOne(
    courseId: number,
    assignmentId: number
  ): AssignmentResponse {
    const path = `courses/${courseId}/assignments/${assignmentId}?include=submission`;
    const data = (await this.client.get(path)).data as Assignment;
    return new Promise(() => data);
  }

  /**
   * @param courseId
   */
  public async getAll(courseId: number): AssignmentArrayResponse {
    const path = `courses/${courseId}/assignments/`;
    const data = (await this.client.get(path)).data as Assignment[];
    return new Promise(() => data);
  }

  /**
   * @param courseId
   * @param assignmentId
   */
  public async getSubmissions(
    courseId: number,
    assignmentId: number
  ): SubmissionArrayResponse {
    const path = `courses/${courseId}/assignments/${assignmentId}/submissions?include=user`;
    const data = (await this.client.get(path)).data as Assignment;
    return new Promise(() => data);
  }
}

export default AssignmentsDao;
