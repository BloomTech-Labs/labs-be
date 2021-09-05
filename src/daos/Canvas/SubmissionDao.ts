import CanvasClient from "@daos/Canvas/client";

export interface ISubmissionDao {
  getOne: (id: string) => Promise<any | null>;
  getAll: (assignmentId: string) => Promise<any[]>;
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
  public getAll(assignmentId: string): any {
      const courseId = 'Q291cnNlLTE0ODI=';
      let path = `courses/${courseId}/assignments/${assignmentId}/submissions`;
      return this.client.get(path);
  }
}

export default SubmissionDao;
