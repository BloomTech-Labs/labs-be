import { ILabsTimeSlot } from "@entities/LabsTimeSlot";
import { ILabsApplication, ISalesforceLabsApplication } from "@entities/TeambuildingPayload";
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
   * Format a Labs Application to be written to Salesforce
   *
   * @param labsApplication ILabsApplication
   * @param labsTimeSlots: ILabsTimeSlot[]
   * @param jdsTrackEnrollmentId: string
   */
  public formatLabsApplicationForSalesforce(
    labsApplication: ILabsApplication,
    labsTimeSlots: ILabsTimeSlot[],
    jdsTrackEnrollmentId: string
  ): ISalesforceLabsApplication {
    // Get the relevant time slot ID by name
    const labsTimeSlot = labsTimeSlots.find(
      slot => slot.name === labsApplication.labsTimeSlot[0]
    )?.id;
    if (!labsTimeSlot) {
      throw new Error("Invalid Labs Application");
    }

    const sfLabsApplication: ISalesforceLabsApplication = {
      Labs_Time_Slot__c: labsTimeSlot,
      Your_Github_handle__c: labsApplication.gitHubHandle,
      Git_Expertise__c: labsApplication.gitExpertise,
      Docker_expertise__c: labsApplication.dockerExpertise,
      Play_By_Ear__c: labsApplication.playByEar,
      Detail_Oriented__c: labsApplication.detailOriented,
      Speak_Up_In_Discussions__c: labsApplication.speakUpInDiscussions,
      What_activitie_do_you_prefer__c: labsApplication.soloOrSocial,
      What_do_you_prefer_to_seek_in_your_work__c: labsApplication.meaningOrValue,
      feelsRightOrMakesSense: labsApplication.feelsRightOrMakesSense,
      Choices_are_easier_when__c: labsApplication.feelsRightOrMakesSense,
      In_general_which_method_do_you_prefer__c: labsApplication.favoriteOrCollect,
      Technical_project_manager_should__c: labsApplication.tpmSkill1,
      When_their_team_is_facing_a_blocker__c: labsApplication.tpmSkill2,
      Interested_in_becoming_a_people_manager__c: labsApplication.tpmInterest1,
      I_enjoy_running_meetings__c: labsApplication.tpmInterest3,
      I_enjoy_managing_the_flow_of_information__c: labsApplication.tpmInterest4,
      How_do_you_approach_the_situation__c: labsApplication.tpmSkill3,
      JDS_Track_Enrollment__c: jdsTrackEnrollmentId,
    };

    return sfLabsApplication;
  }

  /**
   * Write a Labs Application to a learner record in Salesforce.
   *
   * @param jdsTrackEnrollmentId: string
   * @param labsTimeSlots: ILabsTimeSlot[]
   * @param labsApplication ILabsApplication
   */
  public async postLabsApplication(
    jdsTrackEnrollmentId: string,
    labsTimeSlots: ILabsTimeSlot[],
    labsApplication: ILabsApplication
  ): Promise<void> {
    // Format the Labs Application for Salesforce
    let sfLabsApplication: ISalesforceLabsApplication | null = null;
    try {
      sfLabsApplication = this.formatLabsApplicationForSalesforce(
        labsApplication, labsTimeSlots, jdsTrackEnrollmentId
      );
    } catch (error) {
      void Promise.reject(error);
    }
    
    // Write the Labs Application to Salesforce
    await this.client.login();
    const sfResult = await this.client.connection.sobject("Labs_Application__c").create({
      ...sfLabsApplication,
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
