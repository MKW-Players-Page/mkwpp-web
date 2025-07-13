import { RouteObject, generatePath } from "react-router-dom";

import HomePage from "./HomePage";
import MatchupHomePage from "./matchup/MatchupSearch";
import MatchupPage from "./matchup/MatchupPage";
import PlayerListPage from "./PlayerListPage";
import PlayerProfilePage from "./PlayerProfilePage";
import RankingsPage, { RankingsMetrics } from "./RankingsPage";
import RulesPage from "./RulesPage";
import StandardsPage from "./standards/StandardsPage";
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
import UserPasswordForgotPage from "./user/UserPasswordForgotPage";
import UserPasswordResetPage from "./user/UserPasswordResetPage";
import { buildQueryParamString } from "../../utils/SearchParams";
import CountryRankingsPage from "./CountryRankingsPage";
import ContributionsPage from "./ContributionsPage";
import PastChampsPage from "./PastChampsPage";
import OptionsPage from "./OptionsPage";
import AdminDashboard from "./admin/AdminDashboard";
import AdminRegionsListPage from "./admin/regions/AdminRegions";
import AdminPlayersListPage from "./admin/players/AdminPlayers";
import AdminScoresListPage from "./admin/scores/AdminScores";
import AdminSubmissionsListPage from "./admin/submissions/AdminSubmissions";
import AdminEditSubmissionsListPage from "./admin/editSubmissions/AdminEditSubmissions";
import AdminUsersListPage from "./admin/users/AdminUsers";
import AdminParserOutputPage from "./admin/parser/AdminParserOutput";

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
    path: "/matchup/compare",
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
  PastChamps: {
    path: "/champs",
    element: <PastChampsPage />,
  },
  Options: {
    path: "/options",
    element: <OptionsPage />,
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
  UserPasswordForgot: {
    path: "/password/forgot",
    element: <UserPasswordForgotPage />,
  },
  UserPasswordReset: {
    path: "/password/reset",
    element: <UserPasswordResetPage />,
  },
  AdminUi: {
    path: "/admin/",
    element: <AdminDashboard />,
  },
  AdminUiRegions: {
    path: "/admin/regions",
    element: <AdminRegionsListPage />,
  },
  AdminUiPlayers: {
    path: "/admin/players",
    element: <AdminPlayersListPage />,
  },
  AdminUiUsers: {
    path: "/admin/users",
    element: <AdminUsersListPage />,
  },
  AdminUiScores: {
    path: "/admin/scores",
    element: <AdminScoresListPage />,
  },
  AdminUiSubmissions: {
    path: "/admin/submissions",
    element: <AdminSubmissionsListPage />,
  },
  AdminUiEditSubmissions: {
    path: "/admin/edit_submissions",
    element: <AdminEditSubmissionsListPage />,
  },
  AdminUiCSVParser: {
    path: "/admin/parser",
    element: <AdminParserOutputPage />,
  },
};

/** Generates path for given page optionally with given params. */
export const resolvePage = (page: RouteObject, params = {}, queryParams = {}) => {
  return page.index || !page.path
    ? "/"
    : generatePath(page.path, params) + buildQueryParamString(queryParams);
};
