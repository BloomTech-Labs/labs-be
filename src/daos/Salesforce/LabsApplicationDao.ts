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
    await this.client.login();
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
    jdsTrackEnrollmentId: string,
    labsApplication: ILabsApplication
  ): Promise<void> {
    await this.client.login(); // logs us into SF Client 🔐
    const sfResult = await this.client.connection.sobject("Labs_Application__c").create({
      ...labsApplication,
      JDS_Track_Enrollment__c: jdsTrackEnrollmentId,
    },
    (err, result) => {
      if (err || !result.success) {
        console.error(err, result);
        void Promise.reject(err);
      }
      console.log("Updated Successfully : ", result);
      return (result);
    });
    console.log(sfResult);
    return Promise.resolve();
  }
}
