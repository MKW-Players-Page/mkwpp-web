import { useContext } from "react";
import { useSearchParams } from "react-router-dom";

import Deferred from "../widgets/Deferred";
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
import { MetricEnum, Ranking, RegionType } from "../../rust_api";

export interface RankingsMetric {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  metric: MetricEnum;
  metricOrder: number;
  getHighlightValue: (stat: number) => number;
  getValueString: (stat: number) => string;
}

export type RankingsMetricMap = {
  [key: string]: RankingsMetric;
};

export const RankingsMetrics: RankingsMetricMap = {
  AverageFinish: {
    titleKey: "rankingsPageAverageFinishTitle",
    descriptionKey: "rankingsPageAverageFinishDescription",
    metric: MetricEnum.AverageFinish,
    metricOrder: +1,
    getHighlightValue: (af) => parseInt(af.toFixed(4)),
    getValueString: (af) => String(af),
  },
  AverageStandard: {
    titleKey: "rankingsPageAverageStandardTitle",
    descriptionKey: "rankingsPageAverageStandardDescription",
    metric: MetricEnum.AverageRankRating,
    metricOrder: +1,
    getHighlightValue: (arr) => parseInt(arr.toFixed(4)),
    getValueString: (arr) => String(arr),
  },
  AverageRecordRatio: {
    titleKey: "rankingsPageAverageRecordRatioTitle",
    descriptionKey: "rankingsPageAverageRecordRatioDescription",
    metric: MetricEnum.PersonalRecordToWorldRecord,
    metricOrder: -1,
    getHighlightValue: (prwr) => parseInt(prwr.toFixed(4)),
    getValueString: (prwr) => prwr.toFixed(4) + "%",
  },
  TotalTime: {
    titleKey: "rankingsPageTotalTimeTitle",
    descriptionKey: "rankingsPageTotalTimeDescription",
    metric: MetricEnum.TotalTime,
    metricOrder: +1,
    getHighlightValue: (totalTime) => totalTime,
    getValueString: (totalTime) => formatTime(totalTime),
  },
  TallyPoints: {
    titleKey: "rankingsPageTallyPointsTitle",
    descriptionKey: "rankingsPageTallyPointsDescription",
    metric: MetricEnum.TallyPoints,
    metricOrder: -1,
    getHighlightValue: (tally) => tally,
    getValueString: (tally) => String(tally),
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
    () => Ranking.getChart(metric.metric, category, lapMode, region.id),
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
        metric.getHighlightValue(stats.value) < highlight &&
        (arr[idx - 1] === undefined || metric.getHighlightValue(arr[idx - 1].value) > highlight)) ||
        (metric.metricOrder > 0 &&
          metric.getHighlightValue(stats.value) > highlight &&
          (arr[idx - 1] === undefined || metric.getHighlightValue(arr[idx - 1].value) < highlight)))
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
            metric.metric === MetricEnum.PersonalRecordToWorldRecord
              ? highlight.toFixed(4) + "%"
              : metric.metric === MetricEnum.TotalTime
                ? formatTime(highlight)
                : highlight,
        },
      ]);
    }

    if (stats.player.id === user?.player || metric.getHighlightValue(stats.value) === highlight) {
      if (highlight !== null && metric.getHighlightValue(stats.value) === highlight)
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
            playerOrId={stats.player}
            regionOrId={stats.player.regionId}
            xxFlag
            showRegFlagRegardless={
              region.regionType === RegionType.Country ||
              region.regionType === RegionType.Subnational ||
              region.regionType === RegionType.SubnationalGroup
            }
          />
        ),
      },
      {
        content: metric.getValueString(stats.value),
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
