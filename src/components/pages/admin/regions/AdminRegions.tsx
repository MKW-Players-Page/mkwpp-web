import { useContext, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
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

  const { isLoading, data: regions } = useApi(
    () =>
      Region.get().then((regions) => {
        metadata.regions = regions;
        return regions
          .sort((a, b) => a.id - b.id)
          .map((region) => {
            const name = translateRegionName(region, Language.English);
            const nameNormalized = name.toLowerCase().normalize("NFKD");
            const parentRegion = region.parentId
              ? metadata.getRegionById(region.parentId)
              : undefined;
            const parentName = parentRegion
              ? translateRegionName(parentRegion, Language.English)
              : "None";
            const isRankedText = region.isRanked ? "True" : "False";

            const regionType = translateRegionType(region.regionType, Language.English);

            return [
              [
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
              ],
              (filter: string) =>
                !(
                  filter === "" ||
                  nameNormalized.includes(filter) ||
                  region.id.toString().includes(filter) ||
                  region.code.toLowerCase().normalize("NFKD").includes(filter) ||
                  regionType.toLowerCase().normalize("NFKD").includes(filter) ||
                  isRankedText.toLowerCase().normalize("NFKD").includes(filter)
                ),
              region.id,
            ];
          }) as unknown as [ArrayTableCellData[], (filter: string) => boolean, number][];
      }),
    [],
    "regionList",
  );

  const tableData: ArrayTableData = {
    classNames: [],
    rowKeys: [],
  };

  const tableArray =
    regions?.reduce((accumulator: ArrayTableCellData[][], [row, filterFunc, rowKey]) => {
      if (filterFunc(textFilter)) return accumulator;

      tableData.rowKeys?.push(rowKey.toString());
      accumulator.push(row);
      return accumulator;
    }, []) ?? [];

  const rowsPerPage = 100;
  const maxPageNumber = Math.ceil(tableArray.length / rowsPerPage);
  tableData.paginationData = {
    rowsPerPage,
    page: pageNumber,
  };

  return (
    <>
      <h1>Regions List</h1>
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
            setTextFilter(
              (document.getElementById("filterText") as HTMLInputElement).value
                .toLowerCase()
                .normalize("NFKD"),
            );
          }}
        >
          Search
        </button>
      </div>

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

export default AdminRegionsListPage;
