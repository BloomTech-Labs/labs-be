import { ILabsApplication } from "@entities/TeambuildingPayload";
import { ILabsTimeSlot } from "@entities/LabsTimeSlot";
import SalesforceClient from "./client";

export default class LabsTimeSlotDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
  }

  /**
   * Get the short name of a Labs Time Slot by its name in Salesforce.
   *
   * @param sfTimeSlotName: string
   */
  public getShortName(sfTimeSlotName: string): string {
    const sfTimeSlots: Record<string, string> = { 
      "Morning (Web + DS): 8 AM – 11 AM Pacific": "Morning",
      "Afternoon (Web + BD): 12 PM – 3 PM Pacific": "Afternoon",
      "Evening (Web + BD): 3 PM – 6 PM Pacific": "Evening",
      "Night (Web + DS): 6 PM – 9 PM Pacific": "Night",
    }
    return sfTimeSlots[sfTimeSlotName];
  }

  /**
   * Get the Salesforce name of a Labs Time Slot by its short name.
   *
   * @param shortName: string
   */
  public getSalesforceName(shortName: string): string {
    const timeSlots: Record<string, string> = { 
      Morning: "Morning (Web + DS): 8 AM – 11 AM Pacific",
      Afternoon: "Afternoon (Web + BD): 12 PM – 3 PM Pacific",
      Evening: "Evening (Web + BD): 3 PM – 6 PM Pacific",
      Night: "Night (Web + DS): 6 PM – 9 PM Pacific",
    }
    return timeSlots[shortName];
  }

  /**
   * Gets the IDs and names of all Labs Time Slots in Salesforce.
   */
  public async getLabsTimeSlots(): Promise<ILabsTimeSlot[]> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Name, Tracks__c FROM Labs_Time_Slot__c
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
      shortName: this.getShortName(record.Name),
      tracks: record.Tracks__c.split(";"),
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
