import { useContext } from "react";

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
  const { isLoading, data: players } = useApi(() => api.timetrialsPlayersList(), [], "playerList");
  const { lang } = useContext(I18nContext);
  const metadata = useContext(MetadataContext);
  const { user } = useContext(UserContext);

  const [playerFilter, setPlayerFilter] = useState("");
  const tableData: ArrayTableData = {
    infiniteScrollData: { extraDependencies: [isLoading], padding: 35 },
    classNames: [],
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
      <div className="module player-list">
        <Deferred isWaiting={isLoading}>
          <ArrayTable
            headerRows={[
              [
                { content: translate("playerListPageNameCol", lang) },
                { content: translate("playerListPageLocationCol", lang) },
              ],
            ]}
            rows={
              players
                ?.sort((p1, p2) => ((p1.alias ?? p1.name) > (p2.alias ?? p2.name) ? 1 : 0))
                .reduce((accumulator: ArrayTableCellData[][], player, index) => {
                  const regionNameFull = translateRegionNameFull(metadata, lang, player.region);

                  if (
                    !(
                      playerFilter === "" ||
                      player.name.toLowerCase().normalize("NFKD").includes(playerFilter) ||
                      (player.alias &&
                        player.alias.toLowerCase().normalize("NFKD").includes(playerFilter)) ||
                      regionNameFull.toLowerCase().normalize("NFKD").includes(playerFilter)
                    )
                  )
                    return accumulator;

                  if (user && player.id === user.player)
                    tableData.classNames?.push({
                      className: "highlighted",
                      rowIdx: accumulator.length,
                    });

                  accumulator.push([
                    {
                      content: (
                        <PlayerMention
                          precalcPlayer={player}
                          precalcRegionId={player.region ?? undefined}
                          xxFlag={true}
                        />
                      ),
                    },
                    { content: regionNameFull },
                  ]);

                  return accumulator;
                }, []) ?? []
            }
            tableData={tableData}
          />
        </Deferred>
      </div>
    </>
  );
};

export default PlayerListPage;
