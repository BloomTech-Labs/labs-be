import { stringify } from "querystring";
import SalesforceClient from "./client";

export interface FinalLabsProject {
  labsProduct: string;
  releaseManager: string;
  timeSlot: string;
  teamCode: string;
}

export default class LabsProjectDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
  }

  public async getProject(projectId: string): Promise<FinalLabsProject | null>  {
    await this.client.login();
    const sfResult = this.client.connection.query<{Labs_Time_Slot__c: string; Team_Code__c: string; Release_Manager__c: string, Labs_Product__r:{Name: string}}>(
      `SELECT Labs_Time_Slot__c, Team_Code__c, Release_Manager__c, Labs_Product__r.Name FROM Labs_Project__c Where Id = '${projectId}'`
    )
    return (await sfResult).records.map(record => ({labsProduct: record.Labs_Product__r.Name, releaseManager: record.Release_Manager__c, timeSlot: record.Labs_Time_Slot__c, teamCode: record.Team_Code__c}))[0]
  }
}

