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
          console.log(result.records);
          return(result.records);
        }
      }
    );
    return Promise.resolve(
      (sfResult.records as Record<string, unknown>[])[0].AccountId as string
    );
  }
}
