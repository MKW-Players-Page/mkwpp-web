import { apiFetch } from "..";
import { buildQueryParamString } from "../../utils/SearchParams";
import { PlayerBasic } from "./players";
import { CategoryEnum, LapModeEnum } from "./scores";

export enum MetricEnum {
  AverageFinish = "af",
  AverageRankRating = "arr",
  TallyPoints = "tally",
  PersonalRecordToWorldRecord = "prwr",
  TotalTime = "totaltime",
}

export class Ranking {
  readonly rank: number;
  readonly value: number;
  readonly player: PlayerBasic;

  constructor(rank: number, value: number, player: PlayerBasic) {
    this.value = value;
    this.player = player;
    this.rank = rank;
  }

  public static async getChart(
    type: MetricEnum,
    category: CategoryEnum = CategoryEnum.NonShortcut,
    lapMode: LapModeEnum = LapModeEnum.Overall,
    regionId: number = 1,
    date?: Date,
  ): Promise<Array<Ranking>> {
    return apiFetch(
      `/custom/rankings/${type}${buildQueryParamString({ cat: category, lap: lapMode === LapModeEnum.Overall ? undefined : lapMode, reg: regionId, dat: date })}`,
    );
  }
}
