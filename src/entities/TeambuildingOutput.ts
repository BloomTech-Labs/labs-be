export type RoleQuizScores = Record<string, number | undefined>;
export type RoleRankings = Record<string, number>;

export enum Track {
  DS = "DS",
  WEB = "WEB",
}

export interface Recruit {
  lambdaId: string;
  name: string;
  track: Track;
  roleRankings: RoleRankings;
}

export interface Developer {
  lambdaId: string;
  name: string;
  labsRole: string;
  labsProject: string;
}

export interface ITeambuildingOutput {
  Recruits: Recruit[];
  Developers: Developer[];
}

export class TeambuildingOutput implements ITeambuildingOutput {
  Recruits: Recruit[];
  Developers: Developer[];

  constructor(Recruits: Recruit[], Developers: Developer[]) {
    this.Recruits = Recruits;
    this.Developers = Developers;
  }
}

export default TeambuildingOutput;
