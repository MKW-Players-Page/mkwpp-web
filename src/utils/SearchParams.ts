import { useContext } from "react";
import { SetURLSearchParams } from "react-router-dom";
import { CategoryEnum, Region } from "../api";
import { LapModeEnum } from "../components/widgets/LapModeSelect";
import { MetadataContext } from "./Metadata";
import { WorldRegion } from "./Defaults";

export type SearchParams = [URLSearchParams, SetURLSearchParams];

const replace = (prev: URLSearchParams, param: string, value: string | undefined) => {
  return {
    ...(({ [param]: omit, ...rest }) => rest)(Object.fromEntries(prev)),
    ...(value ? { [param]: value } : {}),
  };
};

export const useCategoryParam = (searchParams: SearchParams) => {
  const category =
    Object.values(CategoryEnum).find((value) => value === searchParams[0].get("cat")) ??
    CategoryEnum.NonShortcut;
  return {
    category,
    setCategory: (category: CategoryEnum) => {
      const cat = category === CategoryEnum.NonShortcut ? undefined : category;
      searchParams[1]((prev) => replace(prev, "cat", cat));
    },
  };
};

export const useLapModeParam = (searchParams: SearchParams, restrictedSet: boolean = true) => {
  const defVal = restrictedSet ? LapModeEnum.Course : LapModeEnum.Overall;
  const lapMode =
    Object.values(LapModeEnum).find((value) => (restrictedSet && value !== LapModeEnum.Overall) && value === searchParams[0].get("lap")) ?? defVal;
  return {
    lapMode,
    setLapMode: (lapMode: LapModeEnum) => {
      const lap = lapMode === defVal ? undefined : lapMode;
      searchParams[1]((prev) => replace(prev, "lap", lap));
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
      const reg = region === WorldRegion ? undefined : region;
      searchParams[1]((prev) => replace(prev, "reg", reg?.code.toLowerCase()));
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
