import { RoleQuizScores, RoleRankings, Track } from "./TeambuildingOutput";

export interface IProject {
  id: string,
  product: string,
  teamCode: string,
  tracks: (Track | null)[],
  releaseManager: string,
  teamMemberSmtIds: string[],
}

export interface ILearnerSurvey {
  name: string,
  lambdaId: string,
  smtId: string,
  track: Track,
  gitExpertise: number,
  dockerExpertise: number,
  playByEar: number,
  detailOriented: number,
  speakUpInDiscussions: number,
  diversityConsent?: boolean,
  genderIdentity?: string,
  ethnicities?: string[],
  dontWorkWith?: string[],
}

export interface ILearnerRoleQuizScores {
  name?: string,
  lambdaId?: string,
  canvasUserId: number,
  roleQuizScores: RoleQuizScores
}

export interface ILearnerRoleRankings {
  name?: string,
  lambdaId?: string,
  canvasUserId: number,
  roleRankings: RoleRankings
}

export interface ILearnerLabsApplication extends ILearnerSurvey {
  lambdaId: string,
  canvasUserId: number,
  name: string,
  track: Track,
  labsRole: string | null,
  labsProject: string | null,
  roleQuizScores: RoleQuizScores,
  roleRankings: RoleRankings,
  gitExpertise: number,
  dockerExpertise: number,
  playByEar: number,
  detailOriented: number,
  speakUpInDiscussions: number,
  diversityConsent: boolean,
  genderIdentity: string,
  ethnicities: string[],
  dontWorkWith: string[],
}

export interface ITeambuildingPayload {
  learners: ILearnerLabsApplication[],
  projects: IProject[],
}

export class TeambuildingPayload implements ITeambuildingPayload {
  learners: ILearnerLabsApplication[];
  projects: IProject[];

  constructor(
    learners: ILearnerLabsApplication[],
    projects: IProject[]
  ) {
    this.learners = learners;
    this.projects = projects;
  }
}

export default TeambuildingPayload;
