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
      `,
      {},
      (err, result) => {
        if (err) {
          console.error(err);
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    const sfLabsProjects = sfResult.records as Record<string, unknown>[];
    console.log(sfLabsProjects);
    const labsProjects = sfLabsProjects.map((record) => ({
      id: record.Name as string,
      product: record.Labs_Product__c as string,
      teamCode: record.Team_Code__c as string,
      tracks: ((record.Tracks__c as string) || "").split(";").filter((x) => x),
      releaseManager: (record.Release_Manager__c as string) || "",
      // teamMemberSmtIds need to be converted from Salesforce Contact IDs
      // into oktaIds.
      teamMemberSmtIds: (record.Team_Members__c as string[]) || [],
    }));

    return Promise.resolve(labsProjects);
  }

  /**
   * Gets the ID of a Labs Project by its name.
   */
  public async getIdByName(projectName: string): Promise<string> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Name
        FROM Labs_Project__c
        WHERE Name = '${projectName}'
        LIMIT 1
      `,
      {},
      (err, result) => {
        if (err) {
          console.error(err);
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    const sfProjectId = (sfResult.records as Record<string, unknown>[])[0];
    console.log(sfProjectId);
    const projectId = sfProjectId.Id as string;
    return Promise.resolve(projectId);
  }
}
