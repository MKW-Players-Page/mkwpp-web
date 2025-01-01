import { createContext } from "react";

import api, { Region, Track, TrackCup, StandardLevel } from "../api";
import { useApi } from "../hooks";
import { WorldRegion } from "./Defaults";

/** Metadata fetched from the API. Data may be missing if `isLoading` is true. */
export interface Metadata {
  isLoading: boolean;
  regions: Region[];
  standards?: StandardLevel[];
  cups?: TrackCup[];
  tracks?: Track[];
}

/** Calls the various API endpoints to load app metadata, such as tracks and regions.
 *
 * @returns A stateful object containing the fetched metadata if the loading flag is cleared.
 */
export const useMetadata = (): Metadata => {
  const regions = useApi(() => api.timetrialsRegionsList(), [], "regions");
  const standards = useApi(() => api.timetrialsStandardsList(), [], "standards");
  const cups = useApi(() => api.timetrialsCupsList(), [], "cups");
  const tracks = useApi(() => api.timetrialsTracksList(), [], "tracks");

  return {
    isLoading: regions.isLoading || standards.isLoading || cups.isLoading || tracks.isLoading,
    regions: regions.data ?? [WorldRegion],
    standards: standards.data,
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

/** The standard level of the standard with the given id.
 *
 * @param metadata The Metadata object returned from `useContext(MetadataContext)`
 * @param standardId The id of the standard
 * @returns A StandardLevel object, or `undefined` if no standard with the given id exists.
 */
export const getStandardLevel = (metadata: Metadata, standardId: number) => {
  if (!metadata.standards) {
    return undefined;
  }

  // This is obviously inefficient but this doesn't appear to cause any measurable slow downs...
  for (const level of metadata.standards) {
    const standard = level.standards.find((s) => s.id === standardId);
    if (standard) {
      return level;
    }
  }

  return undefined;
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
