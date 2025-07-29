import { useContext } from "react";
import { SetURLSearchParams } from "react-router";
import { MetadataContext } from "./Metadata";
import {
  Region,
  LapModeEnum,
  CategoryEnum,
  stringToLapModeEnum,
  stringToCategoryEnum,
  RegionType,
} from "../api";
import {
  CountryRankingsTopEnum,
  stringToCountryRankingsTopEnum,
} from "../api/endpoints/countryRankings";
import { stringToRegionType } from "../api/endpoints/regions";
import { formatDate } from "./Formatters";

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
        ([k, _]) => ![param, ...overwriteParams].includes(k),
      ),
    ),
    ...(value ? { [param]: value } : {}),
  };
};

export const useCategoryParam = (searchParams: SearchParams, overwriteParams: string[] = []) => {
  const category = stringToCategoryEnum(searchParams[0].get("cat") ?? "");
  return {
    category,
    setCategory: (category: CategoryEnum) => {
      const cat = category === CategoryEnum.NonShortcut ? undefined : category;
      searchParams[1]((prev) => paramReplace(prev, "cat", cat?.toString(), overwriteParams));
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
  const lapMode = stringToLapModeEnum(searchParams[0].get("lap") ?? "", restrictedSet);
  return {
    lapMode,
    setLapMode: (lapMode: LapModeEnum) => {
      const lap = lapMode === defVal ? undefined : lapMode.toString();
      searchParams[1]((prev) => paramReplace(prev, "lap", lap, overwriteParams));
    },
  };
};

export const useDateParam = (searchParams: SearchParams, validDates: Date[]) => {
  const dateStr = searchParams[0].get("dat");

  if (validDates.length === 0)
    return {
      date: new Date(),
      setDate: (_date: Date) => {},
    };

  let date = validDates[0];
  if (dateStr !== null) {
    const inputDate = new Date(dateStr);
    date = validDates.find((date) => date <= inputDate) ?? date;
  }

  return {
    setDate: (date: Date) => {
      let dateStr: string | undefined = formatDate(date);
      if (dateStr === formatDate(validDates[0])) dateStr = undefined;
      searchParams[1]((prev) => paramReplace(prev, "dat", dateStr));
    },
    date,
  };
};

export const useTopParam = (searchParams: SearchParams, overwriteParams: string[] = []) => {
  const top = stringToCountryRankingsTopEnum(searchParams[0].get("lim") ?? "");
  return {
    top,
    setTopNumber: (limit: CountryRankingsTopEnum) => {
      searchParams[1]((prev) => paramReplace(prev, "lim", limit?.toString(), overwriteParams));
    },
  };
};

export const useRegionTypeParam = (searchParams: SearchParams, overwriteParams: string[] = []) => {
  const gottenRegionType = stringToRegionType(searchParams[0].get("rty") ?? "");
  const regionType =
    [RegionType.Subnational, RegionType.Continent].find((value) => value === gottenRegionType) ??
    RegionType.Country;
  return {
    regionType,
    setRegionType: (regionType: RegionType) => {
      searchParams[1]((prev) => paramReplace(prev, "rty", regionType.toString(), overwriteParams));
    },
  };
};

export const useRegionParam = (searchParams: SearchParams) => {
  const metadata = useContext(MetadataContext);

  const region = metadata.isLoading
    ? Region.worldDefault()
    : (metadata.regions?.find(
        (region) => region.code.toLowerCase() === searchParams[0].get("reg"),
      ) ?? Region.worldDefault());
  return {
    region,
    setRegion: (region: Region) => {
      const reg = region.code === Region.worldDefault().code ? undefined : region;
      searchParams[1]((prev) => paramReplace(prev, "reg", reg?.code.toLowerCase()));
    },
  };
};

export const usePageNumber = (searchParams: SearchParams) => {
  const pageNumber = parseInt(searchParams[0].get("page") ?? "1");
  return {
    pageNumber,
    setPageNumber: (pageNumber: number) => {
      const page = pageNumber === 1 ? undefined : pageNumber;
      searchParams[1]((prev) => paramReplace(prev, "page", page?.toString()));
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
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === null || v === undefined) continue;
    out[`${k}`] = `${v}`;
  }
  return out;
};

export const buildQueryParamString = (params: Record<string, any>) => {
  const paramsArr = Object.entries(purgeQueryParamsFromRecord(params));
  return paramsArr.length > 0 ? "?" + paramsArr.map(([k, v]) => `${k}=${v}`).join("&") : "";
};
