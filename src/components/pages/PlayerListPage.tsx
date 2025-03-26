import { useContext, useEffect, useRef } from "react";

import Deferred from "../widgets/Deferred";
import { useApi } from "../../hooks/ApiHook";
import { MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { useState } from "react";
import { I18nContext, translate, translateRegionNameFull } from "../../utils/i18n/i18n";
import PlayerMention from "../widgets/PlayerMention";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../widgets/Table";
import { usePageNumber } from "../../utils/SearchParams";
import { useSearchParams } from "react-router-dom";
import { PaginationButtonRow } from "../widgets/PaginationButtons";
import { PlayerBasic } from "../../rust_api/";

const PlayerListPage = () => {
  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const { user, isLoading: userIsLoading } = useContext(UserContext);
  const searchParams = useSearchParams();
  const { pageNumber, setPageNumber } = usePageNumber(searchParams);

  const [playerFilter, setPlayerFilter] = useState("");

  const translationCache = useRef<Record<number, string>>({});
  useEffect(() => {
    translationCache.current = {};
  }, [lang]);

  const { isLoading, data: players } = useApi(
    () =>
      PlayerBasic.getPlayerList().then(
        (players) =>
          players
            .map((player) => {
              const locationString =
                translationCache.current[player?.regionId ?? 0] ??
                translateRegionNameFull(metadata, lang, player.regionId);
              const nameNormalized = player.name.toLowerCase().normalize("NFKD");
              const sortAlias = player.alias?.toLowerCase().normalize("NFKD") ?? nameNormalized;

              return [
                [
                  {
                    content: (
                      <PlayerMention
                        playerOrId={player}
                        regionOrId={player.regionId ?? undefined}
                        xxFlag
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

  const tableArray =
    players?.reduce(
      (accumulator: ArrayTableCellData[][], [row, filterFunc, isLoggedInUser, rowKey], index) => {
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
    ) ?? [];

  const rowsPerPage = 100;
  const maxPageNumber = Math.ceil(tableArray.length / rowsPerPage);
  tableData.paginationData = {
    rowsPerPage,
    page: pageNumber,
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

      <PaginationButtonRow
        selectedPage={pageNumber}
        setSelectedPage={setPageNumber}
        numberOfPages={maxPageNumber}
      />
      <div className="module player-list table-hover-rows">
        <Deferred isWaiting={isLoading || metadata.isLoading || userIsLoading}>
          <ArrayTable
            headerRows={[
              [
                { content: translate("playerListPageNameCol", lang) },
                { content: translate("playerListPageLocationCol", lang) },
              ],
            ]}
            rows={tableArray}
            tableData={tableData}
          />
        </Deferred>
      </div>

      <PaginationButtonRow
        selectedPage={pageNumber}
        setSelectedPage={setPageNumber}
        numberOfPages={maxPageNumber}
      />
    </>
  );
};

export default PlayerListPage;
