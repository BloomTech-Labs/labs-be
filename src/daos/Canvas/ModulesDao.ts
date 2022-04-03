import Module from "@entities/Module";
import ModuleItem from "@entities/ModuleItem";
import CanvasClient from "@daos/Canvas/client";

export type ModuleResponse = Promise<Module | null>;
export type ModuleArrayResponse = Promise<Module[] | null>;
export type ModuleItemResponse = Promise<ModuleItem | null>;
export type ModuleItemArrayResponse = Promise<ModuleItem[] | null>;

export interface IModulesDao {
  getAllInCourse: (courseId: number) => ModuleArrayResponse;
  getAllCompletionInCourse: (
    courseId: number,
    lambdaId: string
  ) => ModuleArrayResponse;
  getItems: (
    courseId: number,
    moduleId: number,
    lambdaId?: string
  ) => ModuleItemArrayResponse;
  getItem: (
    courseId: number,
    moduleId: number,
    moduleItemId: number,
    lambdaId?: string
  ) => ModuleItemResponse;
}

class ModulesDao implements IModulesDao {
  private client: CanvasClient<Module | ModuleItem>;

  constructor() {
    this.client = new CanvasClient<Module | ModuleItem>();
  }

  /**
   * @param courseId
   */
  public getOne(courseId: number, moduleId: number): ModuleResponse {
    // <canvasURL>/api/v1/courses/:courseId/modules/:moduleId/
    const path = `courses/${courseId}/modules/${moduleId}`;
    // TODO: Canvas paginates query responses at 10 per page—in these requests,
    // we should loop through the Link headers to retrieve all results.
    // https://canvas.instructure.com/doc/api/file.pagination.html
    return this.client.get(path) as ModuleResponse;
  }

  /**
   * @param courseId
   */
  public getCompletion(
    courseId: number,
    moduleId: number,
    lambdaId: string
  ): ModuleResponse {
    // <canvasURL>/api/v1/courses/:courseId/modules/:moduleId
    const path = `courses/${courseId}/modules/${moduleId}?as_user_id=sis_user_id:${lambdaId}&per_page=50`;
    // TODO: Canvas paginates query responses at 10 per page—in these requests,
    // we should loop through the Link headers to retrieve all results.
    // https://canvas.instructure.com/doc/api/file.pagination.html
    return this.client.get(path) as ModuleResponse;
  }

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
  public getAllCompletionInCourse(
    courseId: number,
    lambdaId: string
  ): ModuleArrayResponse {
    // <canvasURL>/api/v1/courses/:courseId/modules
    const path = `courses/${courseId}/modules?as_user_id=sis_user_id:${lambdaId}&per_page=50`;
    // TODO: Canvas paginates query responses at 10 per page—in these requests,
    // we should loop through the Link headers to retrieve all results.
    // https://canvas.instructure.com/doc/api/file.pagination.html
    return this.client.get(path) as ModuleArrayResponse;
  }

  /**
   * List the module items for the given module in the given course. Optionally
   * supply a Lambda ID to also get completion information for each module item.
   *
   * @param courseId
   * @param moduleId
   * @param lambdaId?
   */
  public getItems(
    courseId: number,
    moduleId: number,
    lambdaId?: string
  ): ModuleItemArrayResponse {
    // <canvasURL>/api/v1/courses/:courseId/modules/:moduleId>/items
    const path = lambdaId
      ? `courses/${courseId}/modules/${moduleId}/items?include[]=content_details&as_user_id=sis_user_id:${lambdaId}&per_page=50`
      : `courses/${courseId}/modules/${moduleId}/items?include[]=content_details&per_page=50`;
    // TODO: Canvas paginates query responses at 10 per page—in these requests,
    // we should loop through the Link headers to retrieve all results.
    // https://canvas.instructure.com/doc/api/file.pagination.html
    return this.client.get(path) as ModuleItemArrayResponse;
  }

  /**
   * Get the module item with the given module item ID from the given module in the
   * given course. Optionally supply a Lambda ID to also get completion information
   * for the module item.
   *
   * @param courseId
   * @param moduleId
   * @param moduleItemId
   * @param lambdaId?
   */
  public getItem(
    courseId: number,
    moduleId: number,
    moduleItemId: number,
    lambdaId?: string
  ): ModuleItemResponse {
    // <canvasURL>/api/v1/courses/:courseId/modules/:moduleId>/items
    const path = lambdaId
      ? `courses/${courseId}/modules/${moduleId}/items/${moduleItemId}?include[]=content_details&&as_user_id=sis_user_id:${lambdaId}&per_page=50`
      : `courses/${courseId}/modules/${moduleId}/items/${moduleItemId}?include[]=content_details&per_page=50`;
    // TODO: Canvas paginates query responses at 10 per page—in these requests,
    // we should loop through the Link headers to retrieve all results.
    // https://canvas.instructure.com/doc/api/file.pagination.html
    return this.client.get(path) as ModuleItemResponse;
  }
}

export default ModulesDao;
