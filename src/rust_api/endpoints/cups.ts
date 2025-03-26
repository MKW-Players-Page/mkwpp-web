import { apiFetch } from "..";

export class Cup {
  readonly id: number;
  readonly code: string;
  readonly trackIds: Array<number>;

  constructor(id: number, code: string, trackIds: Array<number>) {
    this.id = id;
    this.code = code;
    this.trackIds = trackIds;
  }

  public static async get(): Promise<Array<Cup>> {
    return apiFetch("/raw/cups").then((r) => r.json());
  }
}
