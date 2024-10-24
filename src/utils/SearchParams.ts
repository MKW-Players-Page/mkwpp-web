import { SetURLSearchParams } from "react-router-dom";
import { CategoryEnum } from "../api";
import { LapModeEnum } from "../components/widgets/LapModeSelect";

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

export const useLapModeParam = (searchParams: SearchParams) => {
  const lapMode =
    Object.values(LapModeEnum).find((value) => value === searchParams[0].get("lap")) ??
    LapModeEnum.Course;
  return {
    lapMode,
    setLapMode: (lapMode: LapModeEnum) => {
      const lap = lapMode === LapModeEnum.Course ? undefined : lapMode;
      searchParams[1]((prev) => replace(prev, "lap", lap));
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
