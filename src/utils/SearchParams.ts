import { useContext } from "react";
import { SetURLSearchParams } from "react-router-dom";
import { CategoryEnum, Region } from "../api";
import { LapModeEnum } from "../components/widgets/LapModeSelect";
import { MetadataContext } from "./Metadata";
import { WorldRegion } from "./Defaults";
import {
  TimetrialsRegionsRankingsListTopEnum,
  TimetrialsRegionsRankingsListTypeEnum,
} from "../api/generated";

export type SearchParams = [URLSearchParams, SetURLSearchParams];

export const paramReplace = (
  prev: URLSearchParams,
  param: string,
  value: string | undefined,
  overwriteParams: string[] = [],
) => {
  return {
    ...Object.fromEntries(
      Object.entries(Object.fromEntries(prev)).filter(
        ([k, v]) => ![param, ...overwriteParams].includes(k),
      ),
    ),
    ...(value ? { [param]: value } : {}),
  };
};

export const useCategoryParam = (searchParams: SearchParams, overwriteParams: string[] = []) => {
  const category =
    Object.values(CategoryEnum).find((value) => value === searchParams[0].get("cat")) ??
    CategoryEnum.NonShortcut;
  return {
    category,
    setCategory: (category: CategoryEnum) => {
      const cat = category === CategoryEnum.NonShortcut ? undefined : category;
      searchParams[1]((prev) => paramReplace(prev, "cat", cat, overwriteParams));
    },
  };
};

export const useTrackParam = (searchParams: SearchParams, overwriteParams: string[] = []) => {
  const track = parseInt(searchParams[0].get("trk") ?? "-5");
  return {
    track,
    setTrack: (trackId: number) => {
      const trk = trackId === -5 ? undefined : trackId.toString();
      searchParams[1]((prev) => paramReplace(prev, "trk", trk, overwriteParams));
    },
  };
};

export const useRowHighlightParam = (searchParams: SearchParams) => {
  const highlight =
    searchParams[0].get("hl") !== null
      ? +parseFloat(searchParams[0].get("hl") as string).toFixed(4)
      : null;
  return {
    highlight,
    setHighlight: (highlight: number) => {
      searchParams[1]((prev) => paramReplace(prev, "hl", highlight.toString()));
    },
  };
};

export const useIdsParam = (searchParams: SearchParams, overwriteParams: string[] = []) => {
  const ids = (searchParams[0].get("ids") ?? "")
    .replaceAll("%2C", ",")
    .split(",")
    .map((x) => parseInt(x))
    .filter((x) => x > 0);
  return {
    ids,
    setIds: (ids: number[]) => {
      searchParams[1]((prev) => paramReplace(prev, "ids", ids.toString(), overwriteParams));
    },
  };
};

export const useLapModeParam = (
  searchParams: SearchParams,
  restrictedSet: boolean = true,
  overwriteParams: string[] = [],
) => {
  const defVal = restrictedSet ? LapModeEnum.Course : LapModeEnum.Overall;
  const lapMode =
    Object.values(LapModeEnum).find((value) =>
      restrictedSet
        ? value !== LapModeEnum.Overall && value === searchParams[0].get("lap")
        : value === searchParams[0].get("lap"),
    ) ?? defVal;
  return {
    lapMode,
    setLapMode: (lapMode: LapModeEnum) => {
      const lap = lapMode === defVal ? undefined : lapMode;
      searchParams[1]((prev) => paramReplace(prev, "lap", lap, overwriteParams));
    },
  };
};

export const useTopParam = (searchParams: SearchParams, overwriteParams: string[] = []) => {
  const gottenTop = searchParams[0].get("top") ?? TimetrialsRegionsRankingsListTopEnum.Records;
  const top =
    Object.values(TimetrialsRegionsRankingsListTopEnum).find((value) => value === gottenTop) ??
    TimetrialsRegionsRankingsListTopEnum.Records;
  return {
    top,
    setTopNumber: (top: TimetrialsRegionsRankingsListTopEnum) => {
      searchParams[1]((prev) =>
        paramReplace(
          prev,
          "top",
          top === TimetrialsRegionsRankingsListTopEnum.Records ? undefined : top,
          overwriteParams,
        ),
      );
    },
  };
};

export const useRegionTypeRestrictedParam = (
  searchParams: SearchParams,
  overwriteParams: string[] = [],
) => {
  const gottenRegionType =
    (searchParams[0].get("regty") as TimetrialsRegionsRankingsListTypeEnum) ??
    TimetrialsRegionsRankingsListTypeEnum.Country;
  const regionType =
    [
      TimetrialsRegionsRankingsListTypeEnum.Subnational,
      TimetrialsRegionsRankingsListTypeEnum.Continent,
    ].find((value) => value === gottenRegionType) ?? TimetrialsRegionsRankingsListTypeEnum.Country;
  return {
    regionType,
    setRegionType: (regionType: TimetrialsRegionsRankingsListTypeEnum) => {
      searchParams[1]((prev) =>
        paramReplace(
          prev,
          "regty",
          regionType === TimetrialsRegionsRankingsListTypeEnum.Country ? undefined : regionType,
          overwriteParams,
        ),
      );
    },
  };
};

export const useRegionParam = (searchParams: SearchParams) => {
  const metadata = useContext(MetadataContext);

  const region =
    metadata.regions?.find((region) => region.code.toLowerCase() === searchParams[0].get("reg")) ??
    WorldRegion;
  return {
    region,
    setRegion: (region: Region) => {
      const reg = region.code === WorldRegion.code ? undefined : region;
      searchParams[1]((prev) => paramReplace(prev, "reg", reg?.code.toLowerCase()));
    },
  };
};

export const useStandardLevelIdParam = (searchParams: SearchParams) => {
  let levelId = parseInt(searchParams[0].get("std") ?? "1");
  if (levelId > 43) levelId = 1;
  return {
    levelId,
    setLevelId: (levelId: number) => {
      const std = levelId === 1 ? undefined : levelId;
      searchParams[1]((prev) => paramReplace(prev, "std", std?.toString()));
    },
  };
};

export const purgeQueryParamsFromRecord = (params: Record<string, any>) => {
  let out: Record<string, string> = {};
  for (let [k, v] of Object.entries(params)) {
    if (v === null || v === undefined) continue;
    out[`${k}`] = `${v}`;
  }
  return out;
};

export const buildQueryParamString = (params: Record<string, any>) => {
  let paramsArr = Object.entries(purgeQueryParamsFromRecord(params));
  return paramsArr.length > 0 ? "?" + paramsArr.map(([k, v]) => `${k}=${v}`).join("&") : "";
};
