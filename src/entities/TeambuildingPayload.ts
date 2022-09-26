import { Track } from "./TeambuildingOutput";

export interface ITeamBuildingProject {
  id: string;
  product: string;
  teamCode: string;
  tracks: (Track | string | null)[];
  releaseManager?: string;
  teamMemberSmtIds: string[];
}

export interface ILabsApplication {
  labsTimeSlot?: [string];
  timeSlotChoice1?: string;
  timeSlotChoice2?: string;
  timeSlotChoice3?: string;
  timeSlotChoice4?: string;
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
  timeSlotChoiceMorning: string;
  timeSlotChoiceAfternoon: string;
  timeSlotChoiceEvening: string;
  timeSlotChoiceNight: string;
  gitHubHandle?: string;
  gitExpertise?: number;
  dockerExpertise?: number;
  playByEar?: number;
  detailOriented?: number;
  speakUpInDiscussions?: number;
  soloOrSocial?: "A. Solo" | "B. Social";
  meaningOrValue?: "A. Deeper meaning" | "B. Higher value";
  feelsRightOrMakesSense?: "A. It feels right" | "B. It makes sense";
  favoriteOrCollect?: "A. Find your favorite" | "B. Collect them all";
  tpmSkill1?:
    | "A. tell their team what to do"
    | "B. coordinate their team's workflow"
    | "C. manage their team members instead of writing any code"
    | "D. make sure each function within the team doesn’t interact with the others";
  tpmSkill2?: "A. True" | "B. False";
  tpmSkill3?:
    | "A. Give them space—people need breathing room, not to be put under pressure."
    | "B. Address it during the next team standup meeting by singling them out to impart some motivation—then follow up with them afterward to make sure they understand the severity of the situation."
    | "C. Address it during the next team standup meeting while going around the room having everyone report their progress—then work with the team to figure out how to unblock them."
    | "D. Reach out to them on Slack every few days to check in.";
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
  oktaId: string;
  name: string;
  track: Track | string;
  storyPoints: number;
  labsProject: string;
  labsTimeSlot: string[];
  gitHubHandle: string;
  gitExpertise: number;
  dockerExpertise: number;
  playByEar: number;
  detailOriented: number;
  speakUpInDiscussions: number;
  soloOrSocial: string;
  meaningOrValue: string;
  feelsRightOrMakesSense: string;
  favoriteOrCollect: string;
  tpmSkill1: string;
  tpmSkill2: string;
  tpmSkill3: string;
  tpmInterest1: number;
  tpmInterest2: number;
  tpmInterest3: number;
  tpmInterest4: number;
}

export interface ITeambuildingPayload {
  learners: ITeamBuildingLearner[];
  projects: ITeamBuildingProject[];
}

export class TeambuildingPayload implements ITeambuildingPayload {
  learners: ITeamBuildingLearner[];
  projects: ITeamBuildingProject[];

  constructor(
    learners: ITeamBuildingLearner[],
    projects: ITeamBuildingProject[]
  ) {
    this.learners = learners;
    this.projects = projects;
  }
}

export default TeambuildingPayload;
