import Airtable, { FieldSet, Records } from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";

class StudentDao {
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
   *
   */
  public async getOne(lambdaId: string): Promise<Record<string, unknown> | null> {
    const students = await this.airtable("Students")
      .select({
        view: "Grid view",
        maxRecords: 1,
        filterByFormula: `{Lambda ID} = "${lambdaId}"`,
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
