import Group from "@entities/Group";
import CanvasClient from "@daos/Canvas/client";

export type GroupResponse = Promise<Group | null>;
export type GroupArrayResponse = Promise<Group[] | null>;

export interface IGroupsDao {
  getGroupsInCourse(courseId: number): GroupArrayResponse;
}

class GroupsDao implements IGroupsDao {
  private client: CanvasClient<Group>;

  constructor() {
    this.client = new CanvasClient<Group>();
  }


  /**
   * @param courseId
   */
  public getGroupsInCourse(courseId: number): GroupArrayResponse {
    const path = `courses/${courseId}/groups?per_page=100`;
    return this.client.get(path) as GroupArrayResponse;
  }
  
}

export default GroupsDao;
