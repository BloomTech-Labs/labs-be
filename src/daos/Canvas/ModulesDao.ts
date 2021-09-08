import CanvasClient from "@daos/Canvas/client";

export interface IModulesDao {
  getAllInCourse: (courseId: number) => Promise<any[]>;
  getItems: (courseId: number, moduleId: number) => Promise<any | null>;
}

class ModulesDao implements IModulesDao {

  client: CanvasClient;

  constructor() {
    this.client = new CanvasClient({ token: process.env.CANVAS_ACCESS_TOKEN});
  }

  /**
   * @param courseId
   */
  public getAllInCourse(courseId: number): Promise<any | null> {
    // <canvasURL>/api/v1/courses/:courseId/modules
    let path = `courses/${courseId}/modules?per_page=50`;
    // TODO: Canvas paginates query responses at 10 per page—in these requests,
    // we should loop through the Link headers to retrieve all results.
    // https://canvas.instructure.com/doc/api/file.pagination.html
    return this.client.get(path);
  }

  /**
   * @param courseId
   */
   public getItems(courseId: number, moduleId: number): Promise<any | null> {
    // <canvasURL>/api/v1/courses/:courseId/modules/:moduleId>/items
    let path = `courses/${courseId}/modules/${moduleId}/items?include[content_details]&per_page=50`;
    // TODO: Canvas paginates query responses at 10 per page—in these requests,
    // we should loop through the Link headers to retrieve all results.
    // https://canvas.instructure.com/doc/api/file.pagination.html
    return this.client.get(path);
  }

}

export default ModulesDao;
