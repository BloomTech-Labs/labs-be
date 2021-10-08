import CanvasClient from "./client";
import { ICompleteCanvasCourse } from "@entities/Canvas/CanvasCourse";
import logger from "@shared/Logger";

export type CourseResponse = Promise<
  ICompleteCanvasCourse | ICompleteCanvasCourse[] | null
>;

class CourseDao {
  private client: CanvasClient<ICompleteCanvasCourse>;

  constructor() {
    this.client = new CanvasClient<ICompleteCanvasCourse>();
  }

  /**
   * @param courseId
   */
  public async getOne(courseId: number): CourseResponse {
    // <canvasURL>/api/v1/courses/:courseId
    const path = `courses/${courseId}`;
    logger.info(`Getting path ${path}`);
    const response = await this.client.get(path);
    const data = response.data;
    logger.imp(data, true);
    return new Promise((resolve) => resolve(data));
  }
}

export default CourseDao;
