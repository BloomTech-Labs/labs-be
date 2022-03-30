import { Track } from "./TeambuildingOutput";

export interface ITeamBuildingProject {
  id: string;
  product: string;
  teamCode: string;
  tracks: (Track | null)[];
  releaseManager: string;
  teamMemberSmtIds: string[];
}

export interface ILearnerSurvey {
  name: string;
  lambdaId: string;
  smtId: string;
  track: Track;
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
  tpmInterest1: boolean;
  tpmInterest2: boolean;
  tpmInterest3: boolean;
  tpmInterest4: boolean;
  uxInterest1: boolean;
  uxInterest2: boolean;
  frontendInterest1: boolean;
  frontendInterest2: boolean;
  backendInterest1: boolean;
  backendInterest2: boolean;
  dataEngInterest1: boolean;
  dataEngInterest2: boolean;
  dataEngInterest3: boolean;
  mlEngInterest1: boolean;
  mlEngInterest2: boolean;
  mlEngInterest3: boolean;
  mlOpsInterest1: boolean;
  mlOpsInterest2: boolean;
  mlOpsInterest3: boolean;
}

export interface ILearnerLabsApplication extends ILearnerSurvey {
  lambdaId: string;
  canvasUserId: number;
  name: string;
  track: Track;
  labsRole: string | null;
  labsProject: string | null;
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
  tpmInterest1: boolean;
  tpmInterest2: boolean;
  tpmInterest3: boolean;
  tpmInterest4: boolean;
  uxInterest1: boolean;
  uxInterest2: boolean;
  frontendInterest1: boolean;
  frontendInterest2: boolean;
  backendInterest1: boolean;
  backendInterest2: boolean;
  dataEngInterest1: boolean;
  dataEngInterest2: boolean;
  dataEngInterest3: boolean;
  mlEngInterest1: boolean;
  mlEngInterest2: boolean;
  mlEngInterest3: boolean;
  mlOpsInterest1: boolean;
  mlOpsInterest2: boolean;
  mlOpsInterest3: boolean;
}

export interface ITeambuildingPayload {
  learners: ILearnerLabsApplication[];
  projects: ITeamBuildingProject[];
}

export class TeambuildingPayload implements ITeambuildingPayload {
  learners: ILearnerLabsApplication[];
  projects: ITeamBuildingProject[];

  constructor(
    learners: ILearnerLabsApplication[],
    projects: ITeamBuildingProject[]
  ) {
    this.learners = learners;
    this.projects = projects;
  }
}

export default TeambuildingPayload;
