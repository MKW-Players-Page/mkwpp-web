import { useContext, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import Deferred from "../widgets/Deferred";
import { CategorySelect, LapModeSelect } from "../widgets";
import api from "../../api";
import { PlayerStats, TimetrialsRankingsListMetricEnum as MetricEnum } from "../../api/generated";
import { useApi } from "../../hooks";
import { formatTime } from "../../utils/Formatters";
import { UserContext } from "../../utils/User";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import RegionSelectionDropdown from "../widgets/RegionDropdown";
import {
  useCategoryParam,
  useLapModeParam,
  useRegionParam,
  useRowHighlightParam,
} from "../../utils/SearchParams";
import { I18nContext, TranslationKey } from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";
import PlayerMention from "../widgets/PlayerMention";

export interface RankingsMetric {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  metric: MetricEnum;
  metricOrder: number;
  getHighlightValue: (player: PlayerStats) => number;
  getValueString: (player: PlayerStats) => string;
}

export type RankingsMetricMap = {
  [key: string]: RankingsMetric;
};

export const RankingsMetrics: RankingsMetricMap = {
  AverageFinish: {
    titleKey: "rankingsPageAverageFinishTitle",
    descriptionKey: "rankingsPageAverageFinishDescription",
    metric: "total_rank",
    metricOrder: +1,
    getHighlightValue: (stats) => +(stats.totalRank / 64).toFixed(4),
    getValueString: (stats) => String(stats.totalRank / 64),
  },
  AverageStandard: {
    titleKey: "rankingsPageAverageStandardTitle",
    descriptionKey: "rankingsPageAverageStandardDescription",
    metric: "total_standard",
    metricOrder: +1,
    getHighlightValue: (stats) => +(stats.totalStandard / 64).toFixed(4),
    getValueString: (stats) => String(stats.totalStandard / 64),
  },
  AverageRecordRatio: {
    titleKey: "rankingsPageAverageRecordRatioTitle",
    descriptionKey: "rankingsPageAverageRecordRatioDescription",
    metric: "total_record_ratio",
    metricOrder: -1,
    getHighlightValue: (stats) => +((stats.totalRecordRatio / 64) * 100).toFixed(4),
    getValueString: (stats) => ((stats.totalRecordRatio / 64) * 100).toFixed(4) + "%",
  },
  TotalTime: {
    titleKey: "rankingsPageTotalTimeTitle",
    descriptionKey: "rankingsPageTotalTimeDescription",
    metric: "total_score",
    metricOrder: +1,
    getHighlightValue: (stats) => stats.totalScore,
    getValueString: (stats) => formatTime(stats.totalScore),
  },
  TallyPoints: {
    titleKey: "rankingsPageTallyPointsTitle",
    descriptionKey: "rankingsPageTallyPointsDescription",
    metric: "leaderboard_points",
    metricOrder: -1,
    getHighlightValue: (stats) => stats.leaderboardPoints,
    getValueString: (stats) => String(stats.leaderboardPoints),
  },
};

export interface RankingsProps {
  metric: RankingsMetric;
}

const RankingsPage = ({ metric }: RankingsProps) => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams, ["hl"]);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false, ["hl"]);
  const { region, setRegion } = useRegionParam(searchParams);
  const highlight = useRowHighlightParam(searchParams).highlight;

  const { translations, lang } = useContext(I18nContext);
  const { user } = useContext(UserContext);
  const { settings } = useContext(SettingsContext);

  const { isLoading, data: rankings } = useApi(
    () =>
      api.timetrialsRankingsList({
        category,
        lapMode,
        region: region.id,
        metric: metric.metric,
      }),
    [category, lapMode, region],
    "playerRankings",
  );

  const highlightElement = useRef(null);
  useEffect(() => {
    if (highlightElement !== null) {
      (highlightElement.current as unknown as HTMLDivElement)?.scrollIntoView({
        inline: "center",
        block: "center",
      });
    }
  }, [highlightElement, isLoading]);

  const siteHue = getCategorySiteHue(category, settings);

  return (
    <>
      <h1>{translations[metric.titleKey][lang]}</h1>
      <p>{translations[metric.descriptionKey][lang]}</p>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
          <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
          <RegionSelectionDropdown
            onePlayerMin={false}
            twoPlayerMin={false}
            ranked={true}
            value={region}
            setValue={setRegion}
          />
        </div>
        <div className="module">
          <Deferred isWaiting={isLoading}>
            <table>
              <thead>
                <tr>
                  <th>{translations.rankingsPageRankCol[lang]}</th>
                  <th>{translations.rankingsPagePlayerCol[lang]}</th>
                  <th>{translations[metric.titleKey][lang]}</th>
                </tr>
              </thead>
              <tbody className="table-hover-rows">
                {rankings?.map((stats, idx, arr) => (
                  <>
                    {highlight &&
                    ((metric.metricOrder < 0 &&
                      metric.getHighlightValue(stats) < highlight &&
                      (arr[idx - 1] === undefined ||
                        metric.getHighlightValue(arr[idx - 1]) > highlight)) ||
                      (metric.metricOrder > 0 &&
                        metric.getHighlightValue(stats) > highlight &&
                        (arr[idx - 1] === undefined ||
                          metric.getHighlightValue(arr[idx - 1]) < highlight))) ? (
                      <>
                        <tr ref={highlightElement} key={highlight} className="highlighted">
                          <td />
                          <td>{translations.genericRankingsYourHighlightedValue[lang]}</td>
                          <td>
                            {metric.metric === "total_record_ratio"
                              ? highlight.toFixed(4) + "%"
                              : metric.metric === "total_score"
                                ? formatTime(highlight)
                                : highlight}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}
                    <tr
                      key={stats.player.id}
                      className={
                        stats.player.id === user?.player ||
                        metric.getHighlightValue(stats) === highlight
                          ? "highlighted"
                          : ""
                      }
                      ref={
                        metric.getHighlightValue(stats) === highlight ? highlightElement : undefined
                      }
                    >
                      <td>{stats.rank}</td>
                      <td>
                        <PlayerMention
                          precalcPlayer={stats.player}
                          precalcRegionId={stats.player.region ?? undefined}
                          xxFlag={true}
                          showRegFlagRegardless={
                            region.type === "country" ||
                            region.type === "subnational" ||
                            region.type === "subnational_group"
                          }
                        />
                      </td>
                      <td>{metric.getValueString(stats)}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default RankingsPage;
