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
  public async getLabsActive(): Promise<ITeamBuildingLearner[]> {
    await this.client.login();
    const sfResult = await this.client.connection.query(
      `
        SELECT Id, Contact__c, JDS_Labs_Start_Timestamp__c, JDS_Labs_Completed_Timestamp__c, Labs_Application__c
        FROM JDS_Track_Enrollment__c
        WHERE JDS_Labs_Start_Timestamp__c != NULL
        AND JDS_Labs_Completed_Timestamp__c = NULL
        LIMIT 10000
      `, {},
      (err, result) => {
        if (err) {
          void Promise.reject(err);
        } else {
          return result;
        }
      }
    );
    console.log(sfResult);
    const learners = (sfResult.records as ISalesforceLearner[]).map((record) => ({
      id: record.Id
      // TODO
    }));
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
