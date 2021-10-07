import CanvasClient from "./client";
import { ICompleteCanvasCourse } from "@entities/Canvas/CanvasCourse";
import logger from "@shared/Logger";

export type CourseResponse = Promise<ICompleteCanvasCourse | null>;

class CourseDao {
  private client: CanvasClient<ICompleteCanvasCourse>;

  constructor() {
    this.client = new CanvasClient<ICompleteCanvasCourse>();
  }

  /**
   * @param courseId
   */
  public getOne(courseId: number): CourseResponse {
    // <canvasURL>/api/v1/courses/:courseId
    const path = `courses/${courseId}`;
    logger.info(`Getting path ${path}`);
    return this.client.get(path) as CourseResponse;
  }
}

export default CourseDao;
