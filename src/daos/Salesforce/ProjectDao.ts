import LabsProject from "@entities/LabsProject";
import { ILabsApplication } from "@entities/TeambuildingPayload";
import SalesforceClient from "./client";

export default class ProjectDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
  }

  /**
   * Gets all active Labs projects from Salesforce.
   */
  public async getActive(): Promise<LabsProject[]> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Name, Active__c, Labs_Product__c, Team_Members__c, Team_Code__c, Tracks__c, Release_Manager__c
        FROM Labs_Project__c
        WHERE Active__c = TRUE
        LIMIT 100
      `, {},

      (err, result) => {
        if (err) {
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    console.log(sfResult);
    return Promise.resolve(
      (sfResult.records as LabsProject[])
    );
  }
}
