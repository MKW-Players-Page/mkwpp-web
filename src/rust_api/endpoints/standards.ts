import { apiFetch, CategoryEnum } from "..";

export class Standard {
  readonly id: number;
  readonly standardLevelId: number;
  readonly trackId: number;
  readonly category: CategoryEnum;
  readonly value: number;
  readonly isLap: boolean;

  constructor(
    id: number,
    standardLevelId: number,
    trackId: number,
    category: CategoryEnum,
    value: number,
    isLap: boolean,
  ) {
    this.id = id;
    this.standardLevelId = standardLevelId;
    this.trackId = trackId;
    this.category = category;
    this.value = value;
    this.isLap = isLap;
  }

  public static async get(): Promise<Array<Standard>> {
    return apiFetch("/raw/standards").then((r) => r.json());
  }
}
