import CoursesDao from "@daos/Canvas/CourseDao";
import CourseDbDao from "@daos/Canvas/CourseDbDao";
import logger from "@shared/Logger";

export default class CanvasCourses {
  static courseIds = [1552];

  static async run(): Promise<void> {
    try {
      const coursesDao = new CoursesDao();
      const courseDbDao = new CourseDbDao();
      for (const courseId of this.courseIds) {
        const course = await coursesDao.getOne(courseId);
        logger.info(course, true);
        if (course != undefined) {
          logger.info(`Course ${course.id} found`);
          await courseDbDao.save(course);
          logger.info(`Course ${course.name} saved`);
        }
      }
    } catch (err) {
      logger.err(err, true);
    }
  }
}
