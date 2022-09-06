import LabsProduct from "@entities/LabsProduct";

export interface ILabsProject {
  id?: string;
  active?: boolean;
  createdById?: string;
  createdDate?: Date;
  gitHubTeam?: string;
  isDeleted?: boolean;
  labsProduct?: LabsProduct;
  lastActivityDate?: Date;
  lastModifiedById?: string;
  lastModifiedDate?: Date;
  lastReferencedDate?: Date;
  lastViewedDate?: Date;
  name?: string;
  ownerId?: string;
  releaseManager?: string;
  slackTeamChannel?: string;
  systemModstamp?: Date;
  teamMembers?: string[];
  teamSize?: number;
  teamCode?: string;
  tracks?: string[];
}

export class LabsProject implements ILabsProject {
  public id?: string;
  public active?: boolean;
  public createdById?: string;
  public createdDate?: Date;
  public gitHubTeam?: string;
  public isDeleted?: boolean;
  public labsProduct?: LabsProduct;
  public lastActivityDate?: Date;
  public lastModifiedById?: string;
  public lastModifiedDate?: Date;
  public lastReferencedDate?: Date;
  public lastViewedDate?: Date;
  public name?: string;
  public ownerId?: string;
  public releaseManager?: string;
  public slackTeamChannel?: string;
  public systemModstamp?: Date;
  public teamMembers?: string[];
  public teamSize?: number;
  public teamCode?: string;
  public tracks?: string[];

  constructor(
    id?: string,
    active?: boolean,
    createdById?: string,
    createdDate?: Date,
    gitHubTeam?: string,
    isDeleted?: boolean,
    labsProduct?: LabsProduct,
    lastActivityDate?: Date,
    lastModifiedById?: string,
    lastModifiedDate?: Date,
    lastReferencedDate?: Date,
    lastViewedDate?: Date,
    name?: string,
    ownerId?: string,
    releaseManager?: string,
    slackTeamChannel?: string,
    systemModstamp?: Date,
    teamMembers?: string[],
    teamSize?: number,
    teamCode?: string,
    tracks?: string[]
  ) {
    this.id = id;
    this.active = active;
    this.createdById = createdById;
    this.createdDate = createdDate;
    this.gitHubTeam = gitHubTeam;
    this.isDeleted = isDeleted;
    this.labsProduct = labsProduct;
    this.lastActivityDate = lastActivityDate;
    this.lastModifiedById = lastModifiedById;
    this.lastModifiedDate = lastModifiedDate;
    this.lastReferencedDate = lastReferencedDate;
    this.lastViewedDate = lastViewedDate;
    this.name = name;
    this.ownerId = ownerId;
    this.releaseManager = releaseManager;
    this.slackTeamChannel = slackTeamChannel;
    this.systemModstamp = systemModstamp;
    this.teamMembers = teamMembers;
    this.teamSize = teamSize;
    this.teamCode = teamCode;
    this.tracks = tracks;
  }
}

export interface IFinalLabsProject {
  labsProduct: string;
  releaseManager: string;
  timeSlot: string;
  teamCode: string;
}

export default LabsProject;
