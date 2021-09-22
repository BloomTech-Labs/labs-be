export interface IRoleDao {
  getApplications: (unitId: string) => Promise<any | null>;
}

class RoleDao implements IRoleDao {
  /**
   * @param email
   */
  public getApplications(unitId: string): Promise<any[]> {
    // TODO
    return Promise.resolve([]);
  }
}

export default RoleDao;
