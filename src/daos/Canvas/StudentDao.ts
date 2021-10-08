import CanvasClient from "./client";
import { ICanvasUser } from "@entities/Canvas/CanvasUser";
import logger from "@shared/Logger";

export type CourseStudentsResponse = Promise<ICanvasUser[]>;

class StudentsDao {
  private client: CanvasClient<ICanvasUser>;

  constructor() {
    this.client = new CanvasClient<ICanvasUser>();
  }

  public getAllForCourse(courseId: number): CourseStudentsResponse {
    // <canvasURL>/api/v1/courses/:courseId/users
    const path = `courses/${courseId}/users`;
    return this.client.getAllResources(path).then((users) => {
      const students = users.filter((user) => {
        if (user.email && user.email.split("@")[1] != "lambdaschool.com") {
          return true;
        }
        return false;
      });
      return students;
    }) as CourseStudentsResponse;
  }
}

export default StudentsDao;
