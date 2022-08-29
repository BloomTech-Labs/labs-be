import { LabsProduct } from "@entities/LabsProduct";

export interface ILabsTimeSlot {
  id?: string;
  createdById?: string;
  createdDate?: Date;
  isDeleted?: boolean;
  labsProducts?: LabsProduct[];
  lastActivityDate?: Date;
  lastModifiedById?: string;
  lastModifiedDate?: Date;
  lastReferencedDate?: Date;
  lastViewedDate?: Date;
  name?: string;
  ownerId?: string;
  systemModstamp?: Date;
  tracks?: string[];
}

export class LabsTimeSlot implements ILabsTimeSlot {
  public id?: string;
  public createdById?: string;
  public createdDate?: Date;
  public isDeleted?: boolean;
  public labsProducts?: LabsProduct[];
  public lastActivityDate?: Date;
  public lastModifiedById?: string;
  public lastModifiedDate?: Date;
  public lastReferencedDate?: Date;
  public lastViewedDate?: Date;
  public name?: string;
  public ownerId?: string;
  public systemModstamp?: Date;
  public tracks?: string[];

  constructor(
    id?: string,
    createdById?: string,
    createdDate?: Date,
    isDeleted?: boolean,
    labsProducts?: LabsProduct[],
    lastActivityDate?: Date,
    lastModifiedById?: string,
    lastModifiedDate?: Date,
    lastReferencedDate?: Date,
    lastViewedDate?: Date,
    name?: string,
    ownerId?: string,
    systemModstamp?: Date,
    tracks?: string[]
  ) {
    this.id = id;
    this.createdById = createdById;
    this.createdDate = createdDate;
    this.isDeleted = isDeleted;
    this.labsProducts = labsProducts;
    this.lastActivityDate = lastActivityDate;
    this.lastModifiedById = lastModifiedById;
    this.lastModifiedDate = lastModifiedDate;
    this.lastReferencedDate = lastReferencedDate;
    this.lastViewedDate = lastViewedDate;
    this.name = name;
    this.ownerId = ownerId;
    this.systemModstamp = systemModstamp;
    this.tracks = tracks;
  }
}

export default LabsTimeSlot;
