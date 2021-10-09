import { BaseDatabaseDao } from "@daos/BaseDatabaseDao";
import CanvasAssignment, {
  ICompleteCanvasAssignment,
  convertCompleteAssignmentToassignment,
} from "@entities/Canvas/Assignment";

class AssignmentsDbDao extends BaseDatabaseDao<CanvasAssignment> {
  constructor() {
    super(CanvasAssignment);
  }

  public async getById(id: number): Promise<CanvasAssignment> {
    const course = (await this.getOne(id)) as CanvasAssignment;
    return course;
  }

  public async save(
    assignment: CanvasAssignment | ICompleteCanvasAssignment
  ): Promise<void> {
    const ass = convertCompleteAssignmentToassignment(assignment);
    await this.update(ass);
    return;
  }

  public async saveMany(
    assignments: CanvasAssignment[] | ICompleteCanvasAssignment[]
  ): Promise<void> {
    for (const assignment of assignments) {
      await this.save(assignment);
    }
    return;
  }
}

export default AssignmentsDbDao;
