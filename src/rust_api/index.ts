export { Cup } from "./endpoints/cups";
export { Track } from "./endpoints/tracks";
export { Player, PlayerBasic } from "./endpoints/players";
export { Region, RegionType, type RegionTree, worldDefault } from "./endpoints/regions";
export { StandardLevel } from "./endpoints/standardLevels";
export { Standard } from "./endpoints/standards";
export { SiteChamp } from "./endpoints/siteChamps";
export { Ranking, MetricEnum } from "./endpoints/rankings";
export {
  Score,
  CategoryEnum,
  CategoryEnumValues,
  LapModeEnum,
  LapModeEnumValues,
  stringToCategoryEnum,
  stringToLapModeEnum,
} from "./endpoints/scores";
export { Timesheet } from "./endpoints/playerTimesheet";

const url = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:8080";

export const apiFetch = (endpoint: string, init?: RequestInit): Promise<Response> => {
  if (
    init &&
    (init?.method === "GET" || init?.method === "HEAD" || init?.method === undefined) &&
    init.body
  )
    console.error("Method can't be GET or HEAD and have a body");

  return fetch(url + "/v1" + endpoint, { method: "GET", ...init });
};

export const dateReviver = () => {};
