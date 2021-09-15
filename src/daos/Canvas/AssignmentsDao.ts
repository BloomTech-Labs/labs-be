import CanvasClient from "@daos/Canvas/client";
import Assignment from "@entities/Assignment";
import Submission from "@entities/Submission";

export interface IAssignmentsDao {
  getOne: (id: number, courseId: number) => Promise<Assignment | null>;
  getAll: (courseId: number) => Promise<Assignment[]>;
  getSubmissions: (id: number) => Promise<Submission[]>;
}

class AssignmentsDao implements IAssignmentsDao {
  courseId: number;
  client: CanvasClient;

  constructor(courseId: number) {
    this.courseId = courseId | 0;
    this.client = new CanvasClient({ token: process.env.CANVAS_ACCESS_TOKEN });
  }

  /**
   * @param id
   */
  public getOne(id: number): Promise<Assignment | null> {
    // https://lambdaschool.instructure.com/api/v1/courses/1482/assignments/47902
    const path = `courses/${this.courseId}/assignments/${id}?include=submission`;
    return this.client.get(path);
  }

  /**
   *
   */
  public getAll(): Promise<Assignment[]> {
    const path = `courses/${this.courseId}/assignments/`;
    return this.client.get(path);
  }

  /**
   * @param id
   */
  public getSubmissions(id: number): Promise<Submission[]> {
    // /api/v1/courses/:course_id/assignments/:assignment_id/submissions
    const path = `courses/${this.courseId}/assignments/${id}/submissions?include=user`;
    return this.client.get(path);
  }
}

export default AssignmentsDao;
