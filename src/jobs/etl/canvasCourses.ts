import CoursesDao from "@daos/Canvas/CourseDao";
import CourseDbDao from "@daos/Canvas/CourseDbDao";
import StudentsDao from "@daos/Canvas/StudentDao";
import StudentsDbDao from "@daos/Canvas/StudentDbDao";
import { ICompleteCanvasCourse } from "@entities/Canvas/CanvasCourse";
import logger from "@shared/Logger";

export default class CanvasCourses {
  static courseIds = [1552];

  static async run(): Promise<void> {
    try {
      const coursesDao = new CoursesDao();
      const courseDbDao = new CourseDbDao();
      const studentDao = new StudentsDao();
      const studentDbDao = new StudentsDbDao();

      for (const courseId of this.courseIds) {
        // const p = coursesDao.getOne(courseId);
        // const course = (await p) as ICompleteCanvasCourse;
        // logger.info(course, true);
        // if (course != undefined) {
        //   logger.info(`Course ${course.id} found`);
        //   await courseDbDao.save(course);
        //   logger.info(`Course '${course.name}' saved`);
        // }
        // get students for course
        const students = await studentDao.getAllForCourse(courseId);
        logger.info(`${students.length} students found`);
        await studentDbDao.saveMany(students);
      }
    } catch (err) {
      logger.err(err, true);
    }
  }
}
