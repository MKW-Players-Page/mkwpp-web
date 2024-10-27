import { useContext } from "react";
import { SetURLSearchParams } from "react-router-dom";
import { CategoryEnum, Region } from "../api";
import { LapModeEnum } from "../components/widgets/LapModeSelect";
import { MetadataContext } from "./Metadata";
import { WorldRegion } from "./Defaults";

export type SearchParams = [URLSearchParams, SetURLSearchParams];

export const paramReplace = (prev: URLSearchParams, param: string, value: string | undefined) => {
  return {
    ...(({ [param]: omit, ...rest }) => rest)(Object.fromEntries(prev)),
    ...(value ? { [param]: value } : {}),
  };
};

export const useCategoryParam = (
  searchParams: SearchParams,
  overwriteHighlightParam: boolean = false,
) => {
  const category =
    Object.values(CategoryEnum).find((value) => value === searchParams[0].get("cat")) ??
    CategoryEnum.NonShortcut;
  return {
    category,
    setCategory: (category: CategoryEnum) => {
      const cat = category === CategoryEnum.NonShortcut ? undefined : category;
      if (overwriteHighlightParam) searchParams[1]((prev) => paramReplace(prev, "hl", undefined));
      searchParams[1]((prev) => paramReplace(prev, "cat", cat));
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

export const useLapModeParam = (
  searchParams: SearchParams,
  restrictedSet: boolean = true,
  overwriteHighlightParam: boolean = false,
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
      if (overwriteHighlightParam) searchParams[1]((prev) => paramReplace(prev, "hl", undefined));
      searchParams[1]((prev) => paramReplace(prev, "lap", lap));
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
  const metadata = useContext(MetadataContext);

  let levelId = parseInt(searchParams[0].get("std") ?? "1");
  const lastLevelId = metadata.standards?.map((std) => std.id).sort((a, b) => b - a)[0] ?? 1;
  if (lastLevelId < levelId) levelId = lastLevelId;
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
