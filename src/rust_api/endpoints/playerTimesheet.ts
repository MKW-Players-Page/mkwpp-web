import { CategoryEnum, Score, apiFetch, LapModeEnum } from "..";
import { buildQueryParamString } from "../../utils/SearchParams";

type Time = Omit<Score, "player">;

export class Timesheet {
  times: Array<Time>;
  af?: number;
  totalTime?: number;
  tally?: number;
  arr?: number;
  prwr?: number;

  constructor(
    times: Array<Time>,
    af?: number,
    totalTime?: number,
    tally?: number,
    arr?: number,
    prwr?: number,
  ) {
    this.times = times;
    this.af = af;
    this.totalTime = totalTime;
    this.tally = tally;
    this.arr = arr;
    this.prwr = prwr;
  }

  public static async get(
    playerId: number,
    category: CategoryEnum = CategoryEnum.NonShortcut,
    lapMode: LapModeEnum = LapModeEnum.Overall,
    regionId: number = 1,
    date?: Date,
  ): Promise<Timesheet> {
    return apiFetch(
      `/custom/scores/timesheet/${playerId}${buildQueryParamString({ cat: category, lap: lapMode === LapModeEnum.Overall ? undefined : lapMode, reg: regionId, dat: date })}`,
    ).then((r) => r.json());
  }
}
