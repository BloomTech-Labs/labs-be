import Submission, { ISubmission } from "@entities/Submission";
import CanvasClient from "@daos/Canvas/client";

export type SubmissionResponse = Promise<Submission | null>;
export type SubmissionArrayResponse = Promise<Submission[] | null>;

export interface ISubmissionDao {
  getOne: (
    courseId: number,
    assignmentId: number,
    lambdaId: string
  ) => SubmissionResponse;
  getAll: (courseId: number, assignmentId: number) => SubmissionArrayResponse;
  getByAssignmentAndUser: (
    courseId: number,
    assignmentId: number,
    lambdaId: string
  ) => SubmissionResponse;
  putOne: (
    courseId: number,
    assignmentId: number,
    lambdaId: string,
    points: number
  ) => SubmissionResponse;
}

class SubmissionDao implements ISubmissionDao {
  private client: CanvasClient<ISubmission>;

  constructor() {
    this.client = new CanvasClient<ISubmission>();
  }

  /**
   * @param courseId
   * @param assignmentId
   * @param lambdaId
   */
  public getOne(
    courseId: number,
    assignmentId: number,
    lambdaId: string
  ): SubmissionResponse {
    const path = `courses/${courseId}/assignments/${assignmentId}/submissions/sis_user_id:${lambdaId}`;
    return this.client
      .get(path)
      .then((response) => response.data) as SubmissionResponse;
  }

  /**
   * @param courseId
   * @param assignmentId
   */
  public getAll(
    courseId: number,
    assignmentId: number
  ): SubmissionArrayResponse {
    const path = `courses/${courseId}/assignments/${assignmentId}/submissions`;
    return this.client
      .get(path)
      .then((response) => response.data) as SubmissionArrayResponse;
  }

  /**
   * @param courseId
   * @param assignmentId
   * @param lambdaId
   */
  public getByAssignmentAndUser(
    courseId: number,
    assignmentId: number,
    lambdaId: string
  ): SubmissionResponse {
    const path = `courses/${courseId}/assignments/${assignmentId}/submissions/sis_user_id:${lambdaId}`;
    return this.client
      .get(path)
      .then((response) => response.data) as SubmissionResponse;
  }

  /**
   * @param courseId
   * @param assignmentId
   * @param lambdaId
   */
  public putOne(
    courseId: number,
    assignmentId: number,
    lambdaId: string,
    points: number
  ): SubmissionResponse {
    const path = `courses/${courseId}/assignments/${assignmentId}/submissions/sis_user_id:${lambdaId}?submission[posted_grade]=${points}`;
    return this.client
      .get(path)
      .then((response) => response.data) as SubmissionResponse;
  }
}

export default SubmissionDao;
