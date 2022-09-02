import { parseTrack, Track } from "@entities/TeambuildingOutput";
import {
  ILabsApplication,
  ISalesforceLearner,
  ITeamBuildingLearner,
} from "@entities/TeambuildingPayload";
import { getRandomValue } from "@shared/functions";
import SalesforceClient from "./client";

export default class JDSTrackEnrollmentDao {
  private client: SalesforceClient;

  constructor() {
    this.client = new SalesforceClient();
  }

  /**
   * Gets a learner's JDS Track Enrollment ID by their Okta ID.
   */
  public async getJdsTrackEnrollmentIdByOktaId(
    oktaId: string
  ): Promise<string> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Application__r.Contact__r.Okta_Id__c
        FROM JDS_Track_Enrollment__c
        WHERE Application__r.Contact__r.Okta_Id__c='${oktaId}'
        LIMIT 1
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
    console.log({sfResult})
    return Promise.resolve(
      (sfResult.records as Record<string, unknown>[])[0].Id as string
    );
  }
  /**
   * Gets a learner's JDS Track Enrollment ID by their Lambda ID.
   */
  public async getJdsTrackEnrollmentIdByLambdaId(
    lambdaId: string
  ): Promise<string> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Application__r.Contact__r.Lambda_ID__c
        FROM JDS_Track_Enrollment__c
        WHERE Application__r.Contact__r.Lambda_ID__c='${lambdaId}'
        LIMIT 1
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
    console.log({sfResult})
    return Promise.resolve(
      (sfResult.records as Record<string, unknown>[])[0].Id as string
    );
  }

  /**
   * Gets a learner's track by their JDS Track Enrollment ID.
   */
  public async getTrack(jdsTrackEnrollmentId: string): Promise<Track | null> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Class_Applied_For__c
        FROM JDS_Track_Enrollment__c
        WHERE Id = '${jdsTrackEnrollmentId}'
        LIMIT 1
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

    const sfTrack = (sfResult.records as Record<string, unknown>[])[0]
      .Class_Applied_For__c as string;
    const track = parseTrack(sfTrack);
    if (!track) {
      void Promise.reject("Invalid track");
    }
    return Promise.resolve(track);
  }

  /**
   * Gets all active Labs learners from Salesforce, including their Labs Applications.
   */
  public async getLabsActive(track: Track): Promise<ITeamBuildingLearner[]> {
    // Labs sprints are different by track
    let query = "";
    switch (track) {
      case Track.WEB:
        query = `
          SELECT
            Labs_Time_Slot__c,
            Your_Github_handle__c,
            Git_Expertise__c,
            Docker_expertise__c,
            Play_By_Ear__c,
            Detail_Oriented__c,
            Speak_Up_In_Discussions__c,
            What_activities_do_you_prefer__c,
            What_do_you_prefer_to_seek_in_your_work__c,
            Choices_are_easier_when__c,
            In_general_which_method_do_you_prefer__c,
            Technical_project_manager_should__c,
            When_their_team_is_facing_a_blocker__c,
            Interested_in_becoming_a_people_manager__c,
            I_enjoy_running_meetings__c,
            I_enjoy_managing_the_flow_of_information__c,
            How_do_you_approach_the_situation__c,
            JDS_Track_Enrollment__c,
            JDS_Track_Enrollment__r.Labs_Projects__c, JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__c, JDS_Track_Enrollment__r.Contact__r.Okta_Id__c, JDS_Track_Enrollment__r.Contact__r.Name
          FROM Labs_Application__c
          WHERE JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__r.Sprint_Number__c >= 21 AND JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__r.Sprint_Number__c <= 24
          AND JDS_Track_Enrollment__r.Class_Applied_For__c = 'CS Web Dev'
        `;
      case Track.DS:
        query = `
          SELECT
            Labs_Time_Slot__c,
            Your_Github_handle__c,
            Git_Expertise__c,
            Docker_expertise__c,
            Play_By_Ear__c,
            Detail_Oriented__c,
            Speak_Up_In_Discussions__c,
            What_activities_do_you_prefer__c,
            What_do_you_prefer_to_seek_in_your_work__c,
            Choices_are_easier_when__c,
            In_general_which_method_do_you_prefer__c,
            Technical_project_manager_should__c,
            When_their_team_is_facing_a_blocker__c,
            Interested_in_becoming_a_people_manager__c,
            I_enjoy_running_meetings__c,
            I_enjoy_managing_the_flow_of_information__c,
            How_do_you_approach_the_situation__c,
            JDS_Track_Enrollment__c,
            JDS_Track_Enrollment__r.Labs_Projects__c, JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__c, JDS_Track_Enrollment__r.Contact__r.Okta_Id__c, JDS_Track_Enrollment__r.Contact__r.Name
          FROM Labs_Application__c
          WHERE JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__r.Sprint_Number__c >= 21 AND JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__r.Sprint_Number__c <= 24
          AND JDS_Track_Enrollment__r.Class_Applied_For__c = 'Data Science'
        `;
        break;
      case Track.BD:
        query = `
          SELECT
            Labs_Time_Slot__c,
            Your_Github_handle__c,
            Git_Expertise__c,
            Docker_expertise__c,
            Play_By_Ear__c,
            Detail_Oriented__c,
            Speak_Up_In_Discussions__c,
            What_activities_do_you_prefer__c,
            What_do_you_prefer_to_seek_in_your_work__c,
            Choices_are_easier_when__c,
            In_general_which_method_do_you_prefer__c,
            Technical_project_manager_should__c,
            When_their_team_is_facing_a_blocker__c,
            Interested_in_becoming_a_people_manager__c,
            I_enjoy_running_meetings__c,
            I_enjoy_managing_the_flow_of_information__c,
            How_do_you_approach_the_situation__c,
            JDS_Track_Enrollment__c,
            JDS_Track_Enrollment__r.Labs_Projects__c, JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__c, JDS_Track_Enrollment__r.Contact__r.Okta_Id__c, JDS_Track_Enrollment__r.Contact__r.Name
          FROM Labs_Application__c
          WHERE JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__r.Sprint_Number__c >= 33 AND JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__r.Sprint_Number__c <= 36
          AND JDS_Track_Enrollment__r.Class_Applied_For__c = 'Backend'
        `;
        break;
      default:
        query = `
          SELECT
            Labs_Time_Slot__c,
            Your_Github_handle__c,
            Git_Expertise__c,
            Docker_expertise__c,
            Play_By_Ear__c,
            Detail_Oriented__c,
            Speak_Up_In_Discussions__c,
            What_activities_do_you_prefer__c,
            What_do_you_prefer_to_seek_in_your_work__c,
            Choices_are_easier_when__c,
            In_general_which_method_do_you_prefer__c,
            Technical_project_manager_should__c,
            When_their_team_is_facing_a_blocker__c,
            Interested_in_becoming_a_people_manager__c,
            I_enjoy_running_meetings__c,
            I_enjoy_managing_the_flow_of_information__c,
            How_do_you_approach_the_situation__c,
            JDS_Track_Enrollment__c,
            JDS_Track_Enrollment__r.Labs_Projects__c, JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__c, JDS_Track_Enrollment__r.Contact__r.Okta_Id__c, JDS_Track_Enrollment__r.Contact__r.Name
          FROM Labs_Application__c
          WHERE JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__r.Sprint_Number__c >= 21 AND JDS_Track_Enrollment__r.Current_JDS_Sprint_Enrollment__r.Sprint_Number__c <= 24
          AND JDS_Track_Enrollment__r.Class_Applied_For__c = 'CS Web Dev'
        `;
    }

    await this.client.login();
    const sfResult = await this.client.connection.query(
      query,
      {},
      (err, result) => {
        if (err) {
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    const learners = (sfResult.records as Record<string, unknown>[]).map(
      (record) => {
        const jdsTrackEnrollment = record.JDS_Track_Enrollment__r as Record<
          string,
          unknown
        >;
        const contact = jdsTrackEnrollment.Contact__r as Record<
          string,
          unknown
        >;
        return {
          oktaId: contact.Okta_Id__c as string,
          name: contact.Name as string,
          track: track,
          storyPoints: 0, // TODO: Get from Canvas
          labsProject: jdsTrackEnrollment.Labs_Projects__c as string,
          labsTimeSlot: [record.Labs_Time_Slot__c as string],
          gitHubHandle: record.Your_Github_handle__c as string,
          gitExpertise: record.Git_Expertise__c as number,
          dockerExpertise: getRandomValue([2, 3]) as number, // TODO: Still not in SFDC
          playByEar: record.Play_By_Ear__c as number,
          detailOriented: record.Detail_Oriented__c as number,
          speakUpInDiscussions: record.Speak_Up_In_Discussions__c as number,
          soloOrSocial: record.What_activities_do_you_prefer__c as string,
          meaningOrValue:
            record.What_do_you_prefer_to_seek_in_your_work__c as string,
          feelsRightOrMakesSense: record.Choices_are_easier_when__c as string,
          favoriteOrCollect:
            record.In_general_which_method_do_you_prefer__c as string,
          tpmSkill1: record.Technical_project_manager_should__c as string,
          tpmSkill2: record.When_their_team_is_facing_a_blocker__c as string,
          tpmSkill3: record.How_do_you_approach_the_situation__c as string,
          tpmInterest1:
            record.Interested_in_becoming_a_people_manager__c as number,
          tpmInterest2: getRandomValue([2, 3]) as number,
          tpmInterest3: record.I_enjoy_running_meetings__c as number,
          tpmInterest4:
            record.I_enjoy_managing_the_flow_of_information__c as number,
        };
      }
    );
    return Promise.resolve(learners);
  }

  /**
   * Posts a learner's project assignment to Salesforce.
   *
   * @param jdsTrackEnrollmentId: string
   * @param projectId: string
   */
  public async postProjectAssignment(
    jdsTrackEnrollmentId: string,
    projectId: string
  ): Promise<void> {
    await this.client.login();
    const sfResult = await this.client.connection
      .sobject("JDS_Track_Enrollment__c")
      .update(
        {
          Id: jdsTrackEnrollmentId,
          Labs_Projects__c: projectId,
        },
        (error, result) => {
          if (error || !result.success) {
            console.error(error, result);
            void Promise.reject(error);
          }
          console.log("Updated Successfully : ", result);
          return result;
        }
      );
    return Promise.resolve();
  }
}
