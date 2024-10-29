import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import Deferred from "../global/Deferred";
import { CategorySelect, FlagIcon, LapModeSelect } from "../widgets";
import api from "../../api";
import { useApi } from "../../hooks";
import { getCategorySiteHue } from "../../utils/EnumUtils";
import OverwriteColor from "../widgets/OverwriteColor";
import {
  useCategoryParam,
  useLapModeParam,
  useRowHighlightParam,
} from "../../utils/SearchParams";

const CountryRankingsPage = (
    
) => {
  const searchParams = useSearchParams();
  const { category, setCategory } = useCategoryParam(searchParams, ["hl"]);
  const { lapMode, setLapMode } = useLapModeParam(searchParams, false, ["hl"]);
  const highlight = useRowHighlightParam(searchParams).highlight;

    const top = 3;
  
  const { isLoading, data } = useApi(
    () =>
      api.timetrialsRegionsRankingsList({
        category,
        lapMode,
        top,
        type: "continent"
      }),
    [category, lapMode],
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

  return (
    <>
      <h1>Country Rankings</h1>
      <p>The best {top} times for each country are taken for each track, and averaged. This value is then averaged over all tracks, like Average Finish.</p>
      <OverwriteColor hue={siteHue}>
        <div className="module-row">
          <CategorySelect value={category} onChange={setCategory} />
          <LapModeSelect includeOverall value={lapMode} onChange={setLapMode} />
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
                                  const calculatedValueStr = (stats.totalRank / stats.scoreCount).toFixed(4); const calculatedValue = parseFloat(calculatedValueStr); return (
                  <>
                    {highlight &&
                    (calculatedValue > highlight &&
                        (arr[idx - 1] === undefined ||
                          (arr[idx - 1].totalRank / arr[idx - 1].scoreCount)< highlight)) ? (
                      <>
                        <tr ref={highlightElement} key={highlight} className="highlighted">
                          <td />
                          <td>Your Highlighted Value</td>
                          <td>
                            {highlight}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}
                    <tr
                      key={stats.region.code}
                      className={
                        calculatedValue === highlight
                          ? "highlighted"
                          : ""
                      }
                      ref={
                        calculatedValue === highlight ? highlightElement : undefined
                      }
                    >
                      <td>{stats.rank}</td>
                      <td>
                        <FlagIcon region={stats.region} />
                        <p
                        >
                          {stats.region.name}
                        </p>
                      </td>
                      <td>{calculatedValueStr}</td>
                    </tr>
                  </>
                )})}
              </tbody>
            </table>
          </Deferred>
        </div>
      </OverwriteColor>
    </>
  );
};

export default CountryRankingsPage;
