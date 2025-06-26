import { apiFetch } from "..";

export class StandardLevel {
  readonly id: number;
  readonly code: string;
  readonly value: number;
  readonly isLegacy: boolean;

  constructor(id: number, code: string, value: number, isLegacy: boolean) {
    this.id = id;
    this.code = code;
    this.value = value;
    this.isLegacy = isLegacy;
  }

  public static async get(): Promise<Array<StandardLevel>> {
    return apiFetch("/raw/standard_levels");
  }
}
