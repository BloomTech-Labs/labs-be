import { ILabsApplication } from "@entities/TeambuildingPayload";
import { ILabsTimeSlot } from "@entities/LabsTimeSlot";
import SalesforceClient from "./client";

export default class LabsTimeSlotDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
  }

  /**
   * Gets the IDs and names of all Labs Time Slots in Salesforce.
   */
  public async getLabsTimeSlots(): Promise<ILabsTimeSlot[]> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Name FROM Labs_Time_Slot__c
      `, {},
      (err, result) => {
        if (err) {
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    const labsTimeSlots: ILabsTimeSlot[] = (
      sfResult.records as Record<string, string>[]
    ).map((record) => ({
      id: record.Id,
      name: record.Name,
    }));

    return labsTimeSlots;
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
