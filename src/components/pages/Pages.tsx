import { RouteObject, generatePath } from 'react-router-dom';

import HomePage from './HomePage';
import PlayerListPage from './PlayerListPage';
import PlayerProfilePage from './PlayerProfilePage';
import RulesPage from './RulesPage';
import TrackChartPage from './TrackChartPage';
import TrackListPage from './TrackListPage';
import TrackRecordsPage from './TrackRecordsPage';
import StandardsPage from './StandardsPage';


export type PageMap = {
  [key: string]: RouteObject;
};

export const Pages: PageMap = {
  Home: {
    index: true,
    element: <HomePage />,
  },
  PlayerList: {
    path: '/players',
    element: <PlayerListPage />,
  },
  PlayerProfile: {
    path: '/players/:id',
    element: <PlayerProfilePage />,
  },
  Rules: {
    path: '/rules',
    element: <RulesPage />,
  },
  TrackChart: {
    path: '/courses/:id',
    element: <TrackChartPage />,
  },
  TrackList: {
    path: '/courses',
    element: <TrackListPage />,
  },
  TrackRecords: {
    path: '/records',
    element: <TrackRecordsPage />,
  },
  Standards: {
    path: '/standards',
    element: <StandardsPage />,
  },
};

/** Generates path for given page optionally with given params. */
export const resolvePage = (page: RouteObject, params = {}) => {
  return page.index || !page.path ? '/' : generatePath(page.path, params);
};
