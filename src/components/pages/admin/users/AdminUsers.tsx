import { useContext, useState } from "react";
import { useSearchParams, Navigate, Link } from "react-router-dom";
import { AdminUser, PlayerBasic, User } from "../../../../api";
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
import AdminUserModule from "./AdminUsersModule";
import PlayerMention from "../../../widgets/PlayerMention";

export interface AdminUserUpdateButtonProps {
  user: AdminUser;
}

const AdminUserUpdateButton = ({ user }: AdminUserUpdateButtonProps) => {
  const [visibleObscured, setVisibleObscured] = useState(false);
  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          setVisibleObscured(true);
        }}
      >
        {user.id}
      </span>
      <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
        <AdminUserModule user={user} />
      </ObscuredModule>
    </>
  );
};

const AdminUsersListPage = () => {
  const { isLoading: adminIsLoading, data: isAdmin } = useApi(() => User.isAdmin(), [], "isAdmin");
  const searchParams = useSearchParams();
  const { pageNumber, setPageNumber } = usePageNumber(searchParams);
  const metadata = useContext(MetadataContext);

  const [textFilter, setTextFilter] = useState("");
  const [visibleObscured, setVisibleObscured] = useState(false);

  const { isLoading, data } = useApi(
    () =>
      AdminUser.getList().then(async (users) => {
        return users
          ?.sort((a, b) => a.id - b.id)
          ?.reduce(
            async (accumulatorPromise, user) => {
              const player = user.playerId
                ? await PlayerBasic.getPlayerBasic(user.playerId)
                : undefined;
              const accumulator = await accumulatorPromise;
              accumulator.tableArray.push([
                {
                  content: <AdminUserUpdateButton user={user} />,
                },
                { content: user.username },
                { content: user.email },
                { content: user.isVerified ? "True" : "False" },
                { content: user.isStaff ? "True" : "False" },
                { content: player ? <PlayerMention playerOrId={player} /> : "None" },
              ]);
              accumulator.keys.push(user.id.toString());
              accumulator.filterStrings.push(
                (
                  user.username +
                  user.id.toString() +
                  user.isVerified.toString() +
                  user.isStaff.toString() +
                  (player?.name ?? "") +
                  (player?.alias ?? "")
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
    [metadata],
    "userList",
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

  console.log(data);

  return (
    <>
      <Link to={resolvePage(Pages.AdminUi)}>« Back</Link>
      <h1>Users List</h1>
      <SearchBar setFilterString={setTextFilter} />

      <button
        className="module"
        onClick={() => {
          setVisibleObscured(true);
        }}
      >
        New User
      </button>
      <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
        <AdminUserModule />
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
                { content: "Email" },
                { content: "Is Verified" },
                { content: "Is Staff" },
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

export default AdminUsersListPage;
