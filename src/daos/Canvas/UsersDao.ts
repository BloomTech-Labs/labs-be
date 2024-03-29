import CanvasUser from "@entities/CanvasUser";
import CanvasClient from "@daos/Canvas/client";

export type UserResponse = Promise<CanvasUser | null>;
export type UserArrayResponse = Promise<CanvasUser[] | null>;

export interface IUsersDao {
  getOneBySisId: (id: string) => UserResponse;
  getAll: () => UserArrayResponse;
  getUsersInGroup: (groupId: number) => UserArrayResponse;
}

class UsersDao implements IUsersDao {
  private client: CanvasClient<CanvasUser>;

  constructor() {
    this.client = new CanvasClient<CanvasUser>();
  }

  /**
   * @param courseId
   * @param assignmentId
   */
  public getOneBySisId(id: string): UserResponse {
    const path = `users/sis_user_id:${id}`;
    return this.client.get(path) as UserResponse;
  }

  /**
   * @param courseId
   * @param assignmentId
   */
  public getOne(id: number): UserResponse {
    const path = `users/${id}`;
    return this.client.get(path) as UserResponse;
  }

  /**
   * @param courseId
   */
  public getAll(): UserArrayResponse {
    const path = "users";
    return this.client.get(path) as UserArrayResponse;
  }

  /**
   * @param courseId
   */
  public getUsersInGroup(groupId: number): UserArrayResponse {
    const path = `groups/${groupId}/users?per_page=250`;
    return this.client.get(path) as UserArrayResponse;
  }
}

export default UsersDao;
