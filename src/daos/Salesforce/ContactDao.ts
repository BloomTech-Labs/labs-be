import LabsProject from "@entities/LabsProject";
import {
  ILabsApplication,
  ITeamBuildingProject,
} from "@entities/TeambuildingPayload";
import SalesforceClient from "./client";

export default class ContactDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
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
      project.teamMemberSmtIds = trackEnrollments.records
        .map((record) => record.Contact__r["Okta_Id__c"])
        .filter(Boolean);
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
