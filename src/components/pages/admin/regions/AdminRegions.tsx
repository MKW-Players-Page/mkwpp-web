import { useContext, useState } from "react";
import { useSearchParams, Navigate, Link } from "react-router";
import { Region, User } from "../../../../api";
import { useApi } from "../../../../hooks";
import { usePageNumber } from "../../../../utils/SearchParams";
import Deferred from "../../../widgets/Deferred";
import { PaginationButtonRow } from "../../../widgets/PaginationButtons";
import ArrayTable, { ArrayTableCellData, ArrayTableData } from "../../../widgets/Table";
import { Pages, resolvePage } from "../../Pages";
import { Language, translateRegionName, translateRegionType } from "../../../../utils/i18n/i18n";
import { FlagIcon } from "../../../widgets";
import { MetadataContext } from "../../../../utils/Metadata";
import ObscuredModule from "../../../widgets/ObscuredModule";
import AdminRegionModule from "./AdminRegionsModule";
import SearchBar from "../../../widgets/SearchBar";

export interface AdminRegionUpdateButtonProps {
  region: Region;
}

const AdminRegionUpdateButton = ({ region }: AdminRegionUpdateButtonProps) => {
  const [visibleObscured, setVisibleObscured] = useState(false);
  return (
    <>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          setVisibleObscured(true);
        }}
      >
        {region.id}
      </span>
      <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
        <AdminRegionModule region={region} />
      </ObscuredModule>
    </>
  );
};

const AdminRegionsListPage = () => {
  const { isLoading: adminIsLoading, data: isAdmin } = useApi(() => User.isAdmin(), [], "isAdmin");
  const searchParams = useSearchParams();
  const { pageNumber, setPageNumber } = usePageNumber(searchParams);
  const metadata = useContext(MetadataContext);

  const [textFilter, setTextFilter] = useState("");
  const [visibleObscured, setVisibleObscured] = useState(false);

  const { isLoading, data } = useApi(
    () =>
      Region.get().then((regions) => {
        metadata.regions = regions;
        return regions
          .sort((a, b) => a.id - b.id)
          .reduce(
            (accumulator, region) => {
              const name = translateRegionName(region, Language.English);
              const parentRegion = region.parentId
                ? metadata.getRegionById(region.parentId)
                : undefined;
              const parentName = parentRegion
                ? translateRegionName(parentRegion, Language.English)
                : "None";
              const isRankedText = region.isRanked ? "True" : "False";

              const regionType = translateRegionType(region.regionType, Language.English);

              accumulator.tableArray.push([
                {
                  content: <AdminRegionUpdateButton region={region} />,
                },
                {
                  content: (
                    <span>
                      {<FlagIcon region={region} showRegFlagRegardless={true} />}
                      {name}
                    </span>
                  ),
                },
                { content: region.code },
                { content: regionType },
                {
                  content: (
                    <span>
                      {<FlagIcon region={parentRegion} showRegFlagRegardless={true} />}
                      {parentName}
                    </span>
                  ),
                },
                { content: isRankedText },
              ]);
              accumulator.keys.push(region.id.toString());
              accumulator.filterStrings.push(
                (name + region.id.toString() + region.code + regionType + isRankedText + parentName)
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
    "regionList",
  );

  const rowsPerPage = 100;
  const [maxPageNumber, setMaxPageNumber] = useState(
    Math.ceil((data?.tableArray ?? []).length / rowsPerPage),
  );

  const tableData: ArrayTableData = {
    classNames: [],
    rowKeys: [],
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
      <h1>Regions List</h1>
      <SearchBar setFilterString={setTextFilter} />

      <button
        className="module"
        onClick={() => {
          setVisibleObscured(true);
        }}
      >
        New Region
      </button>
      <ObscuredModule stateVisible={visibleObscured} setStateVisible={setVisibleObscured}>
        <AdminRegionModule />
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
                { content: "Code" },
                { content: "Type" },
                { content: "Parent" },
                { content: "Is Ranked" },
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

export default AdminRegionsListPage;
