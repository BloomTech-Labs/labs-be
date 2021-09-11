import Airtable from 'airtable';
import { AirtableBase } from 'airtable/lib/airtable_base';


class CanvasCoursesDao {

  private api_key: string;
  private base_id: string;
  public airtable: AirtableBase;

  constructor () {
    if (!process.env.AT_API_KEY) {
      throw new Error("Missing Airtable API key");
    }
    if (!process.env.AT_SMT_BASE_ID) {
      throw new Error("Missing Airtable base ID");
    }

    this.api_key = process.env.AT_API_KEY;
    this.base_id = process.env.AT_SMT_BASE_ID;
    this.airtable = new Airtable({apiKey: this.api_key}).base(this.base_id);
  }
  

  /**
   *
   */
  public async getAll(): Promise<any> {
    const courses = await this.airtable('Labs - Courses').select({
        view: "Grid view"
    }).all();

    return courses;
  }

  /**
   *  @param cohort
   */
  public async getObjectiveCourseByRole(role : string): Promise<any> {
    const courses = await this.airtable('Labs - Courses').select({
        view: `Objective Courses`,
        maxRecords: 1,
        filterByFormula: `{Role} = "${role}"`,
    }).all();

    if (courses.length) {
      if (courses [0].fields) {
        return courses [0].fields ['Course ID'];
      } 
    }

    return null; // TODO: Do we want to return null or [] ?
  }

}
  
  export default CanvasCoursesDao;