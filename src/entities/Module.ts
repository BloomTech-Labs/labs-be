import { IModuleItem } from "@entities/ModuleItem";

// https://canvas.iastate.edu/doc/api/modules.html
export interface IModule {
  id: number;
  workflow_state: string;
  position: number;
  name: string;
  unlock_at?: Date | null;
  require_sequential_progress: string;
  prerequisite_module_ids: number[];
  items_count: number;
  items_url: string;
  items?: IModuleItem[] | null;
  state?: string | null;
  completed_at?: Date | null;
  publish_final_grade: boolean | null;
  published?: boolean | null;
}

class Module implements IModule {
  public id: number;
  public workflow_state: string;
  public position: number;
  public name: string;
  public unlock_at?: Date | null;
  public require_sequential_progress: string;
  public prerequisite_module_ids: number[];
  public items_count: number;
  public items_url: string;
  public items?: IModuleItem[] | null;
  public state?: string | null;
  public completed_at?: Date | null;
  public publish_final_grade: boolean | null;
  public published?: boolean | null;

  constructor(
    id: number,
    workflow_state?: string,
    position?: number,
    name?: string,
    unlock_at?: Date | null,
    require_sequential_progress?: string,
    prerequisite_module_ids?: number[],
    items_count?: number,
    items_url?: string,
    items?: IModuleItem[] | null,
    state?: string | null,
    completed_at?: Date | null,
    publish_final_grade?: boolean | null,
    published?: boolean | null
  ) {
    this.id = id;
    this.workflow_state = workflow_state || "";
    this.position = position || 0;
    this.name = name || "";
    this.unlock_at = unlock_at ? new Date(unlock_at) : new Date();
    this.require_sequential_progress = require_sequential_progress || "";
    this.prerequisite_module_ids = prerequisite_module_ids || [];
    this.items_count = items_count || 0;
    this.items_url = items_url || "";
    this.items = items;
    this.state = state || "";
    this.completed_at = completed_at ? new Date(completed_at) : new Date();
    this.publish_final_grade = publish_final_grade || null;
    this.published = published || null;
  }
}

export default Module;
