import { useContext } from "react";

import Deferred from "../widgets/Deferred";
import api from "../../api";
import { useApi } from "../../hooks/ApiHook";
import { MetadataContext } from "../../utils/Metadata";
import { UserContext } from "../../utils/User";
import { PlayerBasic } from "../../api";
import { useState } from "react";
import { I18nContext, translate, translateRegionNameFull } from "../../utils/i18n/i18n";
import PlayerMention from "../widgets/PlayerMention";

interface PlayerForFilter extends PlayerBasic {
  simplifiedName: string;
  simplifiedAlias: string;
}

interface PlayerListRowProp {
  player: PlayerForFilter;
  playerFilter: string;
}
const PlayerListRow = ({ player, playerFilter }: PlayerListRowProp) => {
  const metadata = useContext(MetadataContext);
  const { lang } = useContext(I18nContext);
  const { user } = useContext(UserContext);

  return (
    <tr
      style={{
        display:
          playerFilter === "" ||
          (player as PlayerForFilter).simplifiedName.includes(playerFilter) ||
          (player as PlayerForFilter).simplifiedAlias.includes(playerFilter)
            ? ""
            : "none",
      }}
      key={player.id}
      className={user && player.id === user.player ? "highlighted" : ""}
    >
      <td>
        <PlayerMention
          precalcPlayer={player}
          precalcRegionId={player.region ?? undefined}
          xxFlag={true}
        />
      </td>
      <td>{translateRegionNameFull(metadata, lang, player.region)}</td>
    </tr>
  );
};

const PlayerListPage = () => {
  const { isLoading, data: players } = useApi(
    () =>
      api.timetrialsPlayersList().then((arr) =>
        (
          arr.map((r) => {
            (r as PlayerForFilter).simplifiedName = r.name.toLowerCase().normalize("NFKD");
            (r as PlayerForFilter).simplifiedAlias = (r.alias ?? r.name)
              .toLowerCase()
              .normalize("NFKD");
            return r;
          }) as PlayerForFilter[]
        ).sort((a, b) => (a.simplifiedAlias > b.simplifiedAlias ? 1 : -1)),
      ),
    [],
    "playerList",
  );
  const { lang } = useContext(I18nContext);

  const [playerFilter, setPlayerFilter] = useState("");

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
      <div className="module">
        <Deferred isWaiting={isLoading}>
          <table>
            <thead>
              <tr>
                <th>{translate("playerListPageNameCol", lang)}</th>
                <th>{translate("playerListPageLocationCol", lang)}</th>
              </tr>
            </thead>
            <tbody className="table-hover-rows">
              {players?.map((player) => (
                <PlayerListRow player={player} playerFilter={playerFilter} />
              ))}
            </tbody>
          </table>
        </Deferred>
      </div>
    </>
  );
};

export default PlayerListPage;
