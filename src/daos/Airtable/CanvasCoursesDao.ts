import Airtable, { FieldSet, Records } from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";

class CanvasCoursesDao {
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
    const courses = await this.airtable("Labs - Courses")
      .select({
        view: "Grid view",
      })
      .all();

    return courses;
  }


  /**
   *  @param role
   */
  public async getGeneralCourseIds(): Promise<number[] | null> {
    const records = await this.airtable("Labs - Courses")
      .select({
        view: "Curriculum Courses",
        filterByFormula: "{Type} = 'All'",
      })
      .all()

    const courses: number[] =
      records.map(record => record.fields ["Course ID"] as number);

    return courses;
  }


  /**
   *  @param role
   */
  public async getObjectiveCourseIdByRole(role: string): Promise<number | null> {
    const courses = await this.airtable("Labs - Courses")
      .select({
        view: "Objective Courses",
        maxRecords: 1,
        filterByFormula: `{Role} = "${role}"`,
      })
      .all();

    if (courses.length) {
      if (courses[0].fields) {
        return courses[0].fields["Course ID"] as number;
      }
    }

    return null;
  }


  /**
   *  @param role
   */
  public async getCompletionModules(courseId: number): Promise<number[] | null> {
    const courses = await this.airtable("Labs - Courses")
      .select ({
        view: "Curriculum Courses",
        maxRecords: 1,
        filterByFormula: `{Course Id} = ${courseId}`,
      })
      .all ();
    
    if (courses.length) {
      if (courses[0].fields) {
        // The "Completion Modules" field contains a comma-separated list of Canvas
        // module IDs
        return JSON.parse(`[${courses[0].fields["Completion Modules"] as string}]`) as number[];
      }
    }

    return null;
  }

}


export default CanvasCoursesDao;
