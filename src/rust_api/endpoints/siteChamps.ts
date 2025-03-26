import { apiFetch, CategoryEnum } from "..";

export class SiteChamp {
  readonly id: number;
  readonly playerId: number;
  readonly category: CategoryEnum;
  readonly dateInstated: Date;

  constructor(id: number, playerId: number, category: CategoryEnum, dateInstated: Date | string) {
    this.id = id;
    this.playerId = playerId;
    this.category = category;
    this.dateInstated = typeof dateInstated === "string" ? new Date(dateInstated) : dateInstated;
  }

  public static async get(category?: CategoryEnum): Promise<Array<SiteChamp>> {
    return apiFetch(
      category === undefined ? "/raw/site_champs" : `/custom/site_champs/category/${category}`,
    )
      .then((r) => r.json())
      .then((r) => r.map((r: any) => new SiteChamp(r.id, r.playerId, r.category, r.dateInstated)));
  }
}
