import { Configuration, CoreApi, TimetrialsApi } from "./generated";
import { getToken, isAuthenticated } from "../utils/Auth";

export * from "./generated/models";

const apiConfiguration = new Configuration({
  basePath: process.env.REACT_APP_BACKEND_URL ?? "http://localhost:8000",
  apiKey: () => (isAuthenticated() ? `Token ${getToken()}` : ""),
});

export const coreApi = new CoreApi(apiConfiguration);

const api = new TimetrialsApi(apiConfiguration);

export default api;
