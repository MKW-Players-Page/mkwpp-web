import { useContext, useEffect, useRef } from "react";

import Deferred from "../widgets/Deferred";
import api from "../../api";
import { useApi } from "../../hooks/ApiHook";
import { MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { useState } from "react";
import { I18nContext, translate, translateRegionNameFull } from "../../utils/i18n/i18n";
import PlayerMention from "../widgets/PlayerMention";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../widgets/Table";

const PlayerListPage = () => {
  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const { user, isLoading: userIsLoading } = useContext(UserContext);

  const [playerFilter, setPlayerFilter] = useState("");

  const translationCache = useRef<Record<number, string>>({});
  useEffect(() => {
    translationCache.current = {};
  }, [lang]);

  const { isLoading, data: players } = useApi(
    () =>
      api.timetrialsPlayersList().then(
        (players) =>
          players
            .map((player) => {
              const locationString =
                translationCache.current[player?.region ?? 0] ??
                translateRegionNameFull(metadata, lang, player.region);
              const nameNormalized = player.name.toLowerCase().normalize("NFKD");
              const sortAlias = player.alias?.toLowerCase().normalize("NFKD") ?? nameNormalized;

              return [
                [
                  {
                    content: (
                      <PlayerMention
                        precalcPlayer={player}
                        precalcRegionId={player.region ?? undefined}
                        xxFlag={true}
                      />
                    ),
                  },
                  { content: locationString },
                ],
                (filter: string) =>
                  !(
                    filter === "" ||
                    nameNormalized.includes(filter) ||
                    sortAlias.includes(filter) ||
                    locationString.toLowerCase().normalize("NFKD").includes(filter)
                  ),
                player.id === user?.player,
                sortAlias,
              ];
            })
            .sort((p1, p2) => (p1[3] > p2[3] ? 1 : 0)) as unknown as [
            ArrayTableCellData[],
            (filter: string) => boolean,
            boolean,
            string,
          ][],
      ),
    [metadata.isLoading, lang, userIsLoading],
    "playerList",
  );

  const tableData: ArrayTableData = {
    classNames: [],
    rowKeys: [],
  };

  return (
    <>
      <h1>{translate("playerListPageHeading", lang)}</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "4fr 1fr",
          gridGap: "5px",
        }}
      >
        <input
          id="filterText"
          type="text"
          className="module"
          onKeyDown={(e) => {
            if (e.key === "Enter") document.getElementById("searchBtn")?.click();
          }}
        />
        <button
          style={{
            borderRadius: 0,
          }}
          id="searchBtn"
          className="module"
          onClick={(e) => {
            setPlayerFilter(
              (document.getElementById("filterText") as HTMLInputElement).value
                .toLowerCase()
                .normalize("NFKD"),
            );
          }}
        >
          {translate("playerListPageSearchBtn", lang)}
        </button>
      </div>
      <div className="module player-list table-hover-rows">
        <Deferred isWaiting={isLoading || metadata.isLoading || userIsLoading}>
          <ArrayTable
            headerRows={[
              [
                { content: translate("playerListPageNameCol", lang) },
                { content: translate("playerListPageLocationCol", lang) },
              ],
            ]}
            rows={
              players?.reduce(
                (
                  accumulator: ArrayTableCellData[][],
                  [row, filterFunc, isLoggedInUser, rowKey],
                  index,
                ) => {
                  if (filterFunc(playerFilter)) return accumulator;

                  if (isLoggedInUser)
                    tableData.classNames?.push({
                      className: "highlighted",
                      rowIdx: accumulator.length,
                    });

                  tableData.rowKeys?.push(rowKey);
                  accumulator.push(row);
                  return accumulator;
                },
                [],
              ) ?? []
            }
            tableData={tableData}
          />
        </Deferred>
      </div>
    </>
  );
};

export default PlayerListPage;
