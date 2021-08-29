import Airtable from 'airtable';



class SurveyDao {

    base_id = 'appvMqcwCQosrsHhM';
    api_key = process.env.AT_API_KEY;
    airtable = new Airtable({apiKey: this.api_key}).base(this.base_id);
  
  
    public async getAll(): Promise<any> {
 
      const surveys = await this.airtable('Labs - TBSurveys').select({
          view: "Labs37"
      }).all();

      return surveys;

    }
  }
  
  export default SurveyDao;