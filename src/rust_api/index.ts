export { User, AuthData } from "./endpoints/user";
export { Cup } from "./endpoints/cups";
export { Track } from "./endpoints/tracks";
export { Player, PlayerBasic, typeguardPlayer } from "./endpoints/players";
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

export const apiFetch = async <T>(endpoint: string, init?: RequestInit): Promise<T> => {
  if (
    init &&
    (init?.method === "GET" || init?.method === "HEAD" || init?.method === undefined) &&
    init.body
  )
    console.error("Method can't be GET or HEAD and have a body");

  return fetch(url + "/v1" + endpoint, { method: "GET", ...init })
    .then((r) => r.json())
    .then((r) => {
      if (typeguardErrorResponse(r)) {
        // eslint-disable-next-line
        throw { non_field_errors: r.non_field_errors, ...r.field_errors };
      }
      return r;
    });
};

export interface FinalErrorResponse {
  non_field_errors: string[];
  field_errors: Record<string, string[]>;
}

const typeguardErrorResponse = (x: Object): x is FinalErrorResponse => {
  return x.hasOwnProperty("non_field_errors") && x.hasOwnProperty("field_errors");
};
