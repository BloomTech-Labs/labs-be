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

  public async getProject(projectId: string): Promise<FinalLabsProject | null> {
    await this.client.login();
    const sfResult = await this.client.connection.query<{
      Labs_Time_Slot__r: { Name: string };
      Team_Code__c: string;
      Release_Manager__c: string;
      Labs_Product__r: { Name: string };
    }>(
      `SELECT Labs_Time_Slot__r.Name, Team_Code__c, Release_Manager__c, Labs_Product__r.Name FROM Labs_Project__c Where Id = '${projectId}'`,
      {},
      (err, result) => {
        if (err) {
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    return sfResult.records.map((record) => ({
      labsProduct: record.Labs_Product__r.Name,
      releaseManager: record.Release_Manager__c,
      timeSlot: record.Labs_Time_Slot__r.Name,
      teamCode: record.Team_Code__c,
    }))[0];
    console.log({ sfResult });
  }
}
