import CanvasClient from "@daos/Canvas/client";

export interface ISubmissionDao {
  getOne: (id: string) => Promise<any | null>;
  getAll: (assignmentId: string) => Promise<any[]>;
  getByAssignmentAndUser: (courseId: string, assignmentId: string, lambdaId: string) => any;
  putOne: (courseId: string, assignmentId: string, lambdaId: string, points: number) => any;
}

class SubmissionDao implements ISubmissionDao {

  private client: CanvasClient = new CanvasClient({ token: process.env.CANVAS_ACCESS_TOKEN});
  /**
   * @param id
   */
  public getOne(id: string): Promise<any | null> {
      // TODO
      return Promise.resolve(null);
  }


  /**
   * @param assignmentId 
   */
  // TODO
  public getAll(assignmentId: string): any {
      const courseId = 'Q291cnNlLTE0ODI='; // TEMP
      let path = `courses/${courseId}/assignments/${assignmentId}/submissions`;
      return this.client.get(path);
  }


/**
 * @param courseId
 * @param assignmentId
 * @param lambdaId
 */
  public getByAssignmentAndUser(courseId: string, assignmentId: string, lambdaId: string): any {
    // <canvasURL>/api/v1/courses/1474/assignments/47330/submissions/sis_user_id:<lambdaId>
    let path = `courses/${courseId}/assignments/${assignmentId}/submissions/sis_user_id:${lambdaId}`;
    return this.client.get(path);
  }


  /**
 * @param courseId
 * @param assignmentId
 * @param lambdaId
 */
   public putOne(courseId: string, assignmentId: string, lambdaId: string, points: number): any {
    // PUT <canvasURL>/api/v1/courses/:courseid/assignments/<id>/submissions/sis_user_id:<lambdaID>?submission[posted_grade]=<points>
    let path = `courses/${courseId}/assignments/${assignmentId}/submissions/sis_user_id:${lambdaId}?submission[posted_grade]=${points}`;
    return this.client.get(path);
  }


}


export default SubmissionDao;
