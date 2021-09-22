// https://canvas.iastate.edu/doc/api/users.html
export interface ICanvasUser {
  id: number;
  name: string;
  sortable_name: string;
  short_name: string;
  sis_user_id?: string;
  sis_import_id?: number;
  integration_id?: string;
  login_id: string;
  avatar_url?: string;
  enrollments?: unknown[];
  email?: string;
  locale?: string;
  last_login?: Date;
  time_zone?: string;
  bio?: string;
}

export class CanvasUser implements ICanvasUser {
  public id: number;
  public name: string;
  public sortable_name: string;
  public short_name: string;
  public sis_user_id?: string;
  public sis_import_id?: number;
  public integration_id?: string;
  public login_id: string;
  public avatar_url?: string;
  public enrollments?: unknown[];
  public email?: string;
  public locale?: string;
  public last_login?: Date;
  public time_zone?: string;
  public bio?: string;

  constructor(
    id: number,
    name: string,
    sortable_name: string,
    short_name: string,
    login_id: string,
    sis_user_id?: string,
    sis_import_id?: number,
    integration_id?: string,
    avatar_url?: string,
    enrollments?: unknown[],
    email?: string,
    locale?: string,
    last_login?: Date,
    time_zone?: string,
    bio?: string
  ) {
    this.id = id;
    this.name = name;
    this.sortable_name = sortable_name;
    this.short_name = short_name;
    this.login_id = login_id;
    this.sis_user_id = sis_user_id || "";
    this.sis_import_id = sis_import_id;
    this.integration_id = integration_id || "";
    this.avatar_url = avatar_url || "";
    this.enrollments = enrollments || [];
    this.email = email || "";
    this.locale = locale || "";
    this.last_login = last_login ? new Date(last_login) : new Date();
    this.time_zone = time_zone || "";
    this.bio = bio || "";
  }
}

export default CanvasUser;
