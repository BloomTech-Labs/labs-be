import User from "@entities/User";

// https://canvas.instructure.com/doc/api/groups.html
export interface IGroup {
  id: number;
  name: string;
  description: string;
  is_public: boolean;
  followed_by_user: boolean;
  join_level: string;
  members_count: number;
  avatar_url: string;
  context_type: string;
  course_id: number,
  role: string;
  group_category_id: number;
  sis_group_id: string;
  sis_import_id: number;
  storage_quota_mb: number;
  permissions: Record<string, unknown>;
  users: User[];
}

export class Group implements IGroup {
  public id: number;
  public name: string;
  public description: string;
  public is_public: boolean;
  public followed_by_user: boolean;
  public join_level: string;
  public members_count: number;
  public avatar_url: string;
  public context_type: string;
  public course_id: number;
  public role: string;
  public group_category_id: number;
  public sis_group_id: string;
  public sis_import_id: number;
  public storage_quota_mb: number;
  public permissions: Record<string, unknown>;
  public users: User[];

  constructor(
    id: number,
    name: string,
    description: string,
    is_public: boolean,
    followed_by_user: boolean,
    join_level: string,
    members_count: number,
    avatar_url: string,
    context_type: string,
    course_id: number,
    role: string,
    group_category_id: number,
    sis_group_id: string,
    sis_import_id: number,
    storage_quota_mb: number,
    permissions: Record<string, unknown>,
    users: User[]
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.is_public = is_public;
    this.followed_by_user = followed_by_user;
    this.join_level = join_level;
    this.members_count = members_count;
    this.avatar_url = avatar_url;
    this.context_type = context_type;
    this.course_id = course_id,
    this.role = role;
    this.group_category_id = group_category_id;
    this.sis_group_id = sis_group_id;
    this.sis_import_id = sis_import_id;
    this.storage_quota_mb = storage_quota_mb;
    this.permissions = permissions;
    this.users = users;
  }
}

export default Group;
