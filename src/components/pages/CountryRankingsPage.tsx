import { useContext } from "react";
import { useSearchParams } from "react-router-dom";

import Deferred from "../widgets/Deferred";
import { FlagIcon } from "../widgets";
import { useApi } from "../../hooks";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import {
  useCategoryParam,
  useLapModeParam,
  useRegionTypeParam,
  useRowHighlightParam,
  useTopParam,
} from "../../utils/SearchParams";
import Dropdown, { DropdownData } from "../widgets/Dropdown";
import { handleBars, I18nContext, translate, translateRegionName } from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";
import { LapModeRadio } from "../widgets/LapModeSelect";
import {
  CountryRanking,
  CountryRankingsTopEnum,
  countryRankingsTopEnumTopToString,
  CountryRankingsTopEnumValues,
  RegionType,
} from "../../rust_api";
import { CategoryRadio } from "../widgets/CategorySelect";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../widgets/Table";
import { useMetadata } from "../../utils/Metadata";

const CountryRankingsPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams, ["hl"]);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false, ["hl"]);
  const { top, setTopNumber } = useTopParam(searchParams, ["hl"]);
  const { regionType, setRegionType } = useRegionTypeParam(searchParams, ["hl"]);

  const metadata = useMetadata();
  const { settings } = useContext(SettingsContext);
  const { lang } = useContext(I18nContext);

  const highlight = useRowHighlightParam(searchParams).highlight;
  const { isLoading, data } = useApi(
    () => CountryRanking.getChart(top, regionType, category, lapMode),
    [category, lapMode, top, regionType],
    "countryRankingsTops",
  );

  const tableArray: ArrayTableCellData[][] = [];
  const tableData: ArrayTableData = {
    classNames: [],
    rowKeys: [],
  };
  let hasHighlightRow = false;

  data?.forEach((stats, idx, arr) => {
    const region = metadata.getRegionById(stats.regionId);

    if (
      highlight &&
      arr[idx - 1].value > highlight &&
      (arr[idx - 1] === undefined || arr[idx - 1].value < highlight)
    ) {
      hasHighlightRow = true;
      tableData.highlightedRow = idx;
      tableData.classNames?.push({
        rowIdx: idx,
        className: "highlighted",
      });
      tableData.rowKeys?.push("highlight");
      tableArray.push([
        { content: null },
        { content: translate("genericRankingsYourHighlightedValue", lang) },
        {
          content: highlight,
        },
      ]);
    }

    if (stats.value === highlight) {
      tableData.highlightedRow = idx;
      tableData.classNames?.push({
        rowIdx: idx + (hasHighlightRow ? 1 : 0),
        className: "highlighted",
      });
    }

    tableData.rowKeys?.push(`${region?.code}`);
    tableArray.push([
      { content: stats.rank },
      {
        content: (
          <>
            <FlagIcon showRegFlagRegardless region={region} />
            <span>{translateRegionName(region, lang)}</span>
          </>
        ),
      },
      {
        content: stats.value,
      },
    ]);
  });
  const siteHue = getCategorySiteHue(category, settings);

  let text = "err";
  switch (top) {
    case CountryRankingsTopEnum.Records:
      text = translate("countryRankingsPageExplanationRecords", lang);
      break;
    case CountryRankingsTopEnum.Top3:
      text = translate("countryRankingsPageExplanationTop3", lang);
      break;
    case CountryRankingsTopEnum.Top5:
      text = translate("countryRankingsPageExplanationTop5", lang);
      break;
    case CountryRankingsTopEnum.Top10:
      text = translate("countryRankingsPageExplanationTop10", lang);
      break;
    case CountryRankingsTopEnum.All:
      text = translate("countryRankingsPageExplanationAll", lang);
      break;
  }

  return (
    <>
      <h1>{translate("countryRankingsPageHeading", lang)}</h1>
      <p>
        {handleBars(translate("countryRankingsPageExplanation", lang), [
          ["countryRankingsTopType", text],
        ])}
      </p>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio includeOverall value={lapMode} onChange={setLapMode} />
          <Dropdown
            data={
              {
                type: "Normal",
                defaultItemSet: 0,
                value: top,
                valueSetter: setTopNumber,
                data: [
                  {
                    id: 0,
                    children: CountryRankingsTopEnumValues.map((r) => {
                      return {
                        type: "DropdownItemData",
                        element: { text: countryRankingsTopEnumTopToString(r), value: r },
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
                type: "Normal",
                defaultItemSet: 0,
                value: regionType,
                valueSetter: setRegionType,
                data: [
                  {
                    id: 0,
                    children: [
                      [RegionType.Country, translate("countryRankingsPageDropdownCountries", lang)],
                      [
                        RegionType.Continent,
                        translate("countryRankingsPageDropdownContinents", lang),
                      ],
                      [
                        RegionType.Subnational,
                        translate("countryRankingsPageDropdownSubregions", lang),
                      ],
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
            <ArrayTable
              rows={tableArray}
              headerRows={[
                [
                  { content: translate("countryRankingsPageRank", lang) },
                  { content: translate("countryRankingsPageCountry", lang) },
                  { content: translate("countryRankingsPageAverageFinish", lang) },
                ],
              ]}
              tableData={tableData}
            />
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default CountryRankingsPage;
