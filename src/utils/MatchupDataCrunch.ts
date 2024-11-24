import api, { CategoryEnum, Player, PlayerStats, Score, Track } from "../api";
import { LapModeEnum } from "../components/widgets/LapModeSelect";

export interface MatchupData {
  playerData: Player;
  scoreData: Array<Score | MatchupScore>;
  statsData: PlayerStats;
  isLapStats: {
    wins: number;
    ties: number;
    losses: number;
  };
  isntLapStats: {
    wins: number;
    ties: number;
    losses: number;
  };
}

export interface getPlayerDataParams {
  id: number;
  category: CategoryEnum;
  lapMode: LapModeEnum;
}

export const getPlayerData = async ({
  id,
  category,
  lapMode,
}: getPlayerDataParams): Promise<MatchupData> => {
  return {
    playerData: await api.timetrialsPlayersRetrieve({ id }),
    scoreData: await api.timetrialsPlayersScoresList({ id: id, category, region: 1 }),
    statsData: await api.timetrialsPlayersStatsRetrieve({
      id: id,
      category,
      lapMode,
      region: 1,
    }),
    isLapStats: {
      wins: -1,
      ties: -1,
      losses: -1,
    },
    isntLapStats: {
      wins: -1,
      ties: -1,
      losses: -1,
    },
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
    {
      ...p1Data,
      isLapStats: { wins: 0, ties: 0, losses: 0 },
      isntLapStats: {
        wins: 0,
        ties: 0,
        losses: 0,
      },
    },
    {
      ...p2Data,
      isLapStats: { wins: 0, ties: 0, losses: 0 },
      isntLapStats: {
        wins: 0,
        ties: 0,
        losses: 0,
      },
    },
  ];

  for (let track of tracks)
    for (let isLap of [false, true]) {
      const p1ScoreIndex = newData[0].scoreData.findIndex(
        (score) => score.track === track.id && score.isLap === isLap,
      );
      const p2ScoreIndex = newData[1].scoreData.findIndex(
        (score) => score.track === track.id && score.isLap === isLap,
      );
      const winLossTxt = isLap ? "isLapStats" : "isntLapStats";
      const p1Score =
        p1ScoreIndex < 0 ? undefined : (newData[0].scoreData[p1ScoreIndex] as MatchupScore);
      const p2Score =
        p2ScoreIndex < 0 ? undefined : (newData[1].scoreData[p2ScoreIndex] as MatchupScore);
      if (p1Score === undefined && p2Score === undefined) {
        newData[0][winLossTxt].ties++;
        newData[1][winLossTxt].ties++;
        continue;
      } else if (p1Score === undefined) {
        /* TS compiler crying because p2Score can be undefined?? LMFAO --FalB */
        newData[0][winLossTxt].losses++;
        newData[1][winLossTxt].wins++;
        (p2Score as MatchupScore).difference = null;
        continue;
      } else if (p2Score === undefined) {
        newData[0][winLossTxt].wins++;
        newData[1][winLossTxt].losses++;
        p1Score.difference = null;
        continue;
      }
      p1Score.difference = p1Score.value - p2Score.value;
      p2Score.difference = -p1Score.difference;
      if (p1Score.difference === 0) {
        newData[0][winLossTxt].ties++;
        newData[1][winLossTxt].ties++;
      } else if (p1Score.difference > 0) {
        newData[0][winLossTxt].losses++;
        newData[1][winLossTxt].wins++;
      } else {
        newData[0][winLossTxt].wins++;
        newData[1][winLossTxt].losses++;
      }
    }
  return newData;
};
