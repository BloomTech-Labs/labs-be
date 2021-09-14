export interface IRoleApplication {
  id: number;
  name: string;
  email: string;
  role1: string;
  role2: string;
}

class RoleApplication implements IRoleApplication {
  public id: number;
  public name: string;
  public email: string;
  public role1: string;
  public role2: string;

  constructor(
    name: string,
    email?: string,
    id?: number,
    role1?: string,
    role2?: string
  ) {
    this.name = name;
    this.email = email || "";
    this.id = id || -1;
    this.role1 = role1 || "";
    this.role2 = role2 || "";
  }
}

export default RoleApplication;
