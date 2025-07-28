import { apiFetch } from "..";
import { getToken } from "../../utils/Auth";
import { Metadata } from "../../utils/Metadata";

export enum RegionType {
  World = 0,
  Continent = 1,
  CountryGroup = 2,
  Country = 3,
  SubnationalGroup = 4,
  Subnational = 5,
}

export const RegionTypeValues = [
  RegionType.World,
  RegionType.Continent,
  RegionType.CountryGroup,
  RegionType.Country,
  RegionType.SubnationalGroup,
  RegionType.Subnational,
];

export const stringToRegionType = (x: string): RegionType => {
  switch (x) {
    case "1":
      return RegionType.Continent;
    case "2":
      return RegionType.CountryGroup;
    case "3":
      return RegionType.Country;
    case "4":
      return RegionType.SubnationalGroup;
    case "5":
      return RegionType.Subnational;
    default:
      return RegionType.World;
  }
};

export type RegionTree = Record<number, Array<number | RegionTree>>;

export class Region {
  readonly id: number;
  readonly code: string;
  readonly parentId?: number;
  readonly regionType: RegionType;
  readonly isRanked: boolean;
  readonly playerCount?: number;

  constructor(
    id: number,
    code: string,
    regionType: RegionType,
    isRanked: boolean,
    playerCount?: number,
    parentId?: number,
  ) {
    this.id = id;
    this.code = code;
    this.regionType = regionType;
    this.parentId = parentId;
    this.isRanked = isRanked;
    this.playerCount = playerCount;
  }

  public static async get(): Promise<Array<Region>> {
    return apiFetch("/custom/regions/with_player_count");
  }

  public static async getRegionTypeHashmap(): Promise<Record<RegionType, number[]>> {
    return apiFetch("/custom/regions/type_hashmap");
  }

  public static async getRegionDescendentsTree(): Promise<RegionTree> {
    return apiFetch("/custom/regions/descendence_tree");
  }

  public static reduceRankedViaId(metadata: Metadata, acc: Region[], id: number): Region[] {
    const region = metadata.getRegionById(id);
    if (!region) return acc;
    if (!region.isRanked) return acc;
    acc.push(region);
    return acc;
  }

  public static worldDefault(): Region {
    return worldDefault;
  }

  public toUnknown(): Region | null {
    if (this.regionType === RegionType.World || this.regionType === RegionType.Continent)
      return null;
    return this;
  }
}

export class AdminRegion extends Region {
  public static async insertRegion(
    code: string,
    regionType: RegionType,
    parentId: number,
    isRanked = false,
  ): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ success: boolean }>(
      "/admin/regions/insert",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, code, regionType, parentId, isRanked },
    ).then((r) => r.success);
  }

  public static async editRegion(
    id: number,
    code: string,
    regionType: RegionType,
    parentId: number,
    isRanked: boolean = false,
  ): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ success: boolean }>(
      "/admin/regions/edit",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { sessionToken, id, code, regionType, parentId, isRanked },
    ).then((r) => r.success);
  }

  public static async deleteRegion(id: number): Promise<boolean> {
    const sessionToken = getToken();
    if (sessionToken === null) return new Promise((res) => res(false));
    return apiFetch<{ success: boolean }>(
      "/admin/regions/delete",
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

export const worldDefault = new Region(1, "WORLD", RegionType.World, true);
