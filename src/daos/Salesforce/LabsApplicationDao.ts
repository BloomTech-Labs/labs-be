import { ILabsApplication } from "@entities/TeambuildingPayload";
import SalesforceClient from "./client";

export default class LabsApplicationDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
  }

  /**
   * Get a Labs Application from a learner record in Salesforce.
   *
   * @param oktaId string
   */
  public async getLabsApplicationByOktaId(
    oktaId: string
  ): Promise<ILabsApplication> {
    await this.client.login(); // logs us into SF Client 🔐
    const sfResult = await this.client.connection.query(
      `SELECT Labs_Application__c, Contact__r.Okta_Id__c
      FROM JDS_Track_Enrollment__c
      WHERE Contact__r.Okta_Id__c='${oktaId}'
      LIMIT 1`,
      {},
      (err, result) => {
        if (err) {
          console.error(err);
          // give us a hint as to wot? currently our query is broked
          void Promise.reject(err);
        } else {
          return result.records;
        }
      }
    );
    console.log(sfResult);
    // testing this w/ a functioning query, we get the result. 🚀
    // Once we fix our Query we'll be able to use this to create a Labs App Object 🥜
    //    {
    //   "oktaId": "0ua87nvcgEq7PF5l357",
    //   "email": "kenjigrr@gmail.com",
    //   "slackId": "U025XR1E3J9",
    //   "labsApplication": {
    //     "labsTimeSlot": ["morning", "afternoon", "night"],
    //     "githubHandle": "KemjiGr",
    //     "gitExpertise": "expert",
    //     "dockerExpertise": "expert",
    //     "playByEar": "play it by ear",
    //     "detailOriented": "detail oriented",
    //     "speakUpInDiscussions": "speaks up in discussions",
    //     "soloOrSocial": "social",
    //     "meaningOrValue": "meaning",
    //     "feelsRightOrMakesSense": "feels right",
    //     "favoriteOrCollect": "collect",
    //     "tpmSkill1": "skill 1",
    //     "tpmSkill2": "skill 2",
    //     "tpmSkill3": "skill 3",
    //     "tpmInterest1": "interest 1",
    //     "tpmInterest2": "interest 2",
    //     "tpmInterest3": "interest 3",
    //     "tpmInterest4": "interest 4"
    //   }
    // }

    return (sfResult as unknown) as ILabsApplication;
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
    return Promise.resolve();
  }
}




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