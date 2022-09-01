import { ILabsApplication } from "@entities/TeambuildingPayload";
import SalesforceClient from "./client";

export default class LabsTimeSlotDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
  }

  /**
   * Gets a learner's JDS Track Enrollment ID by their Okta ID.
   */
  public async getJdsTrackEnrollmentIdByOktaId(
    oktaId: string
  ): Promise<string> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Application__r.Contact__r.Okta_Id__c
        FROM JDS_Track_Enrollment__c
        WHERE Application__r.Contact__r.Okta_Id__c='00uiumfop9CMV9wef357'
        LIMIT 1
      `, {},

      (err, result) => {
        if (err) {
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    return Promise.resolve(
      (sfResult.records as Record<string, unknown>[])[0].Id as string
    );
  }


  /**
   * Gets all active Labs learners from Salesforce, including their Labs Applications.
   */
  public async getLabsActive(): Promise<Record<string, unknown>[]> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Contact__c, JDS_Labs_Start_Timestamp__c, JDS_Labs_Completed_Timestamp__c, Labs_Application__c
        FROM JDS_Track_Enrollment__c
        WHERE JDS_Labs_Start_Timestamp__c != NULL
        AND JDS_Labs_Completed_Timestamp__c = NULL
        LIMIT 10000
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
      // TODO: Add entity and assert type before returning
      (sfResult.records as Record<string, unknown>[])
    );
  }
}
