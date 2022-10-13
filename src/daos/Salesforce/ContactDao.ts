import logger from "@shared/Logger";
import LabsProject from "@entities/LabsProject";
import { Contact, IContact } from "@entities/Contact";
import {
  ILabsApplication,
  ITeamBuildingProject,
} from "@entities/TeambuildingPayload";
import SalesforceClient from "./client";

export default class ContactDao {
  private client: SalesforceClient;

  constructor(client: SalesforceClient | undefined) {
    this.client = client || new SalesforceClient();
  }

  public async buildLargeContactFromOktaId(oktaId: string): Promise<IContact> {
    const sfResult = await this.client.connection
      .sobject("Contact")
      .findOne({ Okta_ID__c: oktaId }, [
        "ID",
        "Okta_ID__c",
        "Lambda_ID__c",
        "Name",
        "Status__c",
        "Learner_Program_Type__c",
        "Github_Handle__c",
        "Github_Link__c",
        "Slack_Display_Name__c",
        "Slack_ID__c",
        "Current_Sprint_Number__c",
        "Current_JDS_Sprint_Number__c",
        "Class_Applied_For__c",
        "Current_Application__r.ID",
        "Current_Application__r.Payment_Type__c",
        "Current_Application__r.Application_Payment_Type__c",
        "Current_Application__r.ISA_Payment_Type__c",
        `(
          SELECT
          ID,
          Class_applied_For__c,
          Labs_Projects__c,
          Current_JDS_Sprint_Enrollment__r.Sprint_Number__c,
          Current_JDS_Sprint_Enrollment__r.Sprint_Name__c,
          CreatedDate
          FROM JDS_Track_Enrollments__r
        )`,
      ])
      .limit(2)
      .execute({}, (err: Error, record) => {
        if (err) {
          return logger.err(err);
        }
        logger.info(record);
        return record;
      });
    logger.info(`sfResult: ${JSON.stringify(sfResult)}`);
    return Promise.resolve(
      sfResult as unknown as IContact
      // (sfResult.records as Record<string, unknown>[])[0] as unknown as IContact
    );
  }

  /**
   * Gets a learner's Salesforce Contact ID from their Okta ID.
   *
   * @param oktaId string
   */
  public async getContactIdByOktaId(oktaId: string): Promise<string> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Okta_Id__c
        FROM Contact
        WHERE Okta_Id__c = '${oktaId}'
      `,
      {},
      (err, result) => {
        if (err) {
          console.log({ err });
          void Promise.reject(err);
        } else {
          console.log(JSON.stringify(result));
          return result;
        }
      }
    );
    return Promise.resolve(
      (sfResult.records as Record<string, unknown>[])[0].Id as string
    );
  }

  /**
   * Converts a LabsProject array's team members from Contact IDs to
   * Okta IDs.
   *
   * @param projects LabsProject[]
   */
  public async getTeamMemberOktaIds(
    projects: ITeamBuildingProject[]
  ): Promise<LabsProject[]> {
    await this.client.login();
    for (const project of projects) {
      const trackEnrollments = await this.client.connection.query<{
        Contact__r: { Okta_Id__c: string };
      }>(
        `
          Select Contact__r.Okta_Id__c from JDS_Track_Enrollment__c Where Labs_Projects__r.Name In ('${project.id}')
        `
      );
      trackEnrollments.records = trackEnrollments.records.filter(
        (record) => record.Contact__r !== null
      );
      project.teamMemberSmtIds = trackEnrollments.records.map(
        (record) => record.Contact__r["Okta_Id__c"]
      );
    }
    return projects as unknown as LabsProject[];
  }

  /**
   * Posts a learner's GitHub profile URL to their Salesforce Contact.
   *
   * @param salesforceId string
   * @param gitHubUrl string
   */
  public async postGitHubUrl(
    contactId: string,
    gitHubUrl: string
  ): Promise<void> {
    await this.client.login();
    console.log("contactId", contactId);
    console.log("gitHubUrl", gitHubUrl);
    const success = await this.client.connection.sobject("Contact").update(
      {
        Id: contactId,
        GitHub_Link__c: gitHubUrl,
      },
      {},
      (err, result) => {
        if (err) {
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    return Promise.resolve();
  }
}
