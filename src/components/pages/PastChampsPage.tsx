import { useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api";
import { useApi } from "../../hooks";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import { I18nContext } from "../../utils/i18n/i18n";
import { getRegionById, MetadataContext } from "../../utils/Metadata";
import { useCategoryParam } from "../../utils/SearchParams";
import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon } from "../widgets";
import OverwriteColor from "../widgets/OverwriteColor";
import { Pages, resolvePage } from "./Pages";

const PastChampsPage = () => {
  const { translations, lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const siteHue = getCategorySiteHue(category);
  const { isLoading, data: champs } = useApi(
    () =>
      api.timetrialsChampionsList({
        category,
      }),
    [category],
  );

  const totalDuration = +new Date() / 1000 - 1208390400;

  return (
    <>
      <h1>{translations.pastChampsPageHeading[lang]}</h1>
      <OverwriteColor hue={siteHue}>
        <CategorySelect value={category} onChange={setCategory} />
        <Deferred isWaiting={isLoading}>
          <div className="module">
            <table>
              <thead>
                <th>{translations.pastChampsPagePlayerCol[lang]}</th>
                <th>{translations.pastChampsPageStartDateCol[lang]}</th>
                <th>{translations.pastChampsPageEndDateCol[lang]}</th>
                <th>{translations.pastChampsPageDurationCol[lang]}</th>
                <th>{translations.pastChampsPagePercentCol[lang]}</th>
              </thead>
              <tbody>
                {champs?.map((champ, idx, arr) => {
                  const nextExists = arr[idx + 1] !== undefined;
                  const duration = nextExists
                    ? arr[idx + 1].dateInstated - champ.dateInstated
                    : Math.floor(+new Date() / 1000) - champ.dateInstated;
                  const durationDays = duration / 86400;
                  const durationPerc = (duration / totalDuration) * 100;
                  return (
                    <tr>
                      <td>
                        <FlagIcon region={getRegionById(metadata, champ.player.region ?? 0)} />
                        <Link
                          to={resolvePage(Pages.PlayerProfile, {
                            id: champ.player.id,
                          })}
                        >
                          {champ.player.alias ?? champ.player.name}
                        </Link>
                      </td>
                      <td>{new Date(champ.dateInstated * 1000).toLocaleDateString(lang)}</td>
                      <td>
                        {nextExists
                          ? new Date(arr[idx + 1].dateInstated * 1000).toLocaleDateString(lang)
                          : translations.pastChampsPageOngoing[lang]}
                      </td>
                      <td>
                        {durationDays < 1
                          ? translations.pastChampsPageLessThan1Day[lang]
                          : `${Math.floor(durationDays)} ${Math.floor(durationDays) === 1 ? translations.pastChampsPageDaySingular[lang] : translations.pastChampsPageDayPlural[lang]}`}
                      </td>
                      <td>
                        {durationPerc < 10
                          ? "0" + durationPerc.toFixed(10)
                          : durationPerc.toFixed(10)}
                        %
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Deferred>
      </OverwriteColor>
    </>
  );
};

export default PastChampsPage;
