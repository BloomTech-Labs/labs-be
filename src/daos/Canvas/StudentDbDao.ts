import { BaseDatabaseDao } from "@daos/BaseDatabaseDao";
import CanvasStudent, { ICanvasUser } from "@entities/Canvas/CanvasUser";

class StudentDbDao extends BaseDatabaseDao<CanvasStudent> {
  constructor() {
    super(CanvasStudent);
  }

  public async getById(id: number): Promise<CanvasStudent> {
    const course = (await this.getOne(id)) as CanvasStudent;
    return course;
  }

  public async save(user: CanvasStudent | ICanvasUser): Promise<void> {
    await this.update(user);
    return;
  }

  public async saveMany(users: CanvasStudent[]): Promise<void> {
    for (const user of users) {
      await this.update(user);
    }
    return;
  }
}

export default StudentDbDao;
