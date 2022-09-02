import { Track } from "./TeambuildingOutput";

export interface ITeamBuildingProject {
  id: string;
  product: string;
  teamCode: string;
  tracks: (Track | string | null)[];
  releaseManager?: string;
  teamMemberOktaIds: string[];
}

export interface ILabsApplication {
  labsTimeSlot?: [string];
  gitHubHandle?: string;
  gitExpertise?: number;
  dockerExpertise?: number;
  playByEar?: number;
  detailOriented?: number;
  speakUpInDiscussions?: number;
  soloOrSocial?: string;
  meaningOrValue?: string;
  feelsRightOrMakesSense?: string;
  favoriteOrCollect?: string;
  tpmSkill1?: string;
  tpmSkill2?: string;
  tpmSkill3?: string;
  tpmInterest1?: number;
  tpmInterest2?: number;
  tpmInterest3?: number;
  tpmInterest4?: number;
  uxInterest1?: number;
  uxInterest2?: number;
  frontendInterest1?: number;
  frontendInterest2?: number;
  backendInterest1?: number;
  backendInterest2?: number;
  dataEngInterest1?: number;
  dataEngInterest2?: number;
  dataEngInterest3?: number;
  mlEngInterest1?: number;
  mlEngInterest2?: number;
  mlEngInterest3?: number;
  mlOpsInterest1?: number;
  mlOpsInterest2?: number;
  mlOpsInterest3?: number;
}

export interface ILabsApplicationSubmission {
  oktaId: string;
  email?: string;
  slackId?: string;
  labsApplication: ILabsApplication;
}

export interface ISalesforceLabsApplication {
  Labs_Time_Slot__c?: string;
  Your_Github_handle__c?: string;
  Git_Expertise__c?: number;
  Docker_expertise__c?: number;
  Play_By_Ear__c?: number;
  Detail_Oriented__c?: number;
  Speak_Up_In_Discussions__c?: number;
  What_activities_do_you_prefer__c?: string;
  What_do_you_prefer_to_seek_in_your_work__c?: string;
  feelsRightOrMakesSense__c?: string;
  Choices_are_easier_when__c?: string;
  In_general_which_method_do_you_prefer__c?: string;
  Technical_project_manager_should__c?: string;
  When_their_team_is_facing_a_blocker__c?: string;
  Interested_in_becoming_a_people_manager__c?: number;
  I_enjoy_running_meetings__c?: number;
  I_enjoy_managing_the_flow_of_information__c?: number;
  How_do_you_approach_the_situation__c?: string;
  JDS_Track_Enrollment__c?: string;
}

export interface ISalesforceLearner {
  Id: string;
  Contact__c: string;
  JDS_Labs_Start_Timestamp__c: string;
  JDS_Labs_Completed_Timestamp__c: string;
  Labs_Application__c: ILabsApplication;
}

export interface ITeamBuildingLearner {
  oktaId: string,
  name: string,
  track: Track,
  storyPoints: number,
  labsProject: string,
  labsTimeSlot: string[],
  gitHubHandle: string,
  gitExpertise: number,
  dockerExpertise: number,
  playByEar: number,
  detailOriented: number,
  speakUpInDiscussions: number,
  soloOrSocial: string,
  meaningOrValue: string,
  feelsRightOrMakesSense: string,
  favoriteOrCollect: string,
  tpmSkill1: string,
  tpmSkill2: string,
  tpmSkill3: string,
  tpmInterest1: number,
  tpmInterest2: number,
  tpmInterest3: number,
  tpmInterest4: number
}

export interface ITeambuildingPayload {
  learners: ITeambuildingLearner[];
  projects: ITeamBuildingProject[];
}

export class TeambuildingPayload implements ITeambuildingPayload {
  learners: ITeambuildingLearner[];
  projects: ITeamBuildingProject[];

  constructor(learners: ITeambuildingLearner[], projects: ITeamBuildingProject[]) {
    this.learners = learners;
    this.projects = projects;
  }
}

export default TeambuildingPayload;
