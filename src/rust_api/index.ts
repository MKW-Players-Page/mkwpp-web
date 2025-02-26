export { Cup } from "./endpoints/cups";
export { Track } from "./endpoints/tracks";

const url = process.env.REACT_APP_BACKEND_URL ?? "http://localhost:8080";

export const apiFetch = (endpoint: string, method: string = "GET"): Promise<Response> => {
  return fetch(url + "/v1" + endpoint, {
    method,
  });
};
