import { ILabsTimeSlot } from "@entities/LabsTimeSlot";
import {
  ILabsApplication,
  ISalesforceLabsApplication,
} from "@entities/TeambuildingPayload";
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
  ): Promise<ILabsApplication | null> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT FIELDS(ALL), JDS_Track_Enrollment__r.Contact__r.Okta_Id__c
        FROM Labs_Application__c
        WHERE JDS_Track_Enrollment__r.Contact__r.Okta_Id__c = '${oktaId}'
        LIMIT 1
      `,
      {},
      (err, result) => {
        if (err) {
          console.error(err);
          void Promise.reject(err);
        } else {
          return result.records;
        }
      }
    );
    const sfLabsApplicationRecords =
      sfResult as unknown as unknown[] as ISalesforceLabsApplication[];
    if (!sfLabsApplicationRecords || !sfLabsApplicationRecords.length) {
      return null;
    }
    const sfLabsApplication = sfLabsApplicationRecords[0];
    if (!sfLabsApplication) {
      return null;
    }
    const labsApplication =
      this.formatLabsApplicationFromSalesforce(sfLabsApplication);
    return labsApplication;
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
    labsTimeSlot: ILabsTimeSlot,
    jdsTrackEnrollmentId: string
  ): ISalesforceLabsApplication {
    const sfLabsApplication: ISalesforceLabsApplication = {
      Labs_Time_Slot__c: labsTimeSlot.id,
      Your_Github_handle__c: labsApplication.gitHubHandle,
      Git_Expertise__c: labsApplication.gitExpertise,
      Docker_expertise__c: labsApplication.dockerExpertise,
      Play_By_Ear__c: labsApplication.playByEar,
      Detail_Oriented__c: labsApplication.detailOriented,
      Speak_Up_In_Discussions__c: labsApplication.speakUpInDiscussions,
      What_activities_do_you_prefer__c: labsApplication.soloOrSocial,
      What_do_you_prefer_to_seek_in_your_work__c:
        labsApplication.meaningOrValue,
      Choices_are_easier_when__c: labsApplication.feelsRightOrMakesSense,
      In_general_which_method_do_you_prefer__c:
        labsApplication.favoriteOrCollect,
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
   * Format a Labs Application read from Salesforce
   *
   * @param sfLabsApplication ISalesforceLabsApplication
   */
  public formatLabsApplicationFromSalesforce(
    sfLabsApplication: ISalesforceLabsApplication
  ): ILabsApplication {
    const labsApplication: ILabsApplication = {
      labsTimeSlot: sfLabsApplication.Labs_Time_Slot__c
        ? [sfLabsApplication.Labs_Time_Slot__c]
        : undefined,
      gitHubHandle: sfLabsApplication.Your_Github_handle__c,
      gitExpertise: sfLabsApplication.Git_Expertise__c,
      dockerExpertise: sfLabsApplication.Docker_expertise__c,
      playByEar: sfLabsApplication.Play_By_Ear__c,
      detailOriented: sfLabsApplication.Detail_Oriented__c,
      speakUpInDiscussions: sfLabsApplication.Speak_Up_In_Discussions__c,
      soloOrSocial: sfLabsApplication.What_activities_do_you_prefer__c,
      meaningOrValue:
        sfLabsApplication.What_do_you_prefer_to_seek_in_your_work__c,
      feelsRightOrMakesSense: sfLabsApplication.feelsRightOrMakesSense__c,
      favoriteOrCollect:
        sfLabsApplication.In_general_which_method_do_you_prefer__c,
      tpmSkill1: sfLabsApplication.Technical_project_manager_should__c,
      tpmSkill2: sfLabsApplication.When_their_team_is_facing_a_blocker__c,
      tpmSkill3: sfLabsApplication.How_do_you_approach_the_situation__c,
      tpmInterest1:
        sfLabsApplication.Interested_in_becoming_a_people_manager__c,
      tpmInterest2: undefined, // TODO: Salesforce is still missing this field.
      tpmInterest3: sfLabsApplication.I_enjoy_running_meetings__c,
      tpmInterest4:
        sfLabsApplication.I_enjoy_managing_the_flow_of_information__c,
    };

    return labsApplication;
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
    labsTimeSlot: ILabsTimeSlot,
    labsApplication: ILabsApplication
  ): Promise<void> {
    // Format the Labs Application for Salesforce
    let sfLabsApplication: ISalesforceLabsApplication | null = null;
    try {
      sfLabsApplication = this.formatLabsApplicationForSalesforce(
        labsApplication,
        labsTimeSlot,
        jdsTrackEnrollmentId
      );
    } catch (error) {
      void Promise.reject(error);
    }

    // Write the Labs Application to Salesforce
    await this.client.login();
    const sfResult = await this.client.connection
      .sobject("Labs_Application__c")
      .create(
        {
          ...sfLabsApplication,
          JDS_Track_Enrollment__c: jdsTrackEnrollmentId,
        },
        (err, result) => {
          if (err || !result.success) {
            console.error(err, result);
            void Promise.reject(err);
          }
          console.log("Updated Successfully : ", result);
          return result;
        }
      );
    console.log(sfResult);
    return Promise.resolve();
  }
}
