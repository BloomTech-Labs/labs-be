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
  tpmInterest1: number;
  tpmInterest2: number;
  tpmInterest3: number;
  tpmInterest4: number;
  uxInterest1: number;
  uxInterest2: number;
  frontendInterest1: number;
  frontendInterest2: number;
  backendInterest1: number;
  backendInterest2: number;
  dataEngInterest1: number;
  dataEngInterest2: number;
  dataEngInterest3: number;
  mlEngInterest1: number;
  mlEngInterest2: number;
  mlEngInterest3: number;
  mlOpsInterest1: number;
  mlOpsInterest2: number;
  mlOpsInterest3: number;
}

export interface ILearnerLabsApplication extends ILearnerSurvey {
  lambdaId: string;
  canvasUserId?: number;
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
  tpmInterest1: number;
  tpmInterest2: number;
  tpmInterest3: number;
  tpmInterest4: number;
  uxInterest1: number;
  uxInterest2: number;
  frontendInterest1: number;
  frontendInterest2: number;
  backendInterest1: number;
  backendInterest2: number;
  dataEngInterest1: number;
  dataEngInterest2: number;
  dataEngInterest3: number;
  mlEngInterest1: number;
  mlEngInterest2: number;
  mlEngInterest3: number;
  mlOpsInterest1: number;
  mlOpsInterest2: number;
  mlOpsInterest3: number;
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
