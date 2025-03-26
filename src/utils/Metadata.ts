import { createContext } from "react";
import { useApi } from "../hooks";
import { Cup, Track, Region, StandardLevel, Standard, Player, PlayerBasic } from "../rust_api";
import { typeguardPlayer } from "../rust_api/endpoints/players";

/** Metadata fetched from the API. Data may be missing if `isLoading` is true. */
export class Metadata {
  public isLoading: boolean = true;
  public regions: Region[] = [Region.worldDefault()];
  public standardLevels?: StandardLevel[];
  public standards?: Standard[];
  public cups?: Cup[];
  public tracks?: Track[];
  private cached: {
    players: Record<number, PlayerBasic | Player>;
  } = { players: {} };

  constructor(
    isLoading: boolean = true,
    regions: Region[] = [Region.worldDefault()],
    standardLevels?: StandardLevel[],
    standards?: Standard[],
    cups?: Cup[],
    tracks?: Track[],
    cached: {
      players: Record<number, PlayerBasic | Player>;
    } = { players: {} },
  ) {
    this.isLoading = isLoading;
    this.regions = regions;
    this.standardLevels = standardLevels;
    this.standards = standards;
    this.cups = cups;
    this.tracks = tracks;
    this.cached = cached;
  }

  /**
   * @param players All the players to push to the cache
   */
  set cachePlayers(players: Array<Player | PlayerBasic>) {
    for (const player of players) {
      if (
        this.cached.players[player.id] !== undefined &&
        typeguardPlayer(this.cached.players[player.id]) &&
        typeguardPlayer(player)
      )
        continue;
      this.cached.players[player.id] = player;
    }
  }

  /**
   * @param id Id of the player that should be returned
   * @returns Player or PlayerBasic depending on whether the player has been cached
   */
  getCachedPlayer(id: number): Player | PlayerBasic | undefined {
    return this.cached.players[id];
  }

  /**
   * @param regionId The id of the region to find
   * @returns The region object, or `undefined` if no region with the given id exists.
   */
  getRegionById(regionId: number) {
    if (!this.regions) {
      return undefined;
    }

    return this.regions.find((region: Region) => region.id === regionId);
  }

  /**
   * @param region Region for which it should find the ranked ancestor
   * @returns The first ancestor region with `isRanked` = true, or undefined.
   */
  getFirstRankedParent(region: Region): Region | undefined {
    if (!region.parentId) return undefined;
    let parent = this.getRegionById(region.parentId);

    while (parent !== undefined && parent.id > 0) {
      if (parent.isRanked) return parent;
      parent = this.getRegionById(parent?.parentId ?? 0);
    }

    return undefined;
  }

  /** The standard level of the standard with the given id.
   *
   * @param standardId The id of the standard
   * @returns A StandardLevel object, or `undefined` if no standard with the given id exists.
   */
  getStandardLevel(standard: Standard | number): StandardLevel | undefined {
    if (!this.standardLevels) {
      return undefined;
    }

    const standardLevelId = typeof standard === "number" ? standard : standard.standardLevelId;
    return this.standardLevels.find((s) => s.id === standardLevelId);
  }

  /**
   * @param trackId The id of the track
   * @returns A Track object, or `undefined` if no track with the given id exists.
   */
  getTrackById(trackId: number): Track | undefined {
    if (!this.tracks) {
      return undefined;
    }

    return this.tracks?.find((track) => track.id === trackId);
  }
}

/** Calls the various API endpoints to load app metadata, such as tracks and regions.
 *
 * @returns A stateful object containing the fetched metadata if the loading flag is cleared.
 */
export const useMetadata = (): Metadata => {
  const regions = useApi(() => Region.get(), [], "regions");
  const standardLevels = useApi(() => StandardLevel.get(), [], "standardLevels");
  const standards = useApi(() => Standard.get(), [], "standards");
  const cups = useApi(() => Cup.get(), [], "cups");
  const tracks = useApi(() => Track.get(), [], "tracks");

  const metadata = new Metadata(
    regions.isLoading ||
      standardLevels.isLoading ||
      cups.isLoading ||
      tracks.isLoading ||
      standards.isLoading,
    regions.data ?? undefined,
    standardLevels.data,
    standards.data,
    cups.data,
    tracks.data,
  );

  return metadata;
};

/** Context providing metadata to the app's components. */
export const MetadataContext = createContext<Metadata>(new Metadata());
