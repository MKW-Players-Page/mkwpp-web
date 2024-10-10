import { createContext } from "react";

import api, { Region, Track, TrackCup, RegionTypeEnum, StandardLevel } from "../api";
import { useApi } from "../hooks";

/** Metadata fetched from the API. Data may be missing if `isLoading` is true. */
export interface Metadata {
  isLoading: boolean;
  regions?: Region[];
  standards?: StandardLevel[];
  cups?: TrackCup[];
  tracks?: Track[];
}

/** Calls the various API endpoints to load app metadata, such as tracks and regions.
 *
 * @returns A stateful object containing the fetched metadata if the loading flag is cleared.
 */
export const useMetadata = (): Metadata => {
  const regions = useApi(() => api.timetrialsRegionsList());
  const standards = useApi(() => api.timetrialsStandardsList());
  const cups = useApi(() => api.timetrialsCupsList());
  const tracks = useApi(() => api.timetrialsTracksList());

  return {
    isLoading: regions.isLoading || standards.isLoading || cups.isLoading || tracks.isLoading,
    regions: regions.data,
    standards: standards.data,
    cups: cups.data,
    tracks: tracks.data,
  };
};

/** Context providing metadata to the app's components. */
export const MetadataContext = createContext<Metadata>({ isLoading: true });

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

/** The full name of a region is constructed as follows:
 *
 * 1. If the region type is `Subnational`, return the name of the region followed by the name of
 *    its parent separated by a comma.
 * 2. Otherwise, simply return the region name.
 *
 * @param metadata The Metadata object returned from `useContext(MetadataContext)`
 * @param regionId The id of the region
 * @returns The full name of the region, or `undefined` if no region with the given id exists.
 */
export const getRegionNameFull = (metadata: Metadata, regionId: number) => {
  const region = getRegionById(metadata, regionId);
  if (!region) {
    return undefined;
  }

  if (region.parent && region.type === RegionTypeEnum.Subnational) {
    const parent = getRegionById(metadata, region.parent);
    if (parent) {
      return `${region.name}, ${parent.name}`;
    }
  }

  return region.name;
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
