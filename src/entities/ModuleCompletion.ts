export interface IModuleCompletion {
  id: number;
  name: string;
  completed: boolean;
  completed_at?: Date;
}

class ModuleCompletion implements IModuleCompletion {
  public id: number;
  public name: string;
  public completed: boolean;
  public completed_at?: Date;

  constructor (
    id: number,
    name: string,
    completed: boolean,
    completed_at?: Date
  ) {
    this.id = id;
    this.name = name;
    this.completed = completed;
    this.completed_at = completed_at;
  }
}

export default ModuleCompletion;
