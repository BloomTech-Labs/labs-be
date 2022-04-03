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
   *  Get all courses from the "Labs - Courses" table.
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
   *  Get the course IDs for a learner with the given track.
   *
   *  @param role
   */
  public async getCoursesByTrack(
    track: string
  ): Promise<number[] | null> {
    const courses = await this.airtable("Labs - Courses")
      .select({
        view: "Grid view",
        filterByFormula: `SEARCH("${track}",{Track})`,

      })
      .all();

    if (courses.length) {
      return courses.map(course => course.fields["Course ID"] as number);
    }

    return null;
  }

  /**
   *  Get all modules from the given course that must be completed to complete the
   *  course.
   *
   *  @param courseId
   */
  public async getCompletionModules(
    courseId: number
  ): Promise<number[] | null> {
    const courses = await this.airtable("Labs - Courses")
      .select({
        view: "Grid view",
        maxRecords: 1,
        filterByFormula: `{Course ID} = ${courseId}`,
      })
      .all();

    if (courses.length) {
      if (courses[0].fields) {
        // The "Completion Modules" field contains a comma-separated list of Canvas
        // module IDs
        return JSON.parse(
          `[${courses[0].fields["Completion Modules"] as string}]`
        ) as number[];
      }
    }

    return null;
  }

  /**
   *  Get the Canvas quiz IDs for the Labs Application role quizzes from Airtable.
   *
   *  @param role
   */
  public async getRoleQuizIds(): Promise<Record<string, number>[]> {
    const records = await this.airtable("Labs - Courses")
      .select({
        view: "Grid view",
        filterByFormula: "{Type} = 'Role Course'",
      })
      .all();

    const roleQuizzes: Record<string, number>[] = records.map((record) => {
      // Build and return an array of the form:
      // [
      //   { "Technical Project Manager": 48123 },
      //   ...
      //   { "UX Engineer": 42345 }
      // ]
      const roleQuiz = {} as Record<string, number>;
      const role = record.fields["Role"] as string;
      roleQuiz[role] = record.fields["Role Quiz ID"] as number;
      return roleQuiz;
    });

    return roleQuizzes;
  }

  /**
   *  Get the Canvas quiz IDs for the Final Labs Application quizzes from Airtable.
   *
   *  @param role
   */
  public async getFinalApplicationQuizIds(): Promise<Record<
    string,
    number
  > | null> {
    const records = await this.airtable("Labs - Courses")
      .select({
        view: "Grid view",
        maxRecords: 1,
        filterByFormula: "{Name} = 'Labs Application'",
      })
      .all();

    if (records.length) {
      // Expects JSON of the form: { "web": 3245, "ds": 2345 }
      return JSON.parse(
        records[0].fields["Final Application Quizzes"] as string
      ) as Record<string, number>;
    }

    return null;
  }

  /**
   *  Get the Canvas course ID of the Labs Application course from Airtable.
   *
   *  @param role
   */
  public async getLabsApplicationCourseId(): Promise<number | null> {
    const courses = await this.airtable("Labs - Courses")
      .select({
        view: "Grid view",
        maxRecords: 1,
        filterByFormula: "{Name} = 'Labs Application'",
      })
      .all();

    if (courses.length) {
      if (courses[0].fields) {
        return courses[0].fields["Course ID"] as number;
      }
    }

    return null;
  }
}

export default CanvasCoursesDao;
