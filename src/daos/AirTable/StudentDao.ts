import Airtable, { FieldSet, Records } from "airtable";

class StudentDao {
  base_id = "appvMqcwCQosrsHhM";
  api_key = process.env.AT_API_KEY;
  airtable = new Airtable({ apiKey: this.api_key }).base(this.base_id);

  /**
   *
   */
  public async getAll(): Promise<Records<FieldSet>> {
    const students = await this.airtable("Students")
      .select({
        view: "Grid view",
      })
      .all();

    return students;
  }

  /**
   *  @param cohort
   */
  public async getCohort(cohort: string): Promise<Records<FieldSet>> {
    const students = await this.airtable("Students")
      .select({
        view: `[DND] Labs ${cohort}`,
      })
      .all();

    return students;
  }

  /**
   *  @param email
   */
  public async getByEmail(
    email: string
  ): Promise<Record<string, unknown> | null> {
    const students = await this.airtable("Students")
      .select({
        view: "Grid view",
        maxRecords: 1,
        filterByFormula: `{Email} = "${email}"`,
      })
      .all();

    if (students.length) {
      const student = students[0];
      return student as unknown as Record<string, unknown>;
    } else {
      return null;
    }
  }

  /**
   *  @param email
   */
  public async getByEmails(emails: Array<string>): Promise<Records<FieldSet>> {
    // Generate a list of Airtable formula conditions of the form:
    //  OR(
    //    {name} != "name 1",
    //    {name} != "name 2",
    //    {name} != "name 3",
    //    {name} != "name 4"
    //  )
    const emailConditions = emails
      .map((email) => `{Email} = "${email}"`)
      .toString();
    const formula = `OR(${emailConditions})`;

    const students = await this.airtable("Students")
      .select({
        view: "Grid view",
        filterByFormula: formula,
      })
      .all();

    return students;
  }
}

export default StudentDao;
