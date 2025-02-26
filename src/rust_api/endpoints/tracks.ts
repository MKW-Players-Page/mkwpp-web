import { apiFetch } from "..";
import { CategoryEnum } from "../../api";
import { getCategoryFromNumber } from "../../utils/EnumUtils";

interface JsonTrack {
  readonly id: number;
  readonly cupId: number;
  readonly abbr: string;
  readonly categories: Array<number>;
}

export class Track {
  readonly id: number;
  readonly cupId: number;
  readonly abbr: string;
  readonly categories: Array<CategoryEnum>;

  constructor(id: number, cupId: number, abbr: string, categories: Array<CategoryEnum>) {
    this.id = id;
    this.cupId = cupId;
    this.abbr = abbr;
    this.categories = categories;
  }

  public static async get(): Promise<Array<Track>> {
    return apiFetch("/raw/tracks")
      .then((r) => r.json())
      .then((r) =>
        r.map(
          (z: JsonTrack) =>
            new Track(
              z.id,
              z.cupId,
              z.abbr,
              z.categories.map((r) => getCategoryFromNumber(r)),
            ),
        ),
      );
  }
}
