import { IRoleApplication } from "@entities/RoleApplication";
import { getRandomInt } from "@shared/functions";
import { IRoleDao } from "./RoleDao";
import MockDaoMock from "../MockDb/MockDao.mock";

class RoleDao implements IRoleDao {
  /**
   * @param email
   */
  public getApplications(unitId: string): Promise<IRoleApplication[]> {
    // TODO
    return Promise.resolve([]);
  }
}

export default RoleDao;
