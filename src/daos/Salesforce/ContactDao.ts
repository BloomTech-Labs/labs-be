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
  public async getSalesforceIdByOktaId(
    oktaId: string,
  ): Promise<string> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT AccountId, Okta_Id__c
        FROM Contact
        WHERE Okta_Id__c = '${oktaId}'
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
   * Get ALL ACTIVE LABS LEARNERS CURRENT_UNIT 6 - 10.
   *
   * 
   */
  public async getAllActiveLabsLearners(): Promise<string> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `SELECT name, Current_Unit__c 
        FROM Contact 
        WHERE Current_Unit__c='6' 
        OR Current_Unit__c='7'
        OR Current_Unit__c='8'
        OR Current_Unit__c='9'
        OR Current_Unit__c='10'
      `, {},

      (err, result) => {
        if (err) {
          void Promise.reject(err);
        } else {
          console.log(result.records);
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
