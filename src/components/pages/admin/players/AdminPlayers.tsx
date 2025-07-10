import { useContext, useState } from "react";
import { useSearchParams, Navigate, Link } from "react-router-dom";
import { AdminPlayer, User } from "../../../../api";
import { useApi } from "../../../../hooks";
import { usePageNumber } from "../../../../utils/SearchParams";
import Deferred from "../../../widgets/Deferred";
import { PaginationButtonRow } from "../../../widgets/PaginationButtons";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../../../widgets/Table";
import { Pages, resolvePage } from "../../Pages";
import { Language, translateRegionNameFull } from "../../../../utils/i18n/i18n";
import { FlagIcon } from "../../../widgets";
import { MetadataContext } from "../../../../utils/Metadata";
import ObscuredModule from "../../../widgets/ObscuredModule";
import SearchBar from "../../../widgets/SearchBar";
import AdminPlayerModule from "./AdminPlayersModule";

export interface AdminPlayerUpdateButtonProps {
  player: AdminPlayer;
}

const AdminPlayerUpdateButton = ({ player }: AdminPlayerUpdateButtonProps) => {
  const [visibleObscured, setVisibleObscured] = useState(false);
  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          setVisibleObscured(true);
        }}
      >
        {player.id}
      </span>
      <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
        <AdminPlayerModule player={player} />
      </ObscuredModule>
    </>
  );
};

const AdminPlayersListPage = () => {
  const { isLoading: adminIsLoading, data: isAdmin } = useApi(() => User.isAdmin(), [], "isAdmin");
  const searchParams = useSearchParams();
  const { pageNumber, setPageNumber } = usePageNumber(searchParams);
  const metadata = useContext(MetadataContext);

  const [textFilter, setTextFilter] = useState("");
  const [visibleObscured, setVisibleObscured] = useState(false);

  const { isLoading, data } = useApi(
    () =>
      AdminPlayer.getAdminPlayerList().then((players) => {
        return players
          ?.sort((a, b) => a.id - b.id)
          ?.reduce(
            (accumulator, player) => {
              const region = metadata.getRegionById(player.regionId);
              const regionName = translateRegionNameFull(metadata, Language.English, region, true);

              accumulator.tableArray.push([
                {
                  content: <AdminPlayerUpdateButton player={player} />,
                },
                {
                  content: player.name,
                },
                { content: player.alias ?? "-" },
                {
                  content: (
                    <span>
                      <FlagIcon showRegFlagRegardless region={region} /> {regionName}
                    </span>
                  ),
                },
                { content: player.pronouns ?? "-" },
              ]);
              accumulator.keys.push(player.id.toString());
              accumulator.filterStrings.push(
                (
                  player.name +
                  player.id.toString() +
                  (player.pronouns ?? "") +
                  (player.alias ?? "") +
                  (region?.code ?? "") +
                  regionName
                )
                  .toLowerCase()
                  .normalize("NFKD"),
              );
              return accumulator;
            },
            {
              tableArray: [] as ArrayTableCellData[][],
              keys: [] as string[],
              filterStrings: [] as string[],
            },
          );
      }),
    [metadata],
    "playerList",
  );

  const tableData: ArrayTableData = {
    classNames: [],
    rowKeys: data?.keys ?? [],
    filterData: {
      rowStrings: data?.filterStrings ?? [],
      currentString: textFilter,
    },
  };

  const rowsPerPage = 100;
  const maxPageNumber = Math.ceil((data?.tableArray?.length ?? 0) / rowsPerPage);
  tableData.paginationData = {
    rowsPerPage,
    page: pageNumber,
  };

  return (
    <>
      <Link to={resolvePage(Pages.AdminUi)}>« Back</Link>
      <h1>Players List</h1>
      <SearchBar setFilterString={setTextFilter} />

      <button
        className="module"
        onClick={() => {
          setVisibleObscured(true);
        }}
      >
        New Player
      </button>
      <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
        <AdminPlayerModule />
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
                { content: "Name" },
                { content: "Alias" },
                { content: "Region" },
                { content: "Pronouns" },
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

export default AdminPlayersListPage;
