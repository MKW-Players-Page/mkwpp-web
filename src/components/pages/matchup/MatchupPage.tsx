import { useContext, useLayoutEffect, useRef, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { I18nContext, translate } from "../../../utils/i18n/i18n";
import { SettingsContext } from "../../../utils/Settings";
import { MetadataContext } from "../../../utils/Metadata";
import OverwriteColor from "../../widgets/OverwriteColor";
import { getCategorySiteHue } from "../../../utils/EnumUtils";
import { CategoryEnum, LapModeEnum } from "../../../api";
import { LapModeRadio } from "../../widgets/LapModeSelect";
import PlayerMention from "../../widgets/PlayerMention";
import { Pages, resolvePage } from "../Pages";
import Deferred from "../../widgets/Deferred";
import { useCategoryParam, useIdsParam, useLapModeParam } from "../../../utils/SearchParams";
import { useApi } from "../../../hooks/ApiHook";
import { formatTime, formatTimeDiff } from "../../../utils/Formatters";
import { CategoryRadio } from "../../widgets/CategorySelect";
import RadioButtons from "../../widgets/RadioButtons";
import ArrayTable, { ArrayTableCellData } from "../../widgets/Table";
import { SmallBigTrackFormat } from "../../widgets/SmallBigFormat";
import { MatchupData } from "../../../api/endpoints/playerTimesheet";

const MatchupPage = () => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false);
  const [differenceMode, setDifferenceMode] = useState(false);
  const ids = useIdsParam(searchParams).ids;

  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const { settings } = useContext(SettingsContext);

  const { isLoading: matchupDataIsLoading, data: matchupData } = useApi(
    () => MatchupData.get(ids, category, lapMode),
    [category, lapMode],
    "playerData",
    [],
    false,
  );

  const isTwoPlayers = matchupData?.playerData.length === 2;
  const siteHue = getCategorySiteHue(category, settings);

  const tableModule = useRef<HTMLDivElement | null>(null);
  const [layoutTypeBig, setLayoutTypeBig] = useState(true);
  const [layoutSwitchWidth, setLayoutSwitchWidth] = useState(0);
  useLayoutEffect(() => {
    if (tableModule.current === null) return;
    const element = tableModule.current;
    const updateSize = () => {
      const scrollDiff = element.scrollWidth - element.clientWidth;
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
    ids,
  ]);

  const headerRows: ArrayTableCellData[][] = [
    [{ content: null }],
    [{ content: translate("matchupPageTrackCol", lang), lockedCell: true }],
  ];

  const tmpAllTrackIds: Set<number> = new Set();
  for (const data of matchupData?.playerData ?? [])
    for (const score of data.times) {
      if (lapMode !== LapModeEnum.Overall && score.isLap !== (LapModeEnum.Lap === lapMode))
        continue;
      tmpAllTrackIds.add(score.trackId * 2 + Number(score.isLap));
    }
  const allTrackIds = Array.from(tmpAllTrackIds).sort((a, b) => a - b);

  const rows: ArrayTableCellData[][] = [];

  const footerRows: ArrayTableCellData[][] = [
    [{ content: translate("matchupPageTotalRow", lang), lockedCell: true }],
    [{ content: translate("matchupPageAFRow", lang), lockedCell: true }],
    [{ content: translate("matchupPageARRRow", lang), lockedCell: true }],
    [{ content: translate("matchupPagePRWRRow", lang), lockedCell: true }],
    [{ content: translate("matchupPageTallyRow", lang), lockedCell: true }],
  ];

  for (let idx = 0; idx < (matchupData?.playerData.length ?? 0); idx++) {
    if (matchupDataIsLoading) break;
    if (matchupData === undefined) break;

    headerRows[0].push({ content: <PlayerMention playerOrId={ids[idx]} /> });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall) {
      headerRows[0].push({ content: null, expandCell: [false, true] });
      headerRows[1].push(
        { content: translate("matchupPageCourseCol", lang) },
        { content: translate("matchupPageLapCol", lang) },
      );
    } else {
      headerRows[1].push({ content: translate("matchupPageTimeCol", lang) });
    }
    if (!isTwoPlayers || idx === 0) {
      headerRows[0].push({ content: null, expandCell: [false, true] });
      headerRows[1].push({ content: translate("matchupPageDiffCol", lang) });
    }

    for (let rowIdx = 0; rowIdx < allTrackIds.length; rowIdx++) {
      const trackId = allTrackIds[rowIdx] >>> 1;
      const isLap = allTrackIds[rowIdx] % 2 === 1;
      const track = metadata.getTrackById(trackId);

      if ((lapMode === LapModeEnum.Lap && !isLap) || (lapMode === LapModeEnum.Course && isLap))
        continue;
      if (idx === 0) {
        rows.push([]);
        rows[rowIdx].push({
          content: (
            <Link
              to={resolvePage(
                Pages.TrackChart,
                { id: trackId },
                {
                  cat: category !== CategoryEnum.NonShortcut ? category : null,
                  lap: lapMode !== LapModeEnum.Overall ? lapMode : null,
                },
              )}
            >
              <SmallBigTrackFormat
                track={track}
                smallClass="matchup-columns-s1"
                bigClass="matchup-columns-b1"
              />
            </Link>
          ),
          lockedCell: true,
          expandCell: [lapMode === LapModeEnum.Overall && isLap, false],
        });
      }

      const score = matchupData.playerData[idx].times.find(
        (score) => score.trackId === trackId && score.isLap === isLap,
      );
      const isFirst = matchupData.diffFirst[idx][rowIdx] === 0;

      rows[rowIdx].push({
        content:
          layoutTypeBig && isLap && lapMode !== LapModeEnum.Lap
            ? null
            : score
              ? formatTime(score.value)
              : "-",
        className: score !== undefined && score.category !== category ? "fallthrough" : "",
        style: {
          fontWeight: isFirst ? "bold" : "",
        },
      });
      if (layoutTypeBig && lapMode === LapModeEnum.Overall)
        rows[rowIdx].push({
          content: isLap ? (score ? formatTime(score.value) : "-") : null,
          className: score !== undefined && score.category !== category ? "fallthrough" : "",
          style: {
            fontWeight: isFirst ? "bold" : "",
          },
        });

      if (idx === 1 && isTwoPlayers) continue;
      rows[rowIdx].push({
        content: score
          ? formatTimeDiff(
              isTwoPlayers
                ? isFirst
                  ? -(matchupData.diffFirst[1][rowIdx] ?? 0)
                  : (matchupData.diffFirst[0][rowIdx] ?? 0)
                : differenceMode
                  ? (matchupData.diffNext[idx][rowIdx] ?? 0)
                  : (matchupData.diffFirst[idx][rowIdx] ?? 0),
            )
          : "-",
        style: {
          color: isTwoPlayers
            ? isFirst
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${matchupData.rgbDiff[idx][rowIdx]},${matchupData.rgbDiff[idx][rowIdx]})`,
        },
      });
    }

    footerRows[0].push({
      content: formatTime(matchupData.playerData[idx].totalTime),
      style: {
        textDecoration: matchupData.diffTotalTimeFirst[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[0].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0)
      footerRows[0].push({
        content: formatTimeDiff(
          isTwoPlayers
            ? matchupData.diffTotalTimeFirst[idx] === 0
              ? -matchupData.diffTotalTimeFirst[1]
              : matchupData.diffTotalTimeFirst[0]
            : differenceMode
              ? matchupData.diffTotalTimeNext[idx]
              : matchupData.diffTotalTimeFirst[idx],
        ),
        style: {
          color: isTwoPlayers
            ? matchupData.diffTotalTimeFirst[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${matchupData.rgbDiffTotalTime[idx]},${matchupData.rgbDiffTotalTime[idx]})`,
        },
      });

    footerRows[1].push({
      content: matchupData.playerData[idx].af,
      style: {
        textDecoration: matchupData.diffAfFirst[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[1].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0) {
      const content = isTwoPlayers
        ? matchupData.diffAfFirst[idx] === 0
          ? -matchupData.diffAfFirst[1]
          : matchupData.diffAfFirst[0]
        : differenceMode
          ? matchupData.diffAfNext[idx]
          : matchupData.diffAfFirst[idx];
      footerRows[1].push({
        content: content > 0 ? "+" + content : content,

        style: {
          color: isTwoPlayers
            ? matchupData.diffAfFirst[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${matchupData.rgbDiffAf[idx]},${matchupData.rgbDiffAf[idx]})`,
        },
      });
    }

    footerRows[2].push({
      content: matchupData.playerData[idx].arr,
      style: {
        textDecoration: matchupData.diffArrFirst[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[2].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0) {
      const content = isTwoPlayers
        ? matchupData.diffArrFirst[idx] === 0
          ? -matchupData.diffArrFirst[1]
          : matchupData.diffArrFirst[0]
        : differenceMode
          ? matchupData.diffArrNext[idx]
          : matchupData.diffArrFirst[idx];
      footerRows[2].push({
        content: content > 0 ? "+" + content : content,

        style: {
          color: isTwoPlayers
            ? matchupData.diffArrFirst[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${matchupData.rgbDiffArr[idx]},${matchupData.rgbDiffArr[idx]})`,
        },
      });
    }

    footerRows[3].push({
      content: (matchupData.playerData[idx].prwr * 100).toFixed(4) + "%",
      style: {
        textDecoration: matchupData.diffPrwrFirst[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[3].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0) {
      const content =
        (isTwoPlayers
          ? matchupData.diffPrwrFirst[idx] === 0
            ? matchupData.diffPrwrFirst[1]
            : -matchupData.diffPrwrFirst[0]
          : differenceMode
            ? matchupData.diffPrwrNext[idx]
            : matchupData.diffPrwrFirst[idx]) * 100;
      footerRows[3].push({
        content: (content > 0 ? "+" + content.toFixed(4) : content.toFixed(4)) + "%",

        style: {
          color: isTwoPlayers
            ? matchupData.diffPrwrFirst[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${matchupData.rgbDiffPrwr[idx]},${matchupData.rgbDiffPrwr[idx]})`,
        },
      });
    }

    footerRows[4].push({
      content:
        matchupData.wins[idx] +
        " " +
        translate(
          matchupData.wins[idx] === 1
            ? "matchupPageTallyRowWinsSingular"
            : "matchupPageTallyRowWinsPlural",
          lang,
        ),
      style: {
        textDecoration: matchupData.diffWinsFirst[idx] === 0 ? "underline" : "",
      },
    });
    if (layoutTypeBig && lapMode === LapModeEnum.Overall)
      footerRows[4].push({ content: null, expandCell: [false, true] });
    if (!isTwoPlayers || idx === 0) {
      const content = isTwoPlayers
        ? matchupData.diffWinsFirst[idx] === 0
          ? -matchupData.diffWinsFirst[1]
          : matchupData.diffWinsFirst[0]
        : differenceMode
          ? matchupData.diffWinsNext[idx]
          : matchupData.diffWinsFirst[idx];
      footerRows[4].push({
        content: content > 0 ? "+" + content : content,

        style: {
          color: isTwoPlayers
            ? matchupData.diffWinsFirst[idx] === 0
              ? `rgb(100,255,100)`
              : `rgb(255,100,100)`
            : `rgb(255,${matchupData.rgbDiffWins[idx]},${matchupData.rgbDiffWins[idx]})`,
        },
      });
    }
  }

  return (
    <>
      {/* Redirect if any id is invalid or API fetch failed */}
      {ids.length < 2 && <Navigate to={resolvePage(Pages.MatchupHome)} />}
      <Link to={resolvePage(Pages.MatchupHome)}>{translate("genericBackButton", lang)}</Link>
      <h1>{translate("matchupPageHeading", lang)}</h1>
      <OverwriteColor hue={siteHue}>
        <div className="module-row wrap">
          <CategoryRadio value={category} onChange={setCategory} />
          <LapModeRadio includeOverall value={lapMode} onChange={setLapMode} />
        </div>
        {isTwoPlayers ? (
          <></>
        ) : (
          <div className="module-row wrap">
            <RadioButtons
              state={differenceMode}
              setState={setDifferenceMode}
              data={[
                {
                  text: translate("matchupPageDiffColToFirst", lang),
                  value: false,
                },
                {
                  text: translate("matchupPageDiffColToNext", lang),
                  value: true,
                },
              ]}
            />
          </div>
        )}
        <Deferred isWaiting={metadata.isLoading || matchupDataIsLoading}>
          <div className="module" ref={tableModule}>
            <ArrayTable headerRows={headerRows} rows={rows} footerRows={footerRows} />
          </div>
        </Deferred>
      </OverwriteColor>
    </>
  );
};

export default MatchupPage;
