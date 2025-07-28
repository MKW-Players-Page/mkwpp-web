import { useContext } from "react";
import { Link, useSearchParams } from "react-router";

import "./StandardsPage.css";

import { Pages, resolvePage } from "../Pages";
import Deferred from "../../widgets/Deferred";
import { getCategorySiteHue, getHighestValid } from "../../../utils/EnumUtils";
import { formatLapMode, formatTime } from "../../../utils/Formatters";
import { MetadataContext } from "../../../utils/Metadata";
import OverwriteColor from "../../widgets/OverwriteColor";
import {
  useCategoryParam,
  useLapModeParam,
  useStandardLevelIdParam,
  useTrackParam,
} from "../../../utils/SearchParams";
import {
  I18nContext,
  translate,
  translateCategoryName,
  translateStandardName,
  translateTrack,
} from "../../../utils/i18n/i18n";
import { SettingsContext } from "../../../utils/Settings";
import { CategoryRadio } from "../../widgets/CategorySelect";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../../widgets/Table";
import { LapModeRadio } from "../../widgets/LapModeSelect";
import { CategoryEnum, LapModeEnum, Timesheet } from "../../../api";
import { useApi } from "../../../hooks";
import { UserContext } from "../../../utils/User";
import { TrackDropdown } from "../../widgets/TrackSelect";
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";

interface StandardDropdownProps {
  levelId: number;
  setLevelId: any;
}

// TODO: add some sort of grouping for standards on backend
const SortingOfDropdown = [
  43, 1, 35, 2, 3, 4, 5, 36, 6, 7, 8, 9, 37, 10, 11, 12, 13, 38, 14, 15, 16, 17, 39, 18, 19, 20, 21,
  40, 22, 23, 24, 25, 41, 26, 27, 28, 29, 42, 30, 31, 32, 33, 34,
];

const StandardDropdown = ({ levelId, setLevelId }: StandardDropdownProps) => {
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);

  return (
    <Autocomplete
      value={levelId}
      style={{ minWidth: "300px" }}
      onChange={(_, v) => {
        if (v === null) return;
        setLevelId(v);
      }}
      autoComplete
      autoHighlight
      openOnFocus
      options={SortingOfDropdown}
      filterOptions={createFilterOptions({
        ignoreCase: true,
        ignoreAccents: true,
      })}
      renderInput={(params) => {
        return <TextField {...params} />;
      }}
      getOptionLabel={(option) => {
        const standardLevel = metadata.standardLevels?.find((r) => r.id === option);
        if (standardLevel !== undefined) return translateStandardName(standardLevel, lang);
        if (option === 35) return translate("standardsPageStandardDropdownAllMyth", lang);
        if (option === 36) return translate("standardsPageStandardDropdownAllLegend", lang);
        if (option === 37) return translate("standardsPageStandardDropdownAllKing", lang);
        if (option === 38) return translate("standardsPageStandardDropdownAllHero", lang);
        if (option === 39) return translate("standardsPageStandardDropdownAllExpert", lang);
        if (option === 40) return translate("standardsPageStandardDropdownAllIntermediate", lang);
        if (option === 41) return translate("standardsPageStandardDropdownAllApprentice", lang);
        if (option === 42) return translate("standardsPageStandardDropdownAllBeginner", lang);
        if (option === 43) return translate("standardsPageStandardDropdownAll", lang);
        return translateStandardName(undefined, lang);
      }}
    />
  );
};

const Filter: Record<number, number[]> = {
  35: [2, 3, 4, 5],
  36: [6, 7, 8, 9],
  37: [10, 11, 12, 13],
  38: [14, 15, 16, 17],
  39: [18, 19, 20, 21],
  40: [22, 23, 24, 25],
  41: [26, 27, 28, 29],
  42: [30, 31, 32, 33],
};

const StandardsPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { track, setTrack } = useTrackParam(searchParams);
  const { levelId, setLevelId } = useStandardLevelIdParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams);

  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);
  const { user } = useContext(UserContext);

  const { data: userScores, isLoading: scoresLoading } = useApi(
    () => Timesheet.get(user?.playerId ?? 1, category),
    [user?.playerId, category],
    "Timesheet.get",
  );

  let hasHighlightedRow = [false, false];

  const highestValidPerTrack = [
    Array.from({ length: 31 }, (value, index) =>
      getHighestValid(
        category,
        metadata.standards
          ?.filter((r) => r.trackId === index + 1 && r.isLap === false)
          .map((r) => r.category) ?? [CategoryEnum.NonShortcut],
      ),
    ),
    Array.from({ length: 31 }, (value, index) =>
      getHighestValid(
        category,
        metadata.standards
          ?.filter((r) => r.trackId === index + 1 && r.isLap === true)
          .map((r) => r.category) ?? [CategoryEnum.NonShortcut],
      ),
    ),
  ];

  const { filteredStandards, tableData } = metadata.standards
    ?.filter(
      (standard) =>
        standard.standardLevelId !== 34 &&
        (category === CategoryEnum.NonShortcut
          ? standard.category === category
          : standard.category === highestValidPerTrack[+standard.isLap][standard.trackId - 1]) &&
        (levelId < 34
          ? standard.standardLevelId === levelId
          : levelId === 43 || Filter[levelId].includes(standard.standardLevelId)) &&
        (track === -5 || standard.trackId === track),
    )
    .sort(
      (a, b) =>
        a.trackId - b.trackId ||
        a.standardLevelId - b.standardLevelId ||
        (a.isLap ? 1 : 0) - (b.isLap ? 1 : 0),
    )
    .reduce(
      (acc, standard, idx, arr) => {
        const track = metadata.tracks?.find((track) => track.id === standard.trackId);
        const value = formatTime(standard.value ?? 0);

        if (idx > 0 && arr[idx - 1].trackId !== standard.trackId)
          hasHighlightedRow = [false, false];

        if (
          !hasHighlightedRow[+(standard?.isLap ?? false)] &&
          user &&
          !scoresLoading &&
          (standard.value ?? 0) >
            (userScores?.times.find(
              (score) =>
                standard.trackId === score.trackId &&
                score.isLap === standard.isLap &&
                category >= score.category,
            )?.value ?? 360000)
        ) {
          hasHighlightedRow[+(standard?.isLap ?? false)] = true;
          acc.tableData.classNames?.push({ rowIdx: idx, className: "highlighted" });
        }

        acc.filteredStandards.push([
          {
            content: (
              <Link
                to={resolvePage(
                  Pages.TrackChart,
                  { id: standard.trackId },
                  { lap: standard.isLap ? LapModeEnum.Lap : null },
                )}
              >
                {translateTrack(track, lang)}
              </Link>
            ),
            className: "table-track-col table-b1",
            expandCell: [
              idx > 0 && standard.isLap && arr[idx - 1].trackId === standard.trackId,
              false,
            ],
          },
          {
            content: (
              <Link
                to={resolvePage(
                  Pages.TrackChart,
                  { id: standard.trackId },
                  { lap: standard.isLap ? LapModeEnum.Lap : null },
                )}
              >
                <>
                  <span className="table-b3">{translateTrack(track, lang)}</span>
                  <span className="table-s3">{track?.abbr}</span>
                </>
              </Link>
            ),
            className: "table-track-col table-s1",
          },
          {
            content: translateCategoryName(standard.category, lang),
            className: "table-b2 table-category-col",
          },
          {
            content: translateStandardName(metadata.getStandardLevel(standard), lang),
          },
          { content: standard.isLap ? null : value, className: "table-b1" },
          { content: value, expandCell: [false, !standard.isLap], className: "table-b1" },
          { content: value, className: "table-s1" },
        ]);

        acc.tableData.rowKeys?.push(`${standard.trackId}-${standard.isLap}-${standard.id}`);

        return acc;
      },
      {
        filteredStandards: [] as ArrayTableCellData[][],
        tableData: { classNames: [], rowKeys: [] } as ArrayTableData,
      },
    ) ?? { filteredStandards: [], tableData: { classNames: [], rowKeys: [] } };

  const siteHue = getCategorySiteHue(category, settings);

  const secondTableData: ArrayTableData = { classNames: [] };

  return (
    <>
      <h1>{translate("standardsPageHeading", lang)}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
          <StandardDropdown levelId={levelId} setLevelId={setLevelId} />
          <TrackDropdown value={track} onChange={setTrack} allTracks />
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio className="table-s1" value={lapMode} onChange={setLapMode} />
        </div>
        <div
          className={`module standards-table ${formatLapMode(lapMode).toLowerCase()}`}
          style={
            {
              "--track-selected": track === -5 ? "table-cell" : "none",
              "--category-selected": category === CategoryEnum.NonShortcut ? "none" : "table-cell",
            } as React.CSSProperties
          }
        >
          <Deferred isWaiting={metadata.isLoading || scoresLoading}>
            <ArrayTable
              headerRows={[
                [
                  {
                    content: translate("standardsPageTrackCol", lang),
                    className: "table-track-col table-b1",
                  },
                  {
                    content: translate("standardsPageTrackCol", lang),
                    className: "table-track-col table-s1",
                  },
                  {
                    content: translate("standardsPageCategoryCol", lang),
                    className: "table-category-col table-b2",
                  },
                  { content: translate("standardsPageStandardCol", lang) },
                  {
                    content: translate("standardsPageCourseCol", lang),
                    className: "table-b1",
                  },
                  {
                    content: translate("standardsPageLapCol", lang),
                    className: "table-b1",
                  },
                  {
                    content: translate("standardsPageTimeCol", lang),
                    className: "table-s1",
                  },
                ],
              ]}
              rows={filteredStandards}
              tableData={tableData}
            />
          </Deferred>
        </div>
        <div className="module">
          <Deferred isWaiting={metadata.isLoading || scoresLoading}>
            <ArrayTable
              headerRows={[
                [
                  { content: translate("standardsPageHelperChartTitle", lang) },
                  { content: null, expandCell: [true, true] },
                ],
                [
                  { content: translate("standardsPageStandardCol", lang) },
                  { content: translate("standardsPagePointsCol", lang) },
                ],
              ]}
              rows={
                metadata.standardLevels?.map((l, idx) => {
                  if (user && !scoresLoading && (userScores?.arr ?? 36 * 64) < l.value)
                    secondTableData.classNames?.push({ rowIdx: idx, className: "highlighted" });
                  return [
                    {
                      content: translateStandardName(l, lang),
                    },
                    { content: l.value },
                  ];
                }) ?? []
              }
              tableData={secondTableData}
            />
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default StandardsPage;
