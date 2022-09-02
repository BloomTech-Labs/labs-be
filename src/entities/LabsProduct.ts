import LabsProject from "@entities/LabsProject";
import LabsTimeSlot from "./LabsTimeSlot";

export interface ILabsProduct {
  id?: string;
  active?: boolean;
  createdById?: string;
  createdDate?: Date;
  gitHubTeam?: string;
  isDeleted?: boolean;
  projects?: LabsProject[];
  lastActivityDate?: Date;
  lastModifiedById?: string;
  lastModifiedDate?: Date;
  lastReferencedDate?: Date;
  lastViewedDate?: Date;
  name?: string;
  ownerId?: string;
  releaseManager?: string;
  slackProductChannel?: string;
  slackStakeholderChannel?: string;
  systemModstamp?: Date;
  timeSlot?: LabsTimeSlot;
  tracks?: string[];
}

export class LabsProduct implements ILabsProduct {
  public id?: string;
  public active?: boolean;
  public createdById?: string;
  public createdDate?: Date;
  public gitHubTeam?: string;
  public isDeleted?: boolean;
  public projects?: LabsProject[];
  public lastActivityDate?: Date;
  public lastModifiedById?: string;
  public lastModifiedDate?: Date;
  public lastReferencedDate?: Date;
  public lastViewedDate?: Date;
  public name?: string;
  public ownerId?: string;
  public releaseManager?: string;
  public slackProductChannel?: string;
  public slackStakeholderChannel?: string;
  public systemModstamp?: Date;
  public timeSlot?: LabsTimeSlot;
  public tracks?: string[];

  constructor(
    id?: string,
    active?: boolean,
    createdById?: string,
    createdDate?: Date,
    gitHubTeam?: string,
    isDeleted?: boolean,
    projects?: LabsProject[],
    lastActivityDate?: Date,
    lastModifiedById?: string,
    lastModifiedDate?: Date,
    lastReferencedDate?: Date,
    lastViewedDate?: Date,
    name?: string,
    ownerId?: string,
    releaseManager?: string,
    slackProductChannel?: string,
    slackStakeholderChannel?: string,
    systemModstamp?: Date,
    timeSlot?: LabsTimeSlot,
    tracks?: string[]
  ) {
    this.id = id;
    this.active = active;
    this.createdById = createdById;
    this.createdDate = createdDate;
    this.gitHubTeam = gitHubTeam;
    this.isDeleted = isDeleted;
    this.projects = projects;
    this.lastActivityDate = lastActivityDate;
    this.lastModifiedById = lastModifiedById;
    this.lastModifiedDate = lastModifiedDate;
    this.lastReferencedDate = lastReferencedDate;
    this.lastViewedDate = lastViewedDate;
    this.name = name;
    this.ownerId = ownerId;
    this.releaseManager = releaseManager;
    this.slackProductChannel = slackProductChannel;
    this.slackStakeholderChannel = slackStakeholderChannel;
    this.systemModstamp = systemModstamp;
    this.timeSlot = timeSlot;
    this.tracks = tracks;
  }
}

export default LabsProduct;
