import { Learner, parseTrack, Track } from "@entities/TeambuildingOutput";
import Airtable, { FieldSet, RecordData, Records } from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import ProjectsDao from "./ProjectsDao";
import { chunkArray } from "@shared/functions";
import Bottleneck from "bottleneck";

const projectsDao = new ProjectsDao();

const AT_RATE_LIMIT = 5; // Max requests / second
const PATCH_PAYLOAD_LIMIT = 10; // Max records / payload

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
  public async getOne(
    lambdaId: string
  ): Promise<Record<string, unknown> | null> {
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
  public async getByRecordId(
    recordId: string
  ): Promise<Record<string, unknown> | null> {
    const records = await this.airtable("Students")
      .select({
        view: "Grid view",
        maxRecords: 1,
        filterByFormula: `{Record ID} = "${recordId}"`,
      })
      .all();

    if (records.length) {
      const record = records[0];
      const student = record?.fields as Record<string, unknown>;
      return student;
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

  /**
   *  @param lambdaIds
   */
  public async getByLambdaIds(
    lambdaIds: Array<string>
  ): Promise<Records<FieldSet>> {
    // Generate a list of Airtable formula conditions of the form:
    //  OR(
    //    {Lambda ID} != "lambdaId1",
    //    {Lambda ID} != "lambdaId2",
    //    {Lambda ID} != "lambdaId3",
    //    {Lambda ID} != "lambdaId4"
    //  )
    const lambdaIdConditions = lambdaIds
      .map((lambdaId) => `{Lambda ID} = "${lambdaId}"`)
      .toString();
    const formula = `OR(${lambdaIdConditions})`;

    const students = await this.airtable("Students")
      .select({
        view: "Grid view",
        filterByFormula: formula,
      })
      .all();

    return students;
  }

  /**
   * Get the given learner's role.
   *
   * @param lambdaId
   * @returns
   */
  public async getRole(lambdaId: string): Promise<string | null> {
    const record: Record<string, unknown> | null = await this.getOne(lambdaId);
    if (!record) {
      return null;
    }
    const learner = record.fields as Record<string, string[]>;

    const labsRole: string = learner["Labs Role"][0];
    return labsRole;
  }

  /**
   * Get a track by its SMT record ID in the `Courses` table.
   *
   * @param recordId
   * @returns
   */
  public async getTrackByTrackRecordId(
    recordId: string
  ): Promise<Track | null> {
    const result = await this.airtable("Courses")
      .select({
        view: "Grid view",
        filterByFormula: `{Record ID} = "${recordId}"`,
      })
      .all();
    const track = result[0].fields["Name"] as string;
    return parseTrack(track);
  }

  /**
   * Get the given learner's track.
   *
   * @param lambdaId
   * @returns
   */
  public async getTrack(lambdaId: string): Promise<Track | null> {
    const record: Record<string, unknown> | null = await this.getOne(lambdaId);
    if (!record) {
      return null;
    }
    const learner = record.fields as Record<string, string[]>;

    const trackRecordId: string = learner["Course"][0];
    const track = await this.getTrackByTrackRecordId(trackRecordId);

    return track;
  }

  /**
   * Airtable has a patch payload limit of 10 records and an overall
   * rate limit of 5 requests/second. Patch records in a queue with
   * standoffs to accommodate the limits.
   *
   * @param table
   * @param payload
   * @returns
   */
  private async patchLimited(
    table: string,
    payload: RecordData<Partial<FieldSet>>[]
  ): Promise<boolean> {
    // Break the payload into chunks of 10 records each.
    const chunkedPayload = chunkArray(
      payload,
      PATCH_PAYLOAD_LIMIT
    ) as RecordData<Partial<FieldSet>>[][];

    // Send rate-limited patch queries.
    const limiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 1 / AT_RATE_LIMIT,
    });
    limiter.on("error", (error) => {
      console.error(error);
      return false;
    });
    for (const chunk of chunkedPayload) {
      // console.table(chunk.map(x =>x.fields));
      const success = await limiter.schedule(() =>
        this.airtable(table).update(chunk)
      );
      if (!success) {
        return false;
      }
    }
    return true;
  }

  /**
   * Patch the team assignments for a set of learners.
   *
   * This writes updates directly to the Student object.
   *
   * @param cohort
   * @param learners
   * @returns
   */
  public async patchCohortLabsAssignments(
    cohort: string,
    learners: Learner[]
  ): Promise<boolean> {
    // Get Airtable record IDs for each learner.
    const students = await this.getByLambdaIds(
      learners.map((learner) => learner.lambdaId)
    );

    // Get Airtable record IDs for each project.
    const projects = await projectsDao.getCohort(cohort);

    // Combine the record IDs and learner info into a payload.
    const payload = learners.map((learner) => {
      const student = students.find(
        (_student) =>
          ((_student.fields["Lambda ID"] || []) as string[])[0] ===
          learner.lambdaId
      );

      const id = student?.id;
      const prevProjects =
        (student?.fields["Labs - Assigned Projects"] as string[]) || [];

      const projectId = projects.find(
        (project) => project.fields["Name"] === learner.labsProject
      )?.id;

      const assignedProjects = [...new Set([...prevProjects, projectId])];
      
      return {
        id,
        fields: {
          "Labs - Assigned Projects": assignedProjects,
        },
      };
    }) as RecordData<Partial<FieldSet>>[];

    // Patch the Airtable records to update the Labs assignments.
    const success = await this.patchLimited("Students", payload);

    return success ? true : false;
  }
}

export default StudentDao;
