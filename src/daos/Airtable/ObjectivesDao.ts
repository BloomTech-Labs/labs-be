import Airtable, { FieldSet } from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import {
  Objective,
  SprintMilestone,
  ObjectiveType,
  SprintMilestoneType,
} from "@entities/Objective";

class ObjectivesDao {
  private api_key: string;
  private base_id: string;
  public airtable: AirtableBase;

  constructor() {
    if (!process.env.AT_API_KEY) {
      throw new Error("Missing Airtable API key");
    }
    if (!process.env.AT_SMT_BASE_ID) {
      throw new Error("Missing Airtable base ID");
    }

    this.api_key = process.env.AT_API_KEY;
    this.base_id = process.env.AT_SMT_BASE_ID;
    this.airtable = new Airtable({ apiKey: this.api_key }).base(this.base_id);
  }

  /**
   *  Format a raw record from the "Labs - Objectives" table as an Objective
   *  object.
   *
   *  @param record
   */
  public formatObjective(record: Airtable.Record<FieldSet>): Objective {
    const objective = new Objective(
      record.get("ID") as string,
      record.get("Role") as string,
      record.get("Name") as string,
      record.get("Type") as ObjectiveType,
      record.get("Course") as number,
      record.get("Points") as number,
      [], // Add Sprint Milestones later
      record.get("Objectives Course") as number
    );
    return objective;
  }

  /**
   *  Format a raw record from the "Labs - Sprint Milestones" table as a
   *  SprintMilestone object.
   *
   *  @param record
   */
  public formatMilestone(record: Airtable.Record<FieldSet>): SprintMilestone {
    const milestone = new SprintMilestone(
      record.get("ID") as string,
      record.get("Name") as string,
      record.get("Objective ID") as string,
      record.get("Type") as SprintMilestoneType,
      record.get("Course") as number | null,
      record.get("Module") as number | null,
      record.get("Assignments") as number[] | [] | null,
      record.get("Module Item ID") as number | null,
      record.get("Points") as number,
      record.get("Sprint") as number,
      record.get("Objectives Course") as number
    );
    return milestone;
  }

  /**
   *  Get all objectives, including all sprint milestones for each, from the
   *  "Labs - Objectives" and "Labs - Sprint Milestones" tables.
   */
  public async getAll(): Promise<Objective[]> {
    const objectives: Objective[] = [];
    const sprintMilestones: SprintMilestone[] = [];

    // Get Objectives
    const objectiveRecords = await this.airtable("Labs - Objectives")
      .select({
        view: "Grid view",
      })
      .all();
    for (const record of objectiveRecords) {
      // Create an Objective object and add it to the array to return
      const objective = this.formatObjective(record);
      objectives.push(objective);
    }

    // Get Sprint Milestones
    const milestoneRecords = await this.airtable("Labs - Sprint Milestones")
      .select({
        view: "Grid view",
      })
      .all();
    for (const record of milestoneRecords) {
      // Create a Sprint Milestone object and add it to the array to return
      const milestone = this.formatMilestone(record);
      sprintMilestones.push(milestone);
    }

    // Nest relevant SprintMilestones objects within each Objective
    for (const milestone of sprintMilestones) {
      if (milestone.objective) {
        if (Array.isArray(milestone.objective)) {
          for (const objectiveId of milestone.objective) {
            const index = objectives.findIndex((x) => x.id === objectiveId);
            if (index >= 0) {
              objectives[index].sprintMilestones.push(milestone);
            }
          }
        } else {
          const index = objectives.findIndex(
            (x) => x.id === milestone.objective
          );
          if (index) {
            objectives[index].sprintMilestones.push(milestone);
          }
        }
      }
    }

    return objectives;
  }
}

export default ObjectivesDao;
