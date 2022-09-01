import { ILabsApplication } from "@entities/TeambuildingPayload";
import SalesforceClient from "./client";

export default class ContactDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
  }

  /**
   * Gets a learner's Salesforce Account ID from their Okta ID.
   *
   * @param oktaId string
   */
  public async getJDSTrackEnrollmentByOktaId(
    oktaId: string,
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
      (sfResult.records as Record<string, unknown>[])[0].AccountId as string
    );
  }

  /**
  * Posts a learner's GitHub profile URL to their Salesforce Contact.
  *
  * @param salesforceId string
  * @param gitHubUrl string
  */
  public async postGitHubUrl(
    salesforceId: string,
    gitHubUrl: string
  ): Promise<void> {
    await this.client.login();
    const success = await this.client.connection.sobject("Contact").update({
      Id: salesforceId,
      GitHub_Link__c: gitHubUrl,
    }, {},
    (err, result) => {
      if (err) {
        void Promise.reject(err);
      } else {
        return result;
      }
    });
    return Promise.resolve();
  }
}
