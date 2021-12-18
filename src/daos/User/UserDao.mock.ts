import { IUser, User } from "@entities/User";
import { getRandomStringId } from "@shared/functions";
import { IDatabaseDao } from "../BaseDatabaseDao";
import MockDaoMock from "../MockDb/MockDao.mock";

class UserDao extends MockDaoMock implements IDatabaseDao<User> {
  public async getOne(id: number | string): Promise<IUser | undefined> {
    const db = await super.openDb();
    for (const user of db.users) {
      if (user.id === id) {
        return user;
      }
    }
    return undefined;
  }

  public async list(): Promise<IUser[]> {
    const db = await super.openDb();
    return db.users;
  }

  public async add(user: IUser): Promise<void> {
    const db = await super.openDb();
    user.id = getRandomStringId(12);
    db.users.push(user);
    await super.saveDb(db);
  }

  public async update(user: IUser): Promise<void> {
    const db = await super.openDb();
    for (let i = 0; i < db.users.length; i++) {
      if (db.users[i].id === user.id) {
        db.users[i] = user;
        await super.saveDb(db);
        return;
      }
    }
    throw new Error("User not found");
  }

  public async delete(id: number | string): Promise<void> {
    const db = await super.openDb();
    for (let i = 0; i < db.users.length; i++) {
      if (db.users[i].id === id) {
        db.users.splice(i, 1);
        await super.saveDb(db);
        return;
      }
    }
    throw new Error("User not found");
  }

  public async findOrCreate(user: IUser): Promise<IUser | undefined> {
    const db = await super.openDb();
    if (!user.id) {
      user.id = getRandomStringId(12);
      await this.add(user);
    } else {
      for (const dbUser of db.users) {
        if (dbUser.id === user.id) {
          return dbUser;
        }
      }
    }

    return user;
  }
}

export default UserDao;
