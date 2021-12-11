import { BaseDatabaseDao } from "@daos/BaseDatabaseDao";
import { User } from "@entities/User";

class UserDao extends BaseDatabaseDao<User> {
  constructor() {
    super(User);
  }
}

export default UserDao;
