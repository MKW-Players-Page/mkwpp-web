import { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { Pages, resolvePage } from "./Pages";
import Deferred from "../widgets/Deferred";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { formatTime } from "../../utils/Formatters";
import { MetadataContext } from "../../utils/Metadata";
import { Standard, StandardLevel } from "../../api";
import { getCategoryNumerical } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "../widgets/Dropdown";
import { useCategoryParam, useStandardLevelIdParam } from "../../utils/SearchParams";
import {
  I18nContext,
  translate,
  translateCategoryName,
  translateTrack,
} from "../../utils/i18n/i18n";
import { SettingsContext } from "../../utils/Settings";
import { CategoryRadio } from "../widgets/CategorySelect";
import ArrayTable, { ArrayTableCellData } from "../widgets/Table";
import { LapModeEnum } from "../widgets/LapModeSelect";

const StandardsPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { levelId, setLevelId } = useStandardLevelIdParam(searchParams);

  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    if (levelId === 0 && !metadata.isLoading) {
      setLevelId(metadata.standards?.at(0)?.id ?? 1);
    }
  }, [levelId, setLevelId, metadata]);

  const level =
    metadata.standards?.find((l) => l.id === levelId) ??
    ({ standards: [] } as unknown as StandardLevel);

  let lastChecked = {} as Standard;
  const filteredStandards: ArrayTableCellData[][] = level?.standards
    .filter((r) => getCategoryNumerical(r.category) <= getCategoryNumerical(category))
    .sort((a, b) => getCategoryNumerical(b.category) - getCategoryNumerical(a.category)) // Sort these in reverse order
    .sort((a, b) => (a.isLap ? 1 : 0) - (b.isLap ? 1 : 0))
    .sort((a, b) => a.track - b.track)
    .filter((r) => {
      if (lastChecked.track !== r.track || lastChecked.isLap !== r.isLap) {
        lastChecked = r;
        return true;
      }
      return false;
    })
    .map((standard) => {
      const track = metadata.tracks?.find((track) => track.id === standard.track);
      const value = formatTime(standard.value ?? 0);
      return [
        {
          content: (
            <Link
              to={resolvePage(
                Pages.TrackChart,
                { id: track?.id },
                { lap: standard.isLap ? LapModeEnum.Lap : null },
              )}
            >
              {translateTrack(track, lang)}
            </Link>
          ),
          expandCell: [standard.isLap, false],
        },
        {
          content: translateCategoryName(standard.category, lang),
          className: "standards-table-b2",
        },
        { content: level.name },
        { content: level.value },
        { content: standard.isLap ? null : value, className: "standards-table-b1" },
        { content: value, expandCell: [false, !standard.isLap], className: "standards-table-b1" },
        { content: value, className: "standards-table-s1" },
      ] as ArrayTableCellData[];
    });

  const siteHue = getCategorySiteHue(category, settings);

  return (
    <>
      <h1>{translate("standardsPageHeading", lang)}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
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
                    children: metadata.standards?.map((l) => {
                      return {
                        type: "DropdownItemData",
                        element: { text: l.name, value: l.id },
                      } as DropdownItemSetDataChild;
                    }) ?? [{ type: "DropdownItemData", element: { text: "God", value: 1 } }],
                  },
                ],
              } as DropdownData
            }
          />
          <CategoryRadio value={category} onChange={setCategory} />
        </div>
        <div className="module">
          <Deferred isWaiting={metadata.isLoading}>
            <ArrayTable
              headerRows={[
                [
                  { content: translate("standardsPageTrackCol", lang) },
                  {
                    content: translate("standardsPageCategoryCol", lang),
                    className: "standards-table-b2",
                  },
                  { content: translate("standardsPageStandardCol", lang) },
                  { content: translate("standardsPagePointsCol", lang) },
                  {
                    content: translate("standardsPageCourseCol", lang),
                    className: "standards-table-b1",
                  },
                  {
                    content: translate("standardsPageLapCol", lang),
                    className: "standards-table-b1",
                  },
                  {
                    content: translate("standardsPageTimeCol", lang),
                    className: "standards-table-s1",
                  },
                ],
              ]}
              rows={filteredStandards}
            />
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default StandardsPage;
