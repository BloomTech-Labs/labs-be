import TeambuildingOutput, {
  ITeambuildingOutput,
} from "@entities/TeambuildingOutput";
import SortingHatClient from "@daos/SortingHat/client";
import TeambuildingPayload from "@entities/TeambuildingPayload";

export type TeambuildingOutputResponse = Promise<TeambuildingOutput | null>;

export interface ISortingHatDao {
  postBuildTeams: (
    request: TeambuildingPayload,
    cohort: string
  ) => TeambuildingOutputResponse;
}

class SortingHatDao implements ISortingHatDao {
  private client: SortingHatClient<ITeambuildingOutput>;

  constructor() {
    this.client = new SortingHatClient<ITeambuildingOutput>();
  }

  /**
   * @param payload
   * @param cohort
   */
  public async postBuildTeams(
    payload: TeambuildingPayload,
    cohort: string
  ): TeambuildingOutputResponse {
    const path = `build/teams/?cohort_name=${cohort}`;
    const body = payload;
    return (await this.client.post(
      path,
      body
    )) as unknown as TeambuildingOutput;
  }
}

export default SortingHatDao;
