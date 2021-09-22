import { IUser, User } from "@entities/User";
import Logger from "@shared/Logger";
import { Connection, createConnection, Repository } from "typeorm";

export interface IUserDao {
  getOne: (id: string) => Promise<IUser | undefined>;
  getAll: () => Promise<IUser[]>;
  add: (user: IUser) => Promise<void>;
  update: (user: IUser) => Promise<void>;
  delete: (id: string) => Promise<void>;
  findOrCreate: (user: IUser) => Promise<IUser | undefined>;
}

class UserDao implements IUserDao {
  public connection: Connection;
  private repo: Repository<User>;

  constructor() {
    createConnection()
      .then((connection) => {
        this.connection = connection;
        this.repo = this.connection.getRepository(User);
      })
      .catch((error) => {
        Logger.err(error);
      });
  }

  /**
   * @param email
   */
  public async getOne(id: string): Promise<IUser | undefined> {
    const user: User | undefined = await this.repo.findOne(id);
    return user;
  }

  /**
   *
   */
  public async getAll(): Promise<IUser[]> {
    const users: User[] | undefined = await this.repo.find();
    return users;
  }

  /**
   *
   * @param user
   */
  public async add(user: IUser): Promise<void> {
    await this.repo.save(user);
    return Promise.resolve(undefined);
  }

  /**
   *
   * @param user
   */
  public async update(user: IUser): Promise<void> {
    const u = await this.repo.findOne(user.id);
    const newUser = Object.assign(u, user);
    await this.repo.save(newUser);
    return Promise.resolve(undefined);
  }

  /**
   *
   * @param id
   */
  public async delete(id: string): Promise<void> {
    const u = await this.connection.getRepository(User).findOne(id);
    await this.repo.remove(u as User);
    return Promise.resolve(undefined);
  }

  /**
   * This is a specialized query used only in the authRequired middleware.
   * It attempts to find a user in the database, and will return the user if
   * found. Otherwise, it will attempt to create that user in the database
   * first, and then will return it.
   * @param {IUser} user contains the user's info
   * @param {string} user.name user's name stored in a string
   * @param {string} user.email user's email in a string
   * @param {string} user.id The user's okta id
   * @returns {User} returns a User object
   */
  /* istanbul ignore next */
  public async findOrCreate(user: IUser): Promise<User> {
    const foundUser = await this.repo.findOne(user.id);
    if (foundUser) {
      return foundUser;
    } else {
      return await this.repo.save(user);
    }
  }
}

export default UserDao;
