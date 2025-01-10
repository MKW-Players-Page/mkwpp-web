import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api";
import { useApi } from "../../hooks";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { I18nContext, translate } from "../../utils/i18n/i18n";
import { useCategoryParam } from "../../utils/SearchParams";
import Deferred from "../widgets/Deferred";
import OverwriteColor from "../widgets/OverwriteColor";
import { SettingsContext } from "../../utils/Settings";
import PlayerMention from "../widgets/PlayerMention";
import { CategoryRadio } from "../widgets/CategorySelect";
import ArrayTable from "../widgets/Table";

const PastChampsPage = () => {
  const { lang } = useContext(I18nContext);
  const { settings } = useContext(SettingsContext);
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const siteHue = getCategorySiteHue(category, settings);
  const { isLoading, data: champs } = useApi(
    () =>
      api.timetrialsChampionsList({
        category,
      }),
    [category],
    "pastChamps",
  );

  const totalDuration = +new Date() / 1000 - 1208390400;

  return (
    <>
      <h1>{translate("pastChampsPageHeading", lang)}</h1>
      <OverwriteColor hue={siteHue}>
        <CategoryRadio value={category} onChange={setCategory} />
        <Deferred isWaiting={isLoading}>
          <div className="module table-hover-rows">
            <ArrayTable
              headerRows={[
                [
                  { content: translate("pastChampsPagePlayerCol", lang) },
                  { content: translate("pastChampsPageStartDateCol", lang) },
                  {
                    content: translate("pastChampsPageEndDateCol", lang),
                    className: "past-champs-s1",
                  },
                  { content: translate("pastChampsPageDurationCol", lang) },
                  { content: translate("pastChampsPagePercentCol", lang) },
                ],
              ]}
              rows={
                champs?.map((champ, idx, arr) => {
                  const nextExists = arr[idx + 1] !== undefined;
                  const duration = nextExists
                    ? arr[idx + 1].dateInstated - champ.dateInstated
                    : Math.floor(+new Date() / 1000) - champ.dateInstated;
                  const durationDays = duration / 86400;
                  const durationPerc = (duration / totalDuration) * 100;
                  return [
                    {
                      content: (
                        <PlayerMention
                          precalcPlayer={champ.player}
                          precalcRegionId={champ.player.region ?? undefined}
                          xxFlag={true}
                        />
                      ),
                    },
                    {
                      content: new Date(champ.dateInstated * 1000).toLocaleDateString(lang),
                    },
                    {
                      content: nextExists
                        ? new Date(arr[idx + 1].dateInstated * 1000).toLocaleDateString(lang)
                        : translate("pastChampsPageOngoing", lang),
                      className: "past-champs-s1",
                    },
                    {
                      content:
                        durationDays < 1
                          ? translate("pastChampsPageLessThan1Day", lang)
                          : `${Math.floor(durationDays)} ${Math.floor(durationDays) === 1 ? translate("pastChampsPageDaySingular", lang) : translate("pastChampsPageDayPlural", lang)}`,
                    },
                    {
                      content:
                        (durationPerc < 10
                          ? "0" + durationPerc.toFixed(5)
                          : durationPerc.toFixed(5)) + "%",
                    },
                  ];
                }) ?? [[]]
              }
            />
          </div>
        </Deferred>
      </OverwriteColor>
    </>
  );
};

export default PastChampsPage;
