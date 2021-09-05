import CanvasClient from "@daos/Canvas/client";

export interface IAssignmentsDao {
  getOne: (id: number, courseId: number) => Promise<any | null>;
  getAll: (courseId: number) => Promise<any[]>;
}

class AssignmentsDao implements IAssignmentsDao {

  courseId: number;
  client: CanvasClient;

  constructor(courseId: number) {
    this.courseId = courseId | 0;
    this.client = new CanvasClient({ token: process.env.CANVAS_ACCESS_TOKEN});
  }

  /**
   * @param id
   */
  public getOne(id: number): Promise<any | null> {
      // https://lambdaschool.instructure.com/api/v1/courses/1482/assignments/47902
      let path = `courses/${this.courseId}/assignments/${id}?include=submission`;
      return this.client.get(path);
  }


  /**
   * @param assignmentId 
   */
  public getAll(): any {
    let path = `courses/${this.courseId}/assignments/`;
    return this.client.get(path);
  }

  public getSubmissions(id: number): any {
    // /api/v1/courses/:course_id/assignments/:assignment_id/submissions
    let path = `courses/${this.courseId}/assignments/${id}/submissions?include=user`;
    return this.client.get(path);
  }
}

export default AssignmentsDao;
