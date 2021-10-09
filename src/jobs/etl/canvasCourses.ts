import CoursesDao from "@daos/Canvas/CourseDao";
import CourseDbDao from "@daos/Canvas/CourseDbDao";
import StudentsDao from "@daos/Canvas/StudentDao";
import StudentsDbDao from "@daos/Canvas/StudentDbDao";
import AssignmentsDao from "@daos/Canvas/AssignmentsDao";
import AssignmentsDbDao from "@daos/Canvas/AssignmentsDbDao";
import { ICompleteCanvasCourse } from "@entities/Canvas/Course";
import logger from "@shared/Logger";
import { ICompleteCanvasAssignment } from "@entities/Canvas/Assignment";

export default class CanvasCourses {
  static Courses: Record<string, number> = {
    Labs: 1552,
    Application: 1482,
    CarrersReadiness: 1492,
    BeJava: 1546,
    BeNode: 1547,
    DataEngineer: 1548,
    MLOPS: 1550,
    Fe: 1545,
    Ios: 1646,
    MLEngineer: 1549,
    TPM: 1543,
    Ux: 1544,
  };

  static async run(): Promise<void> {
    try {
      const courseDao = new CoursesDao();
      const courseDbDao = new CourseDbDao();
      const studentDao = new StudentsDao();
      const studentDbDao = new StudentsDbDao();
      const assDao = new AssignmentsDao();
      const assDbDao = new AssignmentsDbDao();

      for (const label in this.Courses) {
        const courseId = this.Courses[label];
        logger.info(`Fetching course ${label} - ${courseId}`);
        const course = (await courseDao.getOne(
          courseId
        )) as ICompleteCanvasCourse;
        if (course != undefined) {
          logger.info(`Course ${course.id} found`);
          await courseDbDao.save(course);
          logger.info(`Course '${course.name}' saved`);
          if (course.name === "Labs") {
            // get students for Labs course
            const students = await studentDao.getAllForCourse(courseId);
            logger.info(`${students.length} students found`);
            await studentDbDao.saveMany(students);
          }
          //get assignments
          const assignments = (await assDao.getAll(
            courseId
          )) as ICompleteCanvasAssignment[];
          if (assignments && assignments.length > 0) {
            logger.info(`${assignments.length} assignments found`);
            await assDbDao.saveMany(assignments);
          }
        }
      }
    } catch (err) {
      logger.err(err, true);
    }
  }
}
