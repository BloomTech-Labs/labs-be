import { BaseDatabaseDao } from "@daos/BaseDatabaseDao";
import CanvasCourse, {
  ICompleteCanvasCourse,
  convertCompleteCourseToCourse,
} from "@entities/Canvas/Course";

class CourseDbDao extends BaseDatabaseDao<CanvasCourse> {
  constructor() {
    super(CanvasCourse);
  }

  public async getById(id: number): Promise<CanvasCourse> {
    const course = (await this.getOne(id)) as CanvasCourse;
    return course;
  }

  public async save(
    course: CanvasCourse | ICompleteCanvasCourse
  ): Promise<void> {
    const aCourse = convertCompleteCourseToCourse(course);
    await this.update(aCourse);
    return;
  }
}

export default CourseDbDao;
