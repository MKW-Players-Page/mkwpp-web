import { RouteObject, generatePath } from "react-router-dom";

import HomePage from "./HomePage";
import MatchupPage, { MatchupHomePage } from "./MatchupPage";
import PlayerListPage from "./PlayerListPage";
import PlayerProfilePage from "./PlayerProfilePage";
import RankingsPage, { RankingsMetrics } from "./RankingsPage";
import RulesPage from "./RulesPage";
import StandardsPage from "./StandardsPage";
import TrackChartPage from "./TrackChartPage";
import TrackListPage from "./TrackListPage";
import TrackRecordsPage from "./TrackRecordsPage";
import TrackTopsPage, { TrackTopsHomePage } from "./TrackTopsPage";
import SubmissionPage from "./SubmissionPage";
import BlogListPage from "./blog/BlogListPage";
import BlogPostPage from "./blog/BlogPostPage";
import UserActivationPage from "./user/UserActivationPage";
import UserJoinPage, { UserJoinSuccessPage } from "./user/UserJoinPage";
import UserLoginPage from "./user/UserLoginPage";
import { buildQueryParamString } from "../../utils/SearchParams";
import CountryRankingsPage from "./CountryRankingsPage";
import ContributionsPage from "./ContributionsPage";

export type PageMap = {
  [key: string]: RouteObject;
};

export const Pages: PageMap = {
  Home: {
    index: true,
    element: <HomePage />,
  },
  BlogList: {
    path: "/archive",
    element: <BlogListPage />,
  },
  BlogPost: {
    path: "/archive/:id",
    element: <BlogPostPage />,
  },
  MatchupHome: {
    path: "/matchup",
    element: <MatchupHomePage />,
  },
  Matchup: {
    path: "/matchup/:id1/:id2",
    element: <MatchupPage />,
  },
  Contribute: {
    path: "/contribute",
    element: <ContributionsPage />,
  },
  PlayerList: {
    path: "/players",
    element: <PlayerListPage />,
  },
  PlayerProfile: {
    path: "/players/:id",
    element: <PlayerProfilePage />,
  },
  RankingsAverageFinish: {
    path: "/rankings/af",
    element: <RankingsPage key="af" metric={RankingsMetrics.AverageFinish} />,
  },
  RankingsAverageStandard: {
    path: "/rankings/arr",
    element: <RankingsPage key="arr" metric={RankingsMetrics.AverageStandard} />,
  },
  RankingsAverageRecordRatio: {
    path: "/rankings/prwr",
    element: <RankingsPage key="prwr" metric={RankingsMetrics.AverageRecordRatio} />,
  },
  RankingsTotalTime: {
    path: "/rankings/totals",
    element: <RankingsPage key="totals" metric={RankingsMetrics.TotalTime} />,
  },
  RankingsTallyPoints: {
    path: "/rankings/tally",
    element: <RankingsPage key="tally" metric={RankingsMetrics.TallyPoints} />,
  },
  CountryAF: {
    path: "/rankings/country",
    element: <CountryRankingsPage />,
  },
  Rules: {
    path: "/rules",
    element: <RulesPage />,
  },
  TrackChart: {
    path: "/courses/:id",
    element: <TrackChartPage />,
  },
  TrackList: {
    path: "/courses",
    element: <TrackListPage />,
  },
  TrackRecords: {
    path: "/records",
    element: <TrackRecordsPage />,
  },
  TrackTopsHome: {
    path: "/tops",
    element: <TrackTopsHomePage />,
  },
  TrackTops: {
    path: "/tops/:region/:cup",
    element: <TrackTopsPage />,
  },
  Standards: {
    path: "/standards",
    element: <StandardsPage />,
  },
  Submission: {
    path: "/submit",
    element: <SubmissionPage />,
  },
  UserActivation: {
    path: "/activate",
    element: <UserActivationPage />,
  },
  UserJoin: {
    path: "/join",
    element: <UserJoinPage />,
  },
  UserJoinSuccess: {
    path: "/join/success",
    element: <UserJoinSuccessPage />,
  },
  UserLogin: {
    path: "/login",
    element: <UserLoginPage />,
  },
};

/** Generates path for given page optionally with given params. */
export const resolvePage = (page: RouteObject, params = {}, queryParams = {}) => {
  return page.index || !page.path
    ? "/"
    : generatePath(page.path, params) + buildQueryParamString(queryParams);
};
