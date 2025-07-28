import { useContext, useState } from "react";
import { useSearchParams, Navigate, Link } from "react-router";
import { AdminScore, LapModeEnum, Player, User } from "../../../../api";
import { useApi } from "../../../../hooks";
import { usePageNumber } from "../../../../utils/SearchParams";
import Deferred from "../../../widgets/Deferred";
import { PaginationButtonRow } from "../../../widgets/PaginationButtons";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../../../widgets/Table";
import { Pages, resolvePage } from "../../Pages";
import { Language, translateCategoryName, translateLapModeName } from "../../../../utils/i18n/i18n";
import { MetadataContext } from "../../../../utils/Metadata";
import ObscuredModule from "../../../widgets/ObscuredModule";
import SearchBar from "../../../widgets/SearchBar";
import AdminScoreModule from "./AdminScoresModule";
import { formatTime } from "../../../../utils/Formatters";
import PlayerMention from "../../../widgets/PlayerMention";
import { TrackDropdown } from "../../../widgets/TrackSelect";

export interface AdminScoreUpdateButtonProps {
  score: AdminScore;
}

const AdminScoreUpdateButton = ({ score }: AdminScoreUpdateButtonProps) => {
  const [visibleObscured, setVisibleObscured] = useState(false);
  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          setVisibleObscured(true);
        }}
      >
        {score.id}
      </span>
      <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
        <AdminScoreModule score={score} />
      </ObscuredModule>
    </>
  );
};

const AdminScoresListPage = () => {
  const { isLoading: adminIsLoading, data: isAdmin } = useApi(() => User.isAdmin(), [], "isAdmin");
  const searchParams = useSearchParams();
  const { pageNumber, setPageNumber } = usePageNumber(searchParams);
  const metadata = useContext(MetadataContext);

  const [trackId, setTrackId] = useState(1);

  const [textFilter, setTextFilter] = useState("");
  const [visibleObscured, setVisibleObscured] = useState(false);

  const { isLoading, data } = useApi(
    () =>
      AdminScore.getList(trackId).then(async (scores) => {
        if (scores === null) return undefined;
        await Player.getPlayersBasic(
          scores.map((score) => score.playerId),
          metadata,
        );
        return scores
          .sort((a, b) => a.id - b.id)
          .reduce(
            async (accumulatorPromise, score) => {
              const player = await Player.getPlayerBasic(score.playerId, metadata);
              const accumulator = await accumulatorPromise;
              if (player === undefined) {
                console.error("Somehow the player does not exist despite having scores!");
                return accumulator;
              }
              const timeFormatted = formatTime(score.value);
              const categoryName = translateCategoryName(score.category, Language.English);
              const lapModeName = translateLapModeName(
                score.isLap ? LapModeEnum.Lap : LapModeEnum.Course,
                Language.English,
              );

              accumulator.tableArray.push([
                {
                  content: <AdminScoreUpdateButton score={score} />,
                },
                { content: categoryName },
                { content: lapModeName },
                { content: timeFormatted },
                { content: <PlayerMention playerOrId={player} showRegFlagRegardless xxFlag /> },
              ]);
              accumulator.keys.push(score.id.toString());
              accumulator.filterStrings.push(
                (
                  score.id.toString() +
                  categoryName +
                  score.value +
                  lapModeName +
                  timeFormatted +
                  player.name +
                  (player.alias ?? "")
                )
                  .toLowerCase()
                  .normalize("NFKD"),
              );
              return accumulator;
            },
            Promise.resolve({
              tableArray: [] as ArrayTableCellData[][],
              keys: [] as string[],
              filterStrings: [] as string[],
            }),
          );
      }),
    [metadata, trackId],
    "scoreList",
  );

  const rowsPerPage = 100;
  const [maxPageNumber, setMaxPageNumber] = useState(
    Math.ceil((data?.tableArray ?? []).length / rowsPerPage),
  );

  const tableData: ArrayTableData = {
    classNames: [],
    rowKeys: data?.keys ?? [],
    filterData: {
      currentString: textFilter,
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
      <Link to={resolvePage(Pages.AdminUi)}>« Back</Link>
      <h1>Scores List</h1>
      <SearchBar setFilterString={setTextFilter} />

      <TrackDropdown value={trackId} onChange={setTrackId} />

      <button
        className="module"
        onClick={() => {
          setVisibleObscured(true);
        }}
      >
        New Score
      </button>
      <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
        <AdminScoreModule />
      </ObscuredModule>

      <PaginationButtonRow
        selectedPage={pageNumber}
        setSelectedPage={setPageNumber}
        numberOfPages={maxPageNumber}
      />
      <div className="module table-hover-rows">
        <Deferred isWaiting={isLoading || adminIsLoading}>
          {!isAdmin && <Navigate to={resolvePage(Pages.Home)} />}
          <ArrayTable
            headerRows={[
              [
                { content: "ID" },
                { content: "Category" },
                { content: "Laps" },
                { content: "Time" },
                { content: "Player" },
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

export default AdminScoresListPage;
