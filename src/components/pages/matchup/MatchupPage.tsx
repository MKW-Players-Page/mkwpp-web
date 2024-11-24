import { useContext, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { I18nContext } from "../../../utils/i18n/i18n";
import { SettingsContext } from "../../../utils/Settings";
import { MetadataContext } from "../../../utils/Metadata";
import { CategorySelect } from "../../widgets";
import OverwriteColor from "../../widgets/OverwriteColor";
import { getCategorySiteHue, getTrackById } from "../../../utils/EnumUtils";
import LapModeSelect, { LapModeEnum } from "../../widgets/LapModeSelect";
import PlayerMention from "../../widgets/PlayerMention";
import { getPlayerData, getPlayerDataParams } from "../../../utils/MatchupDataCrunch";
import { Pages, resolvePage } from "../Pages";
import Deferred from "../../widgets/Deferred";
import { useCategoryParam, useIdsParam, useLapModeParam } from "../../../utils/SearchParams";
import { useApiArray } from "../../../hooks/ApiHook";
import { CategoryEnum } from "../../../api";
import { formatTime } from "../../../utils/Formatters";
import Dropdown, { DropdownData, DropdownItemSetDataChild } from "../../widgets/Dropdown";

const MatchupPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false);
  const [differenceMode, setDifferenceMode] = useState(false);
  const ids = useIdsParam(searchParams).ids;

  const { translations, lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);

  const matchupData = useApiArray(
    (params: getPlayerDataParams) => getPlayerData(params),
    ids.length,
    ids.map((id) => {
      return {
        id,
        category,
        lapMode,
      };
    }),
    [category, lapMode],
    "playerData",
    [],
    false,
  );

  const matchupDataIsLoading = matchupData.map((r) => r.isLoading).includes(true);
  const siteHue = getCategorySiteHue(category, settings);

  const tableModule = useRef<HTMLDivElement | null>(null);
  const [layoutTypeBig, setLayoutTypeBig] = useState(true);
  const [layoutSwitchWidth, setLayoutSwitchWidth] = useState(0);
  useLayoutEffect(() => {
    if (tableModule.current === null) return;
    const element = tableModule.current;
    const updateSize = () => {
      const scrollDiff = element.scrollWidth - element.clientWidth;
      console.log(element);
      if (layoutTypeBig && scrollDiff > 0) {
        setLayoutTypeBig(false);
        setLayoutSwitchWidth(element.clientWidth);
      } else if (
        !layoutTypeBig &&
        scrollDiff === 0 &&
        element.clientWidth > layoutSwitchWidth + 50
      ) {
        setLayoutTypeBig(true);
        setLayoutSwitchWidth(0);
      }
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, [
    tableModule,
    matchupDataIsLoading,
    setLayoutTypeBig,
    setLayoutSwitchWidth,
    layoutSwitchWidth,
    layoutTypeBig,
  ]);

  return (
    <>
      {/* Redirect if any id is invalid or API fetch failed */}
      {ids.length < 2 && <Navigate to={resolvePage(Pages.MatchupHome)} />}
      <Link to={resolvePage(Pages.MatchupHome)}>&lt; Back</Link>
      <h1>{translations.matchupPageHeading[lang]}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
          <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
        </div>
        <div className="module-row">
          <Dropdown
            data={
              {
                type: "Normal",
                value: differenceMode,
                valueSetter: setDifferenceMode,
                defaultItemSet: 0,
                data: [
                  {
                    id: 0,
                    children: [
                      {
                        type: "DropdownItemData",
                        element: {
                          text: translations.matchupPageDiffColToFirst[lang],
                          value: false,
                        },
                      } as DropdownItemSetDataChild,
                      {
                        type: "DropdownItemData",
                        element: {
                          text: translations.matchupPageDiffColToNext[lang],
                          value: true,
                        },
                      } as DropdownItemSetDataChild,
                    ],
                  },
                ],
              } as DropdownData
            }
          />
        </div>
        <Deferred isWaiting={metadata.isLoading || matchupDataIsLoading}>
          <div className="module" ref={tableModule} style={{ overflowX: "scroll" }}>
            <table style={{ whiteSpace: "nowrap" }}>
              <thead>
                <tr>
                  <>
                    <th />
                    {matchupData.map((playerData, idx, arr) => (
                      <>
                        {layoutTypeBig ? (
                          <th colSpan={2}>
                            <PlayerMention precalcPlayer={playerData.data?.playerData} />
                          </th>
                        ) : (
                          <th>
                            <PlayerMention precalcPlayer={playerData.data?.playerData} />
                          </th>
                        )}
                        {arr.length === 2 && idx === 1 ? <></> : <th />}
                      </>
                    ))}
                  </>
                </tr>
                <tr>
                  <th>{translations.matchupPageTrackCol[lang]}</th>
                  {matchupData.map((playerData, idx, arr) => (
                    <>
                      {layoutTypeBig ? (
                        <>
                          <th>{translations.matchupPageCourseCol[lang]}</th>
                          <th>{translations.matchupPageLapCol[lang]}</th>
                          {arr.length === 2 && idx === 1 ? (
                            <></>
                          ) : (
                            <th>{translations.matchupPageDiffCol[lang]}</th>
                          )}
                        </>
                      ) : (
                        <>
                          <th>{translations.matchupPageTimeCol[lang]}</th>
                          {arr.length === 2 && idx === 1 ? (
                            <></>
                          ) : (
                            <th>{translations.matchupPageDiffCol[lang]}</th>
                          )}
                        </>
                      )}
                    </>
                  ))}
                </tr>
              </thead>
              <tbody className="table-hover-rows">
                {(
                  Array.from(
                    new Set(
                      matchupData
                        .map((data) =>
                          data.data?.scoreData.map(
                            (scoreData) =>
                              (scoreData.track << 1) ^ ((scoreData.isLap ?? false) ? 0 : 1),
                          ),
                        )
                        .flat(),
                    ),
                  ) as number[]
                )
                  .sort((a, b) => a - b)
                  .map((id) => {
                    const trackId = id >> 1;
                    const isFlap = id % 2 === 1;

                    if (layoutTypeBig && !isFlap) {
                      return (
                        <tr>
                          <td rowSpan={2}>
                            <Link
                              to={resolvePage(
                                Pages.TrackChart,
                                { id: trackId },
                                {
                                  cat: category !== CategoryEnum.NonShortcut ? category : null,
                                  lap: lapMode === LapModeEnum.Lap ? lapMode : null,
                                },
                              )}
                            >
                              {getTrackById(metadata.tracks, trackId)?.name}
                            </Link>
                          </td>
                          {matchupData.map((data, idx, arr) => {
                            const score = data.data?.scoreData.find(
                              (score) => score.isLap === false && score.track === trackId,
                            );
                            if (score === undefined)
                              return (
                                <>
                                  <td colSpan={2}>-</td>
                                  {arr.length === 2 && idx === 1 ? <></> : <td>-</td>}
                                </>
                              );
                            return (
                              <>
                                <td colSpan={2}>{formatTime(score.value)}</td>
                                {arr.length === 2 && idx === 1 ? <></> : <td>-</td>}
                              </>
                            );
                          })}
                        </tr>
                      );
                    } else if (layoutTypeBig && isFlap) {
                      return (
                        <tr>
                          {matchupData.map((data, idx, arr) => {
                            const score = data.data?.scoreData.find(
                              (score) => score.isLap === true && score.track === trackId,
                            );
                            if (score === undefined)
                              return (
                                <>
                                  <td />
                                  <td>-</td>
                                  {arr.length === 2 && idx === 1 ? <></> : <td>-</td>}
                                </>
                              );
                            return (
                              <>
                                <td />
                                <td>{formatTime(score.value)}</td>
                                {arr.length === 2 && idx === 1 ? <></> : <td>-</td>}
                              </>
                            );
                          })}
                        </tr>
                      );
                    }
                    return (
                      <tr>
                        <td>
                          <Link
                            to={resolvePage(
                              Pages.TrackChart,
                              { id: trackId },
                              {
                                cat: category !== CategoryEnum.NonShortcut ? category : null,
                                lap: isFlap ? LapModeEnum.Lap : null,
                              },
                            )}
                          >
                            {`${getTrackById(metadata.tracks, trackId)?.name} - ${isFlap ? translations.constantLapModeLap[lang] : translations.constantLapModeCourse[lang]}`}
                          </Link>
                        </td>
                        {matchupData.map((data, idx, arr) => {
                          const score = data.data?.scoreData.find(
                            (score) => score.isLap === isFlap && score.track === trackId,
                          );
                          if (score === undefined)
                            return (
                              <>
                                <td>-</td>
                                {arr.length === 2 && idx === 1 ? <></> : <td>-</td>}
                              </>
                            );
                          return (
                            <>
                              <td>{formatTime(score.value)}</td>
                              {arr.length === 2 && idx === 1 ? <></> : <td>-</td>}
                            </>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot></tfoot>
            </table>
          </div>
        </Deferred>
      </OverwriteColor>
    </>
  );
};

export default MatchupPage;
