import { createContext } from "react";

import api, { Region, StandardLevel, Standard } from "../api";
import { useApi } from "../hooks";
import { Cup, Track } from "../rust_api";
import { WorldRegion } from "./Defaults";

/** Metadata fetched from the API. Data may be missing if `isLoading` is true. */
export interface Metadata {
  isLoading: boolean;
  regions: Region[];
  standardLevels?: StandardLevel[];
  cups?: Cup[];
  tracks?: Track[];
}

/** Calls the various API endpoints to load app metadata, such as tracks and regions.
 *
 * @returns A stateful object containing the fetched metadata if the loading flag is cleared.
 */
export const useMetadata = (): Metadata => {
  const regions = useApi(() => api.timetrialsRegionsList(), [], "regions");
  const standards = useApi(() => api.timetrialsStandardlevelsList(), [], "standardLevels");
  const cups = useApi(() => Cup.get(), [], "cups");
  const tracks = useApi(() => Track.get(), [], "tracks");

  return {
    isLoading: regions.isLoading || standards.isLoading || cups.isLoading || tracks.isLoading,
    regions: regions.data ?? [WorldRegion],
    standardLevels: standards.data,
    cups: cups.data,
    tracks: tracks.data,
  };
};

/** Context providing metadata to the app's components. */
export const MetadataContext = createContext<Metadata>({ isLoading: true, regions: [WorldRegion] });

// Helper functions

/**
 * @param metadata The Metadata object returned from `useContext(MetadataContext)`
 * @param regionId The id of the region to find
 * @returns The region object, or `undefined` if no region with the given id exists.
 */
export const getRegionById = (metadata: Metadata, regionId: number) => {
  if (!metadata.regions) {
    return undefined;
  }

  return metadata.regions.find((region: Region) => region.id === regionId);
};

export const getFirstRankedParent = (metadata: Metadata, region: Region): Region | undefined => {
  if (!region.parent) return undefined;
  let parent = getRegionById(metadata, region.parent);

  while (parent !== undefined && parent.id > 0) {
    if (parent.isRanked) return parent;
    parent = getRegionById(metadata, parent?.parent ?? 0);
  }

  return undefined;
};

/** The standard level of the standard with the given id.
 *
 * @param metadata The Metadata object returned from `useContext(MetadataContext)`
 * @param standardId The id of the standard
 * @returns A StandardLevel object, or `undefined` if no standard with the given id exists.
 */
export const getStandardLevel = (metadata: Metadata, standard: Standard | number) => {
  if (!metadata.standardLevels) {
    return undefined;
  }
  if (typeof standard === "number") return metadata.standardLevels.find((s) => s.id === standard);
  return metadata.standardLevels.find((s) => s.id === standard.level);
};

/**
 * @param tracks The Metadata field `metadata.tracks`
 * @param trackId The id of the track
 * @returns A Track object, or `undefined` if no track with the given id exists.
 */
export const getTrackById = (tracks: Track[] | undefined, trackId: number) => {
  if (!tracks) {
    return undefined;
  }

  return tracks?.find((track) => track.id === trackId);
};
