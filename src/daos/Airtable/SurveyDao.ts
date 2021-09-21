import Airtable, { FieldSet, Records } from "airtable";

class SurveyDao {
  base_id = "appvMqcwCQosrsHhM";
  api_key = process.env.AT_API_KEY;
  airtable = new Airtable({ apiKey: this.api_key }).base(this.base_id);

  public async getAll(): Promise<Records<FieldSet>> {
    const surveys = await this.airtable("Labs - TBSurveys")
      .select({
        view: "Grid view",
      })
      .all();

    return surveys;
  }

  public async getCohort(cohort: string): Promise<Records<FieldSet>> {
    const surveys = await this.airtable("Labs - TBSurveys")
      .select({
        view: cohort,
      })
      .all();

    return surveys;
  }
}

export default SurveyDao;
