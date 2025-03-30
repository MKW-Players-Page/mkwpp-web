import { apiFetch } from "..";
import { Metadata } from "../../utils/Metadata";

export enum RegionType {
  World = 0,
  Continent = 1,
  CountryGroup = 2,
  Country = 3,
  SubnationalGroup = 4,
  Subnational = 5,
}

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
    let region = metadata.getRegionById(id);
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

export const worldDefault = new Region(1, "WORLD", RegionType.World, true);
