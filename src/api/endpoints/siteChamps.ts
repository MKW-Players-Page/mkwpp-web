import { apiFetch, CategoryEnum } from "..";

export class SiteChamp {
  readonly id: number;
  readonly playerId: number;
  readonly category: CategoryEnum;
  readonly dateInstated: number;

  constructor(id: number, playerId: number, category: CategoryEnum, dateInstated: number) {
    this.id = id;
    this.playerId = playerId;
    this.category = category;
    this.dateInstated = dateInstated;
  }

  public static async get(category?: CategoryEnum): Promise<Array<SiteChamp>> {
    return apiFetch<Array<unknown>>(
      category === undefined ? "/raw/site_champs" : `/custom/site_champs/category/${category}`,
    ).then((r) => r.map((r: any) => new SiteChamp(r.id, r.playerId, r.category, r.dateInstated)));
  }
}
