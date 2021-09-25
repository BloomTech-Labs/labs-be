import { Entity, Column, Index, PrimaryColumn } from "typeorm";

export interface IUser {
  // this should be the okta id
  id: string;
  name: string;
  email: string;
}

@Entity()
export class User implements IUser {
  @PrimaryColumn()
  public id: string;
  @Column()
  public name: string;
  @Column()
  @Index({ unique: true })
  public email: string;
}

export default User;
