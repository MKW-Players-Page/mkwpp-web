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
import { useSearchParams } from "react-router";
import { PaginationButtonRow } from "../widgets/PaginationButtons";
import { PlayerBasic } from "../../api";
import SearchBar from "../widgets/SearchBar";

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

  const { isLoading, data } = useApi(
    () =>
      PlayerBasic.getPlayerList().then((players) =>
        players
          .map((player) => {
            const nameNormalized = player.name.toLowerCase().normalize("NFKD");
            return {
              player,
              nameNormalized,
              aliasNormalized: player.alias?.toLowerCase().normalize("NFKD") ?? nameNormalized,
            };
          })
          .sort(({ aliasNormalized: aliasNormalized1 }, { aliasNormalized: aliasNormalized2 }) => {
            const sortAlias1 = aliasNormalized1;
            const sortAlias2 = aliasNormalized2;
            return sortAlias1 > sortAlias2 ? 1 : 0;
          })
          .reduce(
            (accumulator, { player, nameNormalized, aliasNormalized }, index) => {
              const locationString =
                translationCache.current[player?.regionId ?? 0] ??
                translateRegionNameFull(metadata, lang, player.regionId, true);

              accumulator.keys.push(player.id.toString());

              if (player.id === user?.playerId) accumulator.loggedInUserIndex = index;
              accumulator.tableArray.push([
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
              ]);

              accumulator.filterStrings.push(
                nameNormalized + aliasNormalized + locationString.toLowerCase().normalize("NFKD"),
              );

              return accumulator;
            },
            {
              tableArray: [] as ArrayTableCellData[][],
              filterStrings: [] as string[],
              keys: [] as string[],
              loggedInUserIndex: -1,
            },
          ),
      ),
    [metadata.isLoading, lang, userIsLoading],
    "playerList",
  );

  const rowsPerPage = 100;
  const [maxPageNumber, setMaxPageNumber] = useState(
    Math.ceil((data?.tableArray ?? []).length / rowsPerPage),
  );

  const tableData: ArrayTableData = {
    classNames: [],
    rowKeys: [],
    filterData: {
      currentString: playerFilter,
      rowStrings: data?.filterStrings ?? [],
    },
    paginationData: {
      rowsPerPage,
      page: pageNumber,
      setMaxPageNumber,
    },
  };

  return (
    <>
      <h1>{translate("playerListPageHeading", lang)}</h1>
      <SearchBar setFilterString={setPlayerFilter} onChange />

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
            rows={data?.tableArray ?? []}
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
