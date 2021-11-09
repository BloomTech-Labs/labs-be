import { Objective, SprintMilestone, ObjectiveType } from "@entities/Objective";

import Airtable, { FieldSet, Records } from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";

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
   *  Get all objectives.
   */
  public async getAll(): Promise<Records<FieldSet>> {
    const objectives = await this.airtable("Labs - Objectives")
      .select({
        view: "Grid view",
      })
      .all();

    return objectives;
  }

  /**
   *  Get one objective by ID.
   *  @param id
   */
  public async getOne(
    id: string
  ): Promise<Record<string, unknown> | null> {
    const objectives = await this.airtable("Labs - Objectives")
      .select({
        view: "Grid view",
        maxRecords: 1,
        filterByFormula: `{ID} = "${id}"`,
      })
      .all();

    if (objectives.length) {
      const objective = objectives[0];
      return objective as unknown as Record<string, unknown>;
    } else {
      return null;
    }
  }

  /**
   *  Get all objectives for the given role.
   *  @param role
   */
  public async getRole(role: string): Promise<Records<FieldSet>> {
    const objectives = await this.airtable("Labs - Objectives")
      .select({
        view: `${role}`,
      })
      .all();

    return objectives;
  }

}


export default ObjectivesDao;
