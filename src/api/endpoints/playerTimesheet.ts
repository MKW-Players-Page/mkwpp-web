import { CategoryEnum, Score, apiFetch, LapModeEnum } from "..";
import { formatDate } from "../../utils/Formatters";
import { buildQueryParamString } from "../../utils/SearchParams";

export type Time = Omit<Score, "player">;

export class Timesheet {
  times: Array<Time>;
  af: number;
  totalTime: number;
  tally: number;
  arr: number;
  prwr: number;

  constructor(
    times: Array<Time>,
    af: number,
    totalTime: number,
    tally: number,
    arr: number,
    prwr: number,
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
      `/custom/scores/timesheet/${playerId}${buildQueryParamString({ cat: category, lap: lapMode === LapModeEnum.Overall ? undefined : lapMode, reg: regionId, dat: date ? formatDate(date) : undefined })}`,
    );
  }
}

export class MatchupData {
  playerData: Array<Timesheet>;
  wins: Array<number>;
  diffFirst: Array<Array<number>>;
  diffNext: Array<Array<number>>;
  diffAfFirst: Array<number>;
  diffAfNext: Array<number>;
  diffTotalTimeFirst: Array<number>;
  diffTotalTimeNext: Array<number>;
  diffTallyFirst: Array<number>;
  diffTallyNext: Array<number>;
  diffArrFirst: Array<number>;
  diffArrNext: Array<number>;
  diffPrwrFirst: Array<number>;
  diffPrwrNext: Array<number>;
  diffWinsFirst: Array<number>;
  diffWinsNext: Array<number>;
  rgbDiff: Array<Array<number>>;
  rgbDiffAf: Array<number>;
  rgbDiffTotalTime: Array<number>;
  rgbDiffTally: Array<number>;
  rgbDiffArr: Array<number>;
  rgbDiffPrwr: Array<number>;
  rgbDiffWins: Array<number>;

  constructor(
    playerData: Array<Timesheet>,
    wins: Array<number>,
    diffFirst: Array<Array<number>>,
    diffNext: Array<Array<number>>,
    diffAfFirst: Array<number>,
    diffAfNext: Array<number>,
    diffTotalTimeFirst: Array<number>,
    diffTotalTimeNext: Array<number>,
    diffTallyFirst: Array<number>,
    diffTallyNext: Array<number>,
    diffArrFirst: Array<number>,
    diffArrNext: Array<number>,
    diffPrwrFirst: Array<number>,
    diffPrwrNext: Array<number>,
    diffWinsFirst: Array<number>,
    diffWinsNext: Array<number>,
    rgbDiff: Array<Array<number>>,
    rgbDiffAf: Array<number>,
    rgbDiffTotalTime: Array<number>,
    rgbDiffTally: Array<number>,
    rgbDiffArr: Array<number>,
    rgbDiffPrwr: Array<number>,
    rgbDiffWins: Array<number>,
  ) {
    this.playerData = playerData;
    this.wins = wins;
    this.diffFirst = diffFirst;
    this.diffNext = diffNext;
    this.diffAfFirst = diffAfFirst;
    this.diffAfNext = diffAfNext;
    this.diffTotalTimeFirst = diffTotalTimeFirst;
    this.diffTotalTimeNext = diffTotalTimeNext;
    this.diffTallyFirst = diffTallyFirst;
    this.diffTallyNext = diffTallyNext;
    this.diffArrFirst = diffArrFirst;
    this.diffArrNext = diffArrNext;
    this.diffPrwrFirst = diffPrwrFirst;
    this.diffPrwrNext = diffPrwrNext;
    this.diffWinsFirst = diffWinsFirst;
    this.diffWinsNext = diffWinsNext;
    this.rgbDiff = rgbDiff;
    this.rgbDiffAf = rgbDiffAf;
    this.rgbDiffTotalTime = rgbDiffTotalTime;
    this.rgbDiffTally = rgbDiffTally;
    this.rgbDiffArr = rgbDiffArr;
    this.rgbDiffPrwr = rgbDiffPrwr;
    this.rgbDiffWins = rgbDiffWins;
  }

  public static async get(
    playerIds: Array<number>,
    category: CategoryEnum = CategoryEnum.NonShortcut,
    lapMode: LapModeEnum = LapModeEnum.Overall,
    regionId: number = 1,
    date?: Date,
  ): Promise<MatchupData> {
    return apiFetch(
      `/custom/scores/matchup${buildQueryParamString({ cat: category, lap: lapMode === LapModeEnum.Overall ? undefined : lapMode, reg: regionId, dat: date ? formatDate(date) : undefined })}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
      playerIds,
    );
  }
}
