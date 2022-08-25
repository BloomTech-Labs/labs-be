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
  labsTimeSlot: [string];
  gitHubHandle?: string;
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

export interface ITeambuildingPayload {
  learners: ILabsApplication[];
  projects: ITeamBuildingProject[];
}

export class TeambuildingPayload implements ITeambuildingPayload {
  learners: ILabsApplication[];
  projects: ITeamBuildingProject[];

  constructor(learners: ILabsApplication[], projects: ITeamBuildingProject[]) {
    this.learners = learners;
    this.projects = projects;
  }
}

export default TeambuildingPayload;
