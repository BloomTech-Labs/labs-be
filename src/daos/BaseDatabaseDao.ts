import { getRepository, Repository, EntityTarget } from "typeorm";

export interface HasId {
  id: number | string;
}

export interface IDatabaseDao<T> {
  getOne: (id: number | string) => Promise<T | undefined>;
  list: () => Promise<T[]>;
  add: (user: T) => Promise<void>;
  update: (item: T) => Promise<void>;
  delete: (id: number | string) => Promise<void>;
  findOrCreate: (item: T) => Promise<T | undefined>;
}

export class BaseDatabaseDao<T extends HasId> {
  protected repo: Repository<T>;

  protected constructor(type: EntityTarget<T>) {
    this.repo = getRepository<T>(type);
  }

  public async list(): Promise<T[]> {
    return await this.repo.find();
  }

  /**
   * @param id
   */
  public async getOne(id: number | string): Promise<T | undefined> {
    const item = await this.repo.findOne(id);
    return item;
  }

  /**
   *
   * @param user
   */
  public async add(item: T): Promise<void> {
    await this.repo.save(item as any);
    return Promise.resolve(undefined);
  }

  /**
   *
   * @param user
   */
  public async update(item: T): Promise<void> {
    const i = await this.repo.findOne(item.id);
    const newItem: T = Object.assign(i, item);
    await this.repo.save(newItem as any);
    return Promise.resolve(undefined);
  }

  /**
   *
   * @param id
   */
  public async delete(id: number | string): Promise<void> {
    const u = await this.repo.findOne(id);
    await this.repo.remove(u as T);
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
  public async findOrCreate(item: T): Promise<T> {
    const foundUser = await this.repo.findOne(item.id);
    if (foundUser) {
      return foundUser;
    } else {
      return (await this.repo.save(item as any)) as T;
    }
  }
}
