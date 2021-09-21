import Module from "@entities/Module";
import ModuleItem from "@entities/ModuleItem";
import CanvasClient from "@daos/Canvas/client";

export type ModuleResponse = Promise<Module | null>;
export type ModuleArrayResponse = Promise<Module[] | null>;
export type ModuleItemResponse = Promise<ModuleItem | null>;
export type ModuleItemArrayResponse = Promise<ModuleItem[] | null>;

export interface IModulesDao {
  getAllInCourse: (
    courseId: number
  ) => ModuleArrayResponse;
  getItems: (
    courseId: number,
    moduleId: number
  ) => ModuleItemArrayResponse;
}

class ModulesDao implements IModulesDao {

  private client: CanvasClient<Module | ModuleItem> =
    new CanvasClient<Module | ModuleItem>();

  /**
   * @param courseId
   */
  public getAllInCourse(courseId: number): ModuleArrayResponse {
    // <canvasURL>/api/v1/courses/:courseId/modules
    const path = `courses/${courseId}/modules?per_page=50`;
    // TODO: Canvas paginates query responses at 10 per page—in these requests,
    // we should loop through the Link headers to retrieve all results.
    // https://canvas.instructure.com/doc/api/file.pagination.html
    return this.client.get(path) as ModuleArrayResponse;
  }

  /**
   * @param courseId
   */
  public getItems(
    courseId: number,
    moduleId: number
  ): ModuleItemArrayResponse {
    // <canvasURL>/api/v1/courses/:courseId/modules/:moduleId>/items
    const path = `courses/${courseId}/modules/${moduleId}/items?include[content_details]&per_page=50`;
    // TODO: Canvas paginates query responses at 10 per page—in these requests,
    // we should loop through the Link headers to retrieve all results.
    // https://canvas.instructure.com/doc/api/file.pagination.html
    return this.client.get(path) as ModuleItemArrayResponse;
  }
}

export default ModulesDao;
