import CanvasClient from "@daos/Canvas/client";
import Assignment from "@entities/Assignment";
import { ICompleteCanvasAssignment } from "@entities/Canvas/Assignment";
import SubmissionDao, { SubmissionArrayResponse } from "./SubmissionDao";

export type AssignmentResponse = Promise<
  ICompleteCanvasAssignment | ICompleteCanvasAssignment[] | null
>;
export type AssignmentArrayResponse = Promise<
  Assignment[] | ICompleteCanvasAssignment[] | null
>;

export interface IAssignmentsDao {
  getOne: (courseId: number, assignmentId: number) => AssignmentResponse;
  getAll: (courseId: number) => AssignmentResponse;
  getSubmissions: (
    courseId: number,
    assignmentId: number
  ) => SubmissionArrayResponse;
}

class AssignmentsDao implements IAssignmentsDao {
  private client: CanvasClient<ICompleteCanvasAssignment>;

  constructor() {
    this.client = new CanvasClient<ICompleteCanvasAssignment>();
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
    const data = (await this.client.get(path))
      .data as ICompleteCanvasAssignment;
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data);
      } else {
        reject(new Error(`Assignment ${assignmentId} not found`));
      }
    });
  }

  /**
   * @param courseId
   */
  public async getAll(courseId: number): AssignmentResponse {
    const path = `courses/${courseId}/assignments/`;
    const data = await this.client.getAllResources(path);
    return new Promise((resolve, reject) => {
      if (data) {
        resolve(data);
      } else {
        reject(new Error(`Assignments for course ${courseId} not found`));
      }
    });
  }

  /**
   * @param courseId
   * @param assignmentId
   */
  public async getSubmissions(
    courseId: number,
    assignmentId: number
  ): SubmissionArrayResponse {
    const subDao = new SubmissionDao();
    const response = subDao.getAll(courseId, assignmentId);
    return response;
  }
}

export default AssignmentsDao;
