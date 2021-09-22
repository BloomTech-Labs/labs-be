// https://canvas.iastate.edu/doc/api/modules.html
export interface IModuleItem {
  id: number;
  module_id: number;
  position: number;
  title: string;
  indent: number;
  type: string;
  content_id: number;
  html_url: string;
  url?: string | null;
  page_url?: string | null;
  external_url?: string | null;
  new_tab?: string | null;
  completion_requirement?: IModuleItemCompletionRequirement;
  content_details?: IModuleItemContentDetails;
  published?: boolean | null;
}

export interface IModuleItemCompletionRequirement {
  type: string;
  min_score: number | null;
  completed: boolean;
}

export interface IModuleItemContentDetails {
  points_possible?: number | null;
  due_at?: Date | null;
  unlock_at?: Date | null;
  lock_at?: Date | null;
}

class ModuleItemCompletionRequirement {
  public type: string;
  public min_score: number | null;
  public completed: boolean;

  constructor(type: string, min_score: number | null, completed: boolean) {
    this.type = type;
    this.min_score = min_score;
    this.completed = completed;
  }
}

class ModuleItemContentDetails {
  public points_possible?: number | null;
  public due_at?: Date | null;
  public unlock_at?: Date | null;
  public lock_at?: Date | null;

  constructor(
    points_possible?: number | null,
    due_at?: Date | null,
    unlock_at?: Date | null,
    lock_at?: Date | null
  ) {
    this.points_possible = points_possible;
    this.due_at = due_at;
    this.unlock_at = unlock_at;
    this.lock_at = lock_at;
  }
}

class Module implements IModuleItem {
  public id: number;
  public module_id: number;
  public position: number;
  public title: string;
  public indent: number;
  public type: string;
  public content_id: number;
  public html_url: string;
  public url?: string | null;
  public page_url?: string | null;
  public external_url?: string | null;
  public new_tab?: string | null;
  public completion_requirement: IModuleItemCompletionRequirement;
  public content_details?: IModuleItemContentDetails;
  public published?: boolean | null;

  constructor(
    id: number,
    module_id: number,
    position: number,
    title: string,
    indent: number,
    type: string,
    content_id: number,
    html_url: string,
    url?: string | null,
    page_url?: string | null,
    external_url?: string | null,
    new_tab?: string | null,
    completion_requirement?: IModuleItemCompletionRequirement,
    content_details?: IModuleItemContentDetails,
    published?: boolean | null
  ) {
    this.id = id;
    this.module_id = module_id;
    this.position = position;
    this.title = title || "";
    this.indent = indent || 0;
    this.type = type || "";
    this.content_id = content_id;
    this.html_url = html_url || "";
    this.url = url || "";
    this.page_url = page_url || "";
    this.external_url = external_url || "";
    this.new_tab = new_tab || "";
    this.completion_requirement =
      completion_requirement ||
      new ModuleItemCompletionRequirement("", null, false);
    this.content_details =
      content_details || new ModuleItemContentDetails(null, null, null, null);
    this.published = published;
  }
}

export default Module;
