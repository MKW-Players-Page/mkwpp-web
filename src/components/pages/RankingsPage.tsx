import { useContext } from "react";
import { useSearchParams } from "react-router";

import Deferred from "../widgets/Deferred";
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
  usePageNumber,
  useRegionParam,
  useRowHighlightParam,
} from "../../utils/SearchParams";
import { I18nContext, translate, TranslationKey } from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";
import PlayerMention from "../widgets/PlayerMention";
import { CategoryRadio } from "../widgets/CategorySelect";
import { LapModeRadio } from "../widgets/LapModeSelect";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../widgets/Table";
import { PaginationButtonRow } from "../widgets/PaginationButtons";

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
    getHighlightValue: (stats) =>
      +(stats.totalRank / (stats.isLap === undefined ? 64 : 32)).toFixed(4),
    getValueString: (stats) => String(stats.totalRank / (stats.isLap === undefined ? 64 : 32)),
  },
  AverageStandard: {
    titleKey: "rankingsPageAverageStandardTitle",
    descriptionKey: "rankingsPageAverageStandardDescription",
    metric: "total_standard",
    metricOrder: +1,
    getHighlightValue: (stats) =>
      +(stats.totalStandard / (stats.isLap === undefined ? 64 : 32)).toFixed(4),
    getValueString: (stats) => String(stats.totalStandard / (stats.isLap === undefined ? 64 : 32)),
  },
  AverageRecordRatio: {
    titleKey: "rankingsPageAverageRecordRatioTitle",
    descriptionKey: "rankingsPageAverageRecordRatioDescription",
    metric: "total_record_ratio",
    metricOrder: -1,
    getHighlightValue: (stats) =>
      +((stats.totalRecordRatio / (stats.isLap === undefined ? 64 : 32)) * 100).toFixed(4),
    getValueString: (stats) =>
      ((stats.totalRecordRatio / (stats.isLap === undefined ? 64 : 32)) * 100).toFixed(4) + "%",
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
  const { pageNumber, setPageNumber } = usePageNumber(searchParams);
  const highlight = useRowHighlightParam(searchParams).highlight;

  const { lang } = useContext(I18nContext);
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

  const tableArray: ArrayTableCellData[][] = [];
  const tableData: ArrayTableData = {
    classNames: [],
    rowKeys: [],
  };
  let hasHighlightRow = false;

  rankings?.forEach((stats, idx, arr) => {
    if (
      highlight &&
      ((metric.metricOrder < 0 &&
        metric.getHighlightValue(stats) < highlight &&
        (arr[idx - 1] === undefined || metric.getHighlightValue(arr[idx - 1]) > highlight)) ||
        (metric.metricOrder > 0 &&
          metric.getHighlightValue(stats) > highlight &&
          (arr[idx - 1] === undefined || metric.getHighlightValue(arr[idx - 1]) < highlight)))
    ) {
      hasHighlightRow = true;
      tableData.classNames?.push({
        rowIdx: idx,
        className: "highlighted",
      });
      tableData.rowKeys?.push("highlight");
      tableArray.push([
        { content: null },
        { content: translate("genericRankingsYourHighlightedValue", lang) },
        {
          content:
            metric.metric === "total_record_ratio"
              ? highlight.toFixed(4) + "%"
              : metric.metric === "total_score"
                ? formatTime(highlight)
                : highlight,
        },
      ]);
    }

    if (stats.player.id === user?.player || metric.getHighlightValue(stats) === highlight) {
      if (highlight !== null && metric.getHighlightValue(stats) === highlight)
        tableData.highlightedRow = idx;
      tableData.classNames?.push({
        rowIdx: idx + (hasHighlightRow ? 1 : 0),
        className: "highlighted",
      });
    }

    tableData.rowKeys?.push(`${stats.player.id}`);
    tableArray.push([
      { content: stats.rank },
      {
        content: (
          <PlayerMention
            precalcPlayer={stats.player}
            precalcRegionId={stats.player.region ?? undefined}
            xxFlag
            showRegFlagRegardless={
              region.type === "country" ||
              region.type === "subnational" ||
              region.type === "subnational_group"
            }
          />
        ),
      },
      {
        content: metric.getValueString(stats),
      },
    ]);
  });

  const siteHue = getCategorySiteHue(category, settings);

  const rowsPerPage = 100;
  const maxPageNumber = Math.ceil(tableArray.length / rowsPerPage);
  tableData.paginationData = {
    rowsPerPage,
    page: pageNumber,
    setPage: setPageNumber,
  };

  return (
    <>
      <h1>{translate(metric.titleKey, lang)}</h1>
      <p>{translate(metric.descriptionKey, lang)}</p>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio includeOverall value={lapMode} onChange={setLapMode} />
          <RegionSelectionDropdown
            onePlayerMin={false}
            twoPlayerMin={false}
            ranked
            value={region}
            setValue={setRegion}
          />
        </div>
        <PaginationButtonRow
          selectedPage={pageNumber}
          setSelectedPage={setPageNumber}
          numberOfPages={maxPageNumber}
        />
        <div className="module table-hover-rows">
          <Deferred isWaiting={isLoading}>
            <ArrayTable
              rows={tableArray}
              headerRows={[
                [
                  { content: translate("rankingsPageRankCol", lang) },
                  { content: translate("rankingsPagePlayerCol", lang) },
                  { content: translate(metric.titleKey, lang) },
                ],
              ]}
              tableData={tableData}
            />
          </Deferred>
        </div>
        <PaginationButtonRow
          selectedPage={pageNumber}
          setSelectedPage={setPageNumber}
          numberOfPages={maxPageNumber}
        />
      </OverwriteColor>
    </>
  );
};

export default RankingsPage;
