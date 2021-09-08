import Airtable from 'airtable';


class CanvasCoursesDao {

    base_id = 'appvMqcwCQosrsHhM';
    api_key = process.env.AT_API_KEY;
    airtable = new Airtable({apiKey: this.api_key}).base(this.base_id);
  
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