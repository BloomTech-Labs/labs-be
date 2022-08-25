import { ILabsApplication } from "@entities/TeambuildingPayload";
import SalesforceClient from "./client";

export default class LabsApplicationDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
  }

  /**
   * Write a Labs Application to a learner record in Salesforce.
   *
   * @param oktaId string
   * @param labsApplication ILabsApplication
   */
  public async postLabsApplication(
    oktaId: string,
    labsApplication: ILabsApplication
  ): Promise<void> {

    const tempOktaId = "0036f00003iv0xYAAQ";

    await this.client.login();


    // Contact ?
    //  -> Current_Application__c: Application__c ?
    //    -> JDS_Track_Enrollment__c 
    //      -> Labs_Application [PENDING]

    // const accountId = "0017e00001Z3LUcAAN";
    // await this.client.login();
    // await this.client.connection
    //   .sobject("Account")
    //   .retrieve("0017e00001Z3LUcAAN", function (err, account) {
    //     if (err) {
    //       return console.error(err);
    //     }
    //     console.log(account);
    //   });

    
    // const sfResult = this.client.connection.query(
    //   // return 100 with both Okta and Github not null
    //   `SELECT Name, Contact__c, Contact__r.name, Contact__r.Okta_Id__c, Contact__r.Github_Handle__c
    //   FROM JDS_Track_Enrollment__c
    //   WHERE Name!=null
    //   LIMIT 100`, {},

    //   (err, result) => {
    //     if (err) {
    //       void Promise.reject(err);
    //     } else {
    //       console.log(result.records);
    //       return(result.records);
    //     }
    //   }
    // );



    return Promise.resolve();
  }
}
