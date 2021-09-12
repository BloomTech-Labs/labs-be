import { ISubmission } from "@entities/Submission";
import CanvasClient from "@daos/Canvas/client";

export interface ISubmissionDao {
  getOne: (id: number) => Promise<ISubmission | null>;
  getAll: (assignmentId: number) => Promise<ISubmission[]>;
  getByAssignmentAndUser: (
    courseId: number,
    assignmentId: number,
    lambdaId: string
  ) => Promise<ISubmission>;
  putOne: (
    courseId: number,
    assignmentId: number,
    lambdaId: string,
    points: number | null | undefined
  ) => Promise<void>;
}

class SubmissionDao implements ISubmissionDao {
  private client: CanvasClient = new CanvasClient({
    token: process.env.canvas_access_token,
  });
  /**
   * @param id
   */
  public getOne(id: number): Promise<ISubmission | null> {
    // TODO
    return Promise.resolve(null);
  }

  /**
   * @param assignmentId
   */
  public getAll(assignmentId: number): any {
    const courseId = "Q291cnNlLTE0ODI=";
    const path = `courses/${courseId}/assignments/${assignmentId}/submissions`;
    return this.client.get(path);
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
  ): Promise<ISubmission> {
    // <canvasURL>/api/v1/courses/1474/assignments/47330/submissions/sis_user_id:<lambdaId>
    let path = `courses/${courseId}/assignments/${assignmentId}/submissions/sis_user_id:${lambdaId}`;
    return this.client.get(path);
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
    points: number | null | undefined
  ): Promise<void> {
    // <canvasURL>/api/v1/courses/:courseid/assignments/<id>/submissions/sis_user_id:<lambdaID>?submission[posted_grade]=<points>
    let path = `courses/${courseId}/assignments/${assignmentId}/submissions/sis_user_id:${lambdaId}?submission[posted_grade]=${points}`;
    return this.client.get(path);
  }
}

export default SubmissionDao;
