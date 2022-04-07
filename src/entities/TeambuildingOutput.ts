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

export interface Learner {
  lambdaId: string;
  name: string;
  track: Track;
  labsProject?: string;
}

export interface Project {
  id: string;
  product: string;
  teamCode: string;
  tracks: Track[];
  releaseManager: string;
  teamMemberSmtIds: string[];
}

export interface ITeambuildingOutput {
  learners: Learner[];
  projects: Project[];
}

export class TeambuildingOutput implements ITeambuildingOutput {
  learners: Learner[];
  projects: Project[];

  constructor(learners: Learner[], projects: Project[]) {
    this.learners = learners;
    this.projects = projects;
  }
}

export default TeambuildingOutput;
