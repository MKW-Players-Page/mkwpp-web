import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, LapModeSelect } from "../widgets";
import api from "../../api";
import { useApi } from "../../hooks";
import {
  countryAFTopNumerical,
  countryAFTopToString,
  getCategorySiteHue,
} from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import {
  useCategoryParam,
  useLapModeParam,
  useRegionTypeRestrictedParam,
  useRowHighlightParam,
  useTopParam,
} from "../../utils/SearchParams";
import Dropdown, { DropdownData } from "../widgets/Dropdown";
import {
  TimetrialsRegionsRankingsListTopEnum,
  TimetrialsRegionsRankingsListTypeEnum,
} from "../../api/generated";

const CountryRankingsPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams, ["hl"]);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false, ["hl"]);
  const { top, setTopNumber } = useTopParam(searchParams, ["hl"]);
  const { regionType, setRegionType } = useRegionTypeRestrictedParam(searchParams, ["hl"]);

  const highlight = useRowHighlightParam(searchParams).highlight;
  const { isLoading, data } = useApi(
    () =>
      api.timetrialsRegionsRankingsList({
        category,
        lapMode,
        top,
        type: regionType,
      }),
    [category, lapMode, top, regionType],
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

  const siteHue = getCategorySiteHue(category);

  let text = "err";
  switch (top) {
    case TimetrialsRegionsRankingsListTopEnum.Records:
      text = "The best";
      break;
    case TimetrialsRegionsRankingsListTopEnum.Top3:
      text = "The best 3";
      break;
    case TimetrialsRegionsRankingsListTopEnum.Top5:
      text = "The best 5";
      break;
    case TimetrialsRegionsRankingsListTopEnum.Top10:
      text = "The best 10";
      break;
    case TimetrialsRegionsRankingsListTopEnum.All:
      text = "All the";
      break;
  }

  return (
    <>
      <h1>Country Rankings</h1>
      <p>
        {text} times for each country are taken for each track, and averaged. This value is then
        averaged over all tracks, like Average Finish.
      </p>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
          <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
          <Dropdown
            data={
              {
                defaultItemSet: 0,
                value: top,
                valueSetter: setTopNumber,
                data: [
                  {
                    id: 0,
                    children: Object.values(TimetrialsRegionsRankingsListTopEnum)
                      .sort((a, b) => countryAFTopNumerical(a) - countryAFTopNumerical(b))
                      .map((r) => {
                        return {
                          type: "DropdownItemData",
                          element: { text: countryAFTopToString(r), value: r },
                        };
                      }),
                  },
                ],
              } as DropdownData
            }
          />
          <Dropdown
            data={
              {
                defaultItemSet: 0,
                value: regionType,
                valueSetter: setRegionType,
                data: [
                  {
                    id: 0,
                    children: [
                      [TimetrialsRegionsRankingsListTypeEnum.Country, "Countries"],
                      [TimetrialsRegionsRankingsListTypeEnum.Continent, "Continents"],
                      [TimetrialsRegionsRankingsListTypeEnum.Subnational, "Subregions"],
                    ].map(([value, text]) => {
                      return {
                        type: "DropdownItemData",
                        element: { text, value },
                      };
                    }),
                  },
                ],
              } as DropdownData
            }
          />
        </div>
        <div className="module">
          <Deferred isWaiting={isLoading}>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Country</th>
                  <th>Average Finish</th>
                </tr>
              </thead>
              <tbody className="table-hover-rows">
                {data?.map((stats, idx, arr) => {
                  const calculatedValueStr = (stats.totalRank / stats.scoreCount).toFixed(4);
                  const calculatedValue = parseFloat(calculatedValueStr);
                  return (
                    <>
                      {highlight &&
                      calculatedValue > highlight &&
                      (arr[idx - 1] === undefined ||
                        arr[idx - 1].totalRank / arr[idx - 1].scoreCount < highlight) ? (
                        <>
                          <tr ref={highlightElement} key={highlight} className="highlighted">
                            <td />
                            <td>Your Highlighted Value</td>
                            <td>{highlight}</td>
                          </tr>
                        </>
                      ) : (
                        <></>
                      )}
                      <tr
                        key={stats.region.code}
                        className={calculatedValue === highlight ? "highlighted" : ""}
                        ref={calculatedValue === highlight ? highlightElement : undefined}
                      >
                        <td>{stats.rank}</td>
                        <td>
                          <FlagIcon region={stats.region} />
                          <span>{stats.region.name}</span>
                        </td>
                        <td>{calculatedValueStr}</td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </table>
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default CountryRankingsPage;
