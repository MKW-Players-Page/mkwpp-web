import api, { CategoryEnum, Player, PlayerStats, Score, Track } from "../api";
import { LapModeEnum } from "../components/widgets/LapModeSelect";

export interface MatchupData {
  playerData: Player;
  scoreData: Array<Score | MatchupScore>;
  statsData: PlayerStats;
  wins: number;
  ties: number;
  losses: number;
}

export const getPlayerData = async (
  id: number,
  category: CategoryEnum,
  lapMode: LapModeEnum,
): Promise<MatchupData> => {
  return {
    playerData: await api.timetrialsPlayersRetrieve({ id }),
    scoreData: await api.timetrialsPlayersScoresList({ id: id, category, region: 1 }),
    statsData: await api.timetrialsPlayersStatsRetrieve({
      id: id,
      category,
      lapMode,
      region: 1,
    }),
    wins: -1,
    ties: -1,
    losses: -1,
  };
};

export interface MatchupScore extends Score {
  difference: number | null;
}

/**
 @returns [p1Data, p2Data]
*/
export const compareTwoPlayers = (
  tracks: Track[],
  p1Data?: MatchupData,
  p2Data?: MatchupData,
): MatchupData[] | null => {
  if (!p1Data || !p2Data) return null;
  const newData: MatchupData[] = [
    { ...p1Data, wins: 0, ties: 0, losses: 0 },
    { ...p2Data, wins: 0, ties: 0, losses: 0 },
  ];

  for (let track of tracks)
    for (let category of track.categories)
      for (let isLap of [false, true]) {
        const p1ScoreIndex = newData[0].scoreData.findIndex(
          (score) =>
            score.track === track.id && score.category === category && score.isLap === isLap,
        );
        const p2ScoreIndex = newData[1].scoreData.findIndex(
          (score) =>
            score.track === track.id && score.category === category && score.isLap === isLap,
        );
        const p1Score =
          p1ScoreIndex < 0 ? undefined : (newData[0].scoreData[p1ScoreIndex] as MatchupScore);
        const p2Score =
          p2ScoreIndex < 1 ? undefined : (newData[1].scoreData[p2ScoreIndex] as MatchupScore);
        if (p1Score === undefined && p2Score === undefined) {
          continue;
        } else if (p1Score === undefined) {
          /* TS compiler crying because p2Score can be undefined?? LMFAO --FalB */
          (p2Score as MatchupScore).difference = null;
          continue;
        } else if (p2Score === undefined) {
          p1Score.difference = null;
          continue;
        }
        p1Score.difference = p1Score.value - p2Score.value;
        p2Score.difference = -p1Score.difference;
        if (p1Score.difference === 0) {
          newData[0].ties++;
          newData[1].ties++;
        } else if (p1Score.difference > 0) {
          newData[0].losses++;
          newData[1].wins++;
        } else {
          newData[0].wins++;
          newData[1].losses++;
        }
      }
  return newData;
};
