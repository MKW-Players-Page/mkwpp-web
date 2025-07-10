import { apiFetch, PlayerBasic } from "..";
import { formatDate } from "../../utils/Formatters";
import { getToken } from "../../utils/Auth";
import { dateToSeconds } from "../../utils/DateUtils";
import { buildQueryParamString } from "../../utils/SearchParams";

export enum CategoryEnum {
  NonShortcut = 0,
  Shortcut = 1,
  Unrestricted = 2,
}

export const CategoryEnumValues: CategoryEnum[] = [
  CategoryEnum.NonShortcut,
  CategoryEnum.Shortcut,
  CategoryEnum.Unrestricted,
];

export const stringToCategoryEnum = (x: string): CategoryEnum => {
  switch (x) {
    case "1":
      return CategoryEnum.Shortcut;
    case "2":
      return CategoryEnum.Unrestricted;
    default:
      return CategoryEnum.NonShortcut;
  }
};

export enum LapModeEnum {
  Course = 0,
  Lap = 1,
  Overall = 2,
}

export const stringToLapModeEnum = (x: string, restrictedSet: boolean = true): LapModeEnum => {
  switch (x) {
    case "0":
      return LapModeEnum.Course;
    case "1":
      return LapModeEnum.Lap;
    default:
      return restrictedSet ? LapModeEnum.Course : LapModeEnum.Overall;
  }
};
export const LapModeEnumValues: LapModeEnum[] = [
  LapModeEnum.Course,
  LapModeEnum.Lap,
  LapModeEnum.Overall,
];

type ScoreByDate = Omit<
  Score,
  "stdLvlCode" | "videoLink" | "ghostLink" | "comment" | "rank" | "prwr" | "initialRank"
>;

export class Score {
  readonly id: number;
  readonly stdLvlCode: string;
  readonly value: number;
  readonly category: CategoryEnum;
  readonly isLap: boolean;
  readonly player: PlayerBasic;
  readonly trackId: number;
  readonly date: number;
  readonly rank: number;
  readonly prwr: number;
  readonly videoLink?: string;
  readonly ghostLink?: string;
  readonly comment?: string;
  readonly initialRank?: number;

  constructor(
    id: number,
    stdLvlCode: string,
    value: number,
    category: CategoryEnum,
    isLap: boolean,
    player: PlayerBasic,
    trackId: number,
    date: number,
    rank: number,
    prwr: number,
    video_link?: string,
    ghost_link?: string,
    comment?: string,
    initialRank?: number,
  ) {
    this.id = id;
    this.stdLvlCode = stdLvlCode;
    this.value = value;
    this.category = category;
    this.isLap = isLap;
    this.player = player;
    this.trackId = trackId;
    this.date = date;
    this.rank = rank;
    this.prwr = prwr;
    this.videoLink = video_link;
    this.ghostLink = ghost_link;
    this.comment = comment;
    this.initialRank = initialRank;
  }

  public static async getChart(
    trackId: number,
    category: CategoryEnum = CategoryEnum.NonShortcut,
    isLap: boolean = false,
    regionId: number = 1,
    date?: Date,
    limit?: number,
  ): Promise<Array<Score>> {
    return apiFetch(
      `/custom/scores/chart/${trackId}${buildQueryParamString({ cat: category, lap: +isLap, reg: regionId, dat: date === undefined ? undefined : formatDate(date), lim: limit })}`,
    );
  }

  public static async getRecords(
    category: CategoryEnum = CategoryEnum.NonShortcut,
    lapMode: LapModeEnum = LapModeEnum.Overall,
    regionId: number = 1,
    date?: Date,
  ): Promise<Array<Score>> {
    return apiFetch(
      `/custom/scores/records/${buildQueryParamString({ cat: category, lap: lapMode === LapModeEnum.Overall ? undefined : lapMode, reg: regionId, dat: date })}`,
    );
  }

  public static async getRecent(
    limit: number,
    recordsOnly: boolean = false,
  ): Promise<Array<ScoreByDate>> {
    return apiFetch(`/custom/scores/recent/${limit}/${recordsOnly ? "records" : "all"}`);
  }
}

export class AdminScore {
  readonly id: number;
  readonly value: number;
  readonly category: CategoryEnum;
  readonly isLap: boolean;
  readonly playerId: number;
  readonly trackId: number;
  readonly date: number;
  readonly videoLink?: string;
  readonly ghostLink?: string;
  readonly comment?: string;
  readonly adminNote?: string;
  readonly initialRank?: number;

  constructor(
    id: number,
    value: number,
    category: CategoryEnum,
    isLap: boolean,
    playerId: number,
    trackId: number,
    date: number,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
    adminNote?: string,
    initialRank?: number,
  ) {
    this.id = id;
    this.value = value;
    this.category = category;
    this.isLap = isLap;
    this.playerId = playerId;
    this.trackId = trackId;
    this.date = date;
    this.videoLink = videoLink;
    this.ghostLink = ghostLink;
    this.comment = comment;
    this.adminNote = adminNote;
    this.initialRank = initialRank;
  }

  public static async getList(trackId: number): Promise<Array<AdminScore> | null> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch(
      "/admin/scores/list",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, trackId },
    );
  }

  public static async getById(id: number): Promise<AdminScore | null> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(null));
    return apiFetch(
      "/admin/scores/id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, id },
    );
  }

  public static async insertScore(
    value: number,
    category: CategoryEnum,
    isLap: boolean,
    playerId: number,
    trackId: number,
    date: Date,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
    adminNote?: string,
    initialRank?: number,
  ): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ success: boolean }>(
      "/admin/scores/insert",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        sessionToken,
        value,
        category,
        isLap,
        playerId,
        trackId,
        date: dateToSeconds(date),
        videoLink,
        ghostLink,
        comment,
        adminNote,
        initialRank,
      },
    ).then((r) => r.success);
  }

  public static async editScore(
    id: number,
    value: number,
    category: CategoryEnum,
    isLap: boolean,
    playerId: number,
    trackId: number,
    date: Date,
    videoLink?: string,
    ghostLink?: string,
    comment?: string,
    adminNote?: string,
    initialRank?: number,
  ): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ success: boolean }>(
      "/admin/scores/edit",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        sessionToken,
        id,
        value,
        category,
        isLap,
        playerId,
        trackId,
        date: dateToSeconds(date),
        videoLink,
        ghostLink,
        comment,
        adminNote,
        initialRank,
      },
    ).then((r) => r.success);
  }

  public static async deleteScore(id: number): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ success: boolean }>(
      "/admin/scores/delete",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, id },
    ).then((r) => r.success);
  }
}
