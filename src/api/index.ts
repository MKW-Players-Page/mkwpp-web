import { Configuration, TimetrialsApi } from './generated';

export * from './generated/models';

const api = new TimetrialsApi(new Configuration({
  basePath: 'http://localhost:8000',
}));

export default api;
