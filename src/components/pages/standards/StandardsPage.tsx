import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";

import "./StandardsPage.css";

import { Pages, resolvePage } from "../Pages";
import Deferred from "../../widgets/Deferred";
import { getCategoryNumerical, getCategorySiteHue } from "../../../utils/EnumUtils";
import { formatTime } from "../../../utils/Formatters";
import { MetadataContext } from "../../../utils/Metadata";
import api, { Standard } from "../../../api";
import OverwriteColor from "../../widgets/OverwriteColor";
import Dropdown, {
  DropdownData,
  DropdownItemData,
  DropdownItemSetDataChild,
} from "../../widgets/Dropdown";
import {
  useCategoryParam,
  useStandardLevelIdParam,
  useTrackParam,
} from "../../../utils/SearchParams";
import {
  I18nContext,
  translate,
  translateCategoryName,
  translateTrack,
} from "../../../utils/i18n/i18n";
import { SettingsContext } from "../../../utils/Settings";
import { CategoryRadio } from "../../widgets/CategorySelect";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../../widgets/Table";
import { LapModeEnum } from "../../widgets/LapModeSelect";
import { useApi } from "../../../hooks";
import { UserContext } from "../../../utils/User";
import { TrackDropdown } from "../../widgets/TrackSelect";

interface StandardDropdownProps {
  levelId: number;
  setLevelId: any;
}

// TODO: add some sort of grouping for standards on backend
const SortingOfDropdown = [
  1, 35, 2, 3, 4, 5, 36, 6, 7, 8, 9, 37, 10, 11, 12, 13, 38, 14, 15, 16, 17, 39, 18, 19, 20, 21, 40,
  22, 23, 24, 25, 41, 26, 27, 28, 29, 42, 30, 31, 32, 33, 43,
];

const StandardDropdown = ({ levelId, setLevelId }: StandardDropdownProps) => {
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);

  const standardsData: DropdownItemSetDataChild[] = metadata.standards?.map((l) => {
    return {
      type: "DropdownItemData",
      element: { text: l.name, value: l.id },
    } as DropdownItemSetDataChild;
  }) ?? [
    { type: "DropdownItemData", element: { text: "God", value: 1 } },
    { type: "DropdownItemData", element: { text: "God", value: 1 } },
  ];

  standardsData.pop();
  standardsData.push(
    {
      type: "DropdownItemData",
      element: { text: translate("standardsPageStandardDropdownAllMyth", lang), value: 35 },
    },
    {
      type: "DropdownItemData",
      element: { text: translate("standardsPageStandardDropdownAllLegend", lang), value: 36 },
    },
    {
      type: "DropdownItemData",
      element: { text: translate("standardsPageStandardDropdownAllKing", lang), value: 37 },
    },
    {
      type: "DropdownItemData",
      element: { text: translate("standardsPageStandardDropdownAllHero", lang), value: 38 },
    },
    {
      type: "DropdownItemData",
      element: { text: translate("standardsPageStandardDropdownAllExpert", lang), value: 39 },
    },
    {
      type: "DropdownItemData",
      element: { text: translate("standardsPageStandardDropdownAllIntermediate", lang), value: 40 },
    },
    {
      type: "DropdownItemData",
      element: { text: translate("standardsPageStandardDropdownAllApprentice", lang), value: 41 },
    },
    {
      type: "DropdownItemData",
      element: { text: translate("standardsPageStandardDropdownAllBeginner", lang), value: 42 },
    },
    {
      type: "DropdownItemData",
      element: { text: translate("standardsPageStandardDropdownAll", lang), value: 43 },
    },
  );

  return (
    <Dropdown
      data={
        {
          type: "Normal",
          value: levelId,
          valueSetter: setLevelId,
          defaultItemSet: 0,
          data: [
            {
              id: 0,
              children: standardsData.sort(
                (a, b) =>
                  SortingOfDropdown.indexOf((a.element as DropdownItemData).value) -
                  SortingOfDropdown.indexOf((b.element as DropdownItemData).value),
              ),
            },
          ],
        } as DropdownData
      }
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

interface StandardWithName extends Standard {
  name: string;
}

const StandardsPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { track, setTrack } = useTrackParam(searchParams);
  const { levelId, setLevelId } = useStandardLevelIdParam(searchParams);

  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);
  const { user } = useContext(UserContext);

  const { data: userScores, isLoading: scoresLoading } = useApi(
    () => api.timetrialsPlayersScoresList({ category, id: user?.player ?? 1 }),
    [user?.player, category],
    "playerProfileScores",
  );

  const { isLoading: userStatsLoading, data: userStats } = useApi(
    () =>
      api.timetrialsPlayersStatsRetrieve({
        id: user?.player ?? 1,
        category,
        lapMode,
        region: 1,
      }),
    [user?.player, category, lapMode],
    "playerProfileStats",
  );

  const level: { standards: StandardWithName[] } = { standards: [] };
  metadata.standards
    ?.filter((l) =>
      levelId < 35 ? l.id === levelId : levelId === 43 || Filter[levelId].includes(l.id),
    )
    .forEach((l) => {
      const newLevel = l.standards.map((r) => {
        (r as StandardWithName).name = l.name;
        return r;
      });
      level.standards.push(...(newLevel as unknown as StandardWithName[]));
    });

  const tableData: ArrayTableData = { classNames: [] };

  const filteredStandards: ArrayTableCellData[][] = level?.standards
    .filter(
      (r, _, arr) =>
        r.name !== "Newbie" &&
        (r.category === category ||
          arr
            .filter((j) => j.category <= category && r.track === j.track && r.isLap === j.isLap)
            .sort((a, b) => getCategoryNumerical(a.category) - getCategoryNumerical(b.category))
            .at(-1)?.id === r.id) &&
        (track === -5 || r.track === track),
    )
    .sort((a, b) => a.track - b.track || a.level - b.level || (a.isLap ? 1 : 0) - (b.isLap ? 1 : 0))
    .map((standard, idx, arr) => {
      const track = metadata.tracks?.find((track) => track.id === standard.track);
      const value = formatTime(standard.value ?? 0);

      if (
        user &&
        !scoresLoading &&
        (standard.value ?? 0) >
          (userScores?.find(
            (score) =>
              standard.category >= score.category &&
              standard.track === score.track &&
              score.isLap === standard.isLap,
          )?.value ?? 360000)
      )
        tableData.classNames?.push({ rowIdx: idx, className: "highlighted" });

      return [
        {
          content: (
            <Link
              to={resolvePage(
                Pages.TrackChart,
                { id: standard.track },
                { lap: standard.isLap ? LapModeEnum.Lap : null },
              )}
            >
              {translateTrack(track, lang)}
            </Link>
          ),
          className: "table-track-col",
          expandCell: [
            arr[idx - 1] && standard.isLap && arr[idx - 1].track === standard.track,
            false,
          ],
        },
        {
          content: translateCategoryName(standard.category, lang),
          className: "table-b2",
        },
        { content: standard.name },
        { content: standard.isLap ? null : value, className: "table-b1" },
        { content: value, expandCell: [false, !standard.isLap], className: "table-b1" },
        { content: value, className: "table-s1" },
      ] as ArrayTableCellData[];
    });

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
        </div>
        <div
          className="module"
          style={
            { "--track-selected": track === -5 ? "table-cell" : "none" } as React.CSSProperties
          }
        >
          <Deferred isWaiting={metadata.isLoading || scoresLoading}>
            <ArrayTable
              headerRows={[
                [
                  {
                    content: translate("standardsPageTrackCol", lang),
                    className: "table-track-col",
                  },
                  {
                    content: translate("standardsPageCategoryCol", lang),
                    className: "table-b2",
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
          <Deferred isWaiting={metadata.isLoading || userStatsLoading}>
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
                metadata.standards?.map((l, idx) => {
                  if (
                    user &&
                    !userStatsLoading &&
                    (userStats?.totalStandard ?? 36 * 64) / 64 < l.value
                  )
                    secondTableData.classNames?.push({ rowIdx: idx, className: "highlighted" });
                  return [
                    {
                      content: l.name,
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
