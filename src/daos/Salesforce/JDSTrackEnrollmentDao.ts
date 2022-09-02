import { parseTrack, Track } from "@entities/TeambuildingOutput";
import { ILabsApplication, ISalesforceLearner, ITeamBuildingLearner } from "@entities/TeambuildingPayload";
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
      (sfResult.records as Record<string, unknown>[])[0].Id as string
    );
  }

  /**
   * Gets a learner's track by their JDS Track Enrollment ID.
   */
  public async getTrack(
    jdsTrackEnrollmentId: string
  ): Promise<Track | null> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Class_Applied_For__c
        FROM JDS_Track_Enrollment__c
        WHERE Id = '${jdsTrackEnrollmentId}'
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

    const sfTrack = (
      sfResult.records as Record<string, unknown>[]
    )[0].Class_Applied_For__c as string;
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
        `
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
        `
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
        `
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
        `
    }

    await this.client.login();
    const sfResult = await this.client.connection.query(
      query, {},
      (err, result) => {
        if (err) {
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    console.log(sfResult);
    // const learners = (sfResult.records as ISalesforceLearner[]).map((record) => ({
    //   oktaId: record.,
    //   name: string,
    //   track: track,
    //   storyPoints: 0, // TODO: Get from Canvas
    //   labsProject: string,
    //   labsTimeSlot: string[],
    //   gitHubHandle: string,
    //   gitExpertise: number,
    //   dockerExpertise: number,
    //   playByEar: number,
    //   detailOriented: number,
    //   speakUpInDiscussions: number,
    //   soloOrSocial: string,
    //   meaningOrValue: string,
    //   feelsRightOrMakesSense: string,
    //   favoriteOrCollect: string,
    //   tpmSkill1: string,
    //   tpmSkill2: string,
    //   tpmSkill3: string,
    //   tpmInterest1: number,
    //   tpmInterest2: number,
    //   tpmInterest3: number,
    //   tpmInterest4: number
    // }));
    // return Promise.resolve(learners);
    return Promise.resolve(sfResult as unknown as ITeamBuildingLearner[]);
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
    const sfResult = await this.client.connection.sobject(
      "JDS_Track_Enrollment__c"
    ).update({
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
    });
    return Promise.resolve();
  }
}
