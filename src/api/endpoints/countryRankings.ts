import { apiFetch, RegionType } from "..";
import { buildQueryParamString } from "../../utils/SearchParams";
import { CategoryEnum, LapModeEnum } from "./scores";

export enum CountryRankingsTopEnum {
  Records = 1,
  Top3 = 3,
  Top5 = 5,
  Top10 = 10,
  All = 0,
}

export const CountryRankingsTopEnumValues: CountryRankingsTopEnum[] = [
  CountryRankingsTopEnum.Records,
  CountryRankingsTopEnum.Top3,
  CountryRankingsTopEnum.Top5,
  CountryRankingsTopEnum.Top10,
  CountryRankingsTopEnum.All,
];

export const stringToCountryRankingsTopEnum = (x: string): CountryRankingsTopEnum => {
  switch (x) {
    case "1":
      return CountryRankingsTopEnum.Records;
    case "3":
      return CountryRankingsTopEnum.Top3;
    case "5":
      return CountryRankingsTopEnum.Top5;
    case "10":
      return CountryRankingsTopEnum.Top10;
    default:
      return CountryRankingsTopEnum.All;
  }
};

export class CountryRanking {
  readonly rank: number;
  readonly value: number;
  readonly regionId: number;

  constructor(rank: number, value: number, regionId: number) {
    this.value = value;
    this.regionId = regionId;
    this.rank = rank;
  }

  public static async getChart(
    top: CountryRankingsTopEnum,
    regionType: RegionType,
    category: CategoryEnum = CategoryEnum.NonShortcut,
    lapMode: LapModeEnum = LapModeEnum.Overall,
    date?: Date,
  ): Promise<Array<CountryRanking>> {
    return apiFetch(
      `/custom/rankings/country${buildQueryParamString({ cat: category, lap: lapMode === LapModeEnum.Overall ? undefined : lapMode, dat: date, lim: top, rty: regionType })}`,
    );
  }
}
