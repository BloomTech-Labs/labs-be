export type RoleQuizScores = Record<string, number | undefined>;
export type RoleRankings = Record<string, number>;

export enum Track {
  BD = "BD",
  DS = "DS",
  WEB = "WEB",
  IOS = "IOS",
}

/**
 * Attempt to parse a Track from a string. Airtable formats tracks as e.g.
 * "Web (Node)".
 *
 * @param surveys
 * @returns
 */
export function parseTrack(track: string): Track | null {
  switch (track) {
    case "Web (Node)":
    case "Web":
    case "WEB":
      return Track.WEB;
    case "DS":
      return Track.DS;
    case "BD":
      return Track.BD;  
    case "iOS":
    case "IOS":
      return Track.IOS;
    default:
      return null;
  }
}

export interface Recruit {
  lambdaId: string;
  name: string;
  track: Track;
  roleRankings?: RoleRankings;
}

export interface Developer {
  lambdaId: string;
  name: string;
  labsRole?: string;
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
