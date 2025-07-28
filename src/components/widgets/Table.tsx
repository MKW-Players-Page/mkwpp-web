import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext } from "../../utils/Settings";
import Icon from "./Icon";

type RowIdx = number;
type ColIdx = number;

export enum Sort {
  Ascending = -1,
  Reset = 0,
  Descending = 1,
}

export interface ThSortData {
  sortKey: string;
  allowedSort: Sort[];
}

export interface ArrayTableCellData {
  content: React.ReactNode;
  lockedCell?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Lets cells above and to the left expand into it. Up and then Left respectively */
  expandCell?: [boolean, boolean];
  thSort?: ThSortData;
}

interface ArrayTableRowProps {
  row: ArrayTableCellData[];
  rowIdx: RowIdx;
  iconCellColumns?: ColIdx[];
  th?: boolean;
  cellArea: number[][][];
  className?: string;
  id?: string;
  sort?: [string, Sort] | null;
  setSort?: React.Dispatch<React.SetStateAction<[string, Sort]>>;
}

const ArrayTableRow = ({
  row,
  rowIdx,
  th,
  cellArea,
  iconCellColumns,
  className,
  id,
  sort,
  setSort,
}: ArrayTableRowProps) => {
  const { settings } = useContext(SettingsContext);
  const Cell: keyof HTMLElementTagNameMap = `t${th ? "h" : "d"}`;

  return (
    <tr id={id} className={className}>
      {row.map((cell, idx) =>
        cell.expandCell && cell.expandCell.includes(true) ? (
          <></>
        ) : (
          <Cell
            onClick={
              th && cell.thSort !== undefined
                ? () => {
                    if (cell.thSort !== undefined && setSort !== undefined) {
                      if (!sort || sort[0] !== cell.thSort?.sortKey || sort[1] === Sort.Reset)
                        setSort([cell.thSort?.sortKey, cell.thSort?.allowedSort[0]]);
                      if (sort && sort[0] === cell.thSort?.sortKey)
                        setSort([
                          cell.thSort?.sortKey,
                          cell.thSort?.allowedSort[cell.thSort?.allowedSort.indexOf(sort[1]) + 1] ??
                            cell.thSort?.allowedSort[0],
                        ]);
                    }
                  }
                : undefined
            }
            style={{ cursor: th && cell.thSort ? "pointer" : "", ...cell.style }}
            className={`${
              settings.lockTableCells && cell.lockedCell === true ? "lock-table-cells force-bg" : ""
            }${cell.className ? " " + cell.className : ""}${
              iconCellColumns &&
              (iconCellColumns.includes(idx) || iconCellColumns.includes(idx - row.length))
                ? " icon-cell"
                : ""
            }`}
            rowSpan={cellArea[rowIdx][idx][0] > 1 ? cellArea[rowIdx][idx][0] : undefined}
            colSpan={cellArea[rowIdx][idx][1] > 1 ? cellArea[rowIdx][idx][1] : undefined}
          >
            {th &&
            cell.thSort !== undefined &&
            sort &&
            cell.thSort.sortKey === sort[0] &&
            Sort.Reset !== sort[1] ? (
              <span style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{cell.content}</span>
                <span>
                  <Icon icon={sort[1] === Sort.Ascending ? "Caret" : "UpsideDownCaret"} />
                </span>
              </span>
            ) : (
              cell.content
            )}
          </Cell>
        ),
      )}
    </tr>
  );
};

export interface RowSortData {
  rowIdx: RowIdx;
  sortKey: string;
  sortValue: any;
}

export interface ArrayTableData {
  /** Negative values work like Array.at() */
  iconCellColumns?: number[];
  classNames?: { rowIdx: RowIdx; className: string }[];
  rowKeys?: string[];
  highlightedRow?: RowIdx;
  paginationData?: {
    rowsPerPage: number;
    page: number;
    setMaxPageNumber: React.Dispatch<React.SetStateAction<number>>;
    setPage?: (x: number) => void;
  };
  filterData?: {
    /* Each row in the table body should have a corresponding filter string here. */
    rowStrings: string[];
    currentString: string;
  };
  rowSortData?: RowSortData[];
}

export interface ArrayTableProps {
  /** 2D array, should always be square */
  rows: ArrayTableCellData[][];
  /** 2D array, should always be square */
  headerRows?: ArrayTableCellData[][];
  /** 2D array, should always be square */
  footerRows?: ArrayTableCellData[][];
  tableData?: ArrayTableData;
  className?: string;
}

const ArrayTable = ({ rows, footerRows, tableData, headerRows, className }: ArrayTableProps) => {
  const passedInRows =
    tableData?.filterData !== undefined &&
    tableData.filterData.currentString !== "" &&
    tableData.filterData.rowStrings.length === rows.length
      ? rows.filter((row, index) =>
          tableData.filterData?.rowStrings[index].includes(tableData.filterData?.currentString),
        )
      : rows;

  if (tableData?.paginationData !== undefined)
    tableData.paginationData.setMaxPageNumber(
      Math.ceil(passedInRows.length / tableData.paginationData.rowsPerPage),
    );

  const areas = {
    bodyCellArea: createCellAreaMap(passedInRows),
    headerCellArea: createCellAreaMap(headerRows ? headerRows : []),
    footerCellArea: createCellAreaMap(footerRows ? footerRows : []),
  };

  const [sort, setSort] = useState<[string, Sort]>(["", Sort.Reset]);

  const highlightRowPassed = useRef<boolean>(false);
  useEffect(() => {
    const highlightElement = document.getElementById("highlightElement");
    if (highlightRowPassed.current !== true && highlightElement) {
      highlightElement.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "auto",
      });
      highlightRowPassed.current = true;
    }
  }, [tableData?.paginationData?.page, highlightRowPassed]);

  const sortBlueprint = tableData?.rowSortData
    ?.filter((r) => r.sortKey === sort[0])
    .sort((a, b) => a.sortValue - b.sortValue);
  if (sort[1] === Sort.Descending) sortBlueprint?.reverse();

  let dataToRows = passedInRows
    .map((row, rowIdx) => (
      <ArrayTableRow
        id={
          tableData?.highlightedRow !== undefined &&
          rowIdx === tableData.highlightedRow &&
          highlightRowPassed.current !== true
            ? "highlightElement"
            : undefined
        }
        rowIdx={rowIdx}
        iconCellColumns={tableData?.iconCellColumns}
        cellArea={areas.bodyCellArea}
        row={row}
        className={tableData?.classNames
          ?.filter((d) => d.rowIdx === rowIdx)
          .map((d) => d.className)
          .join(" ")}
      />
    ))
    .reduce((acc: (React.ReactNode | RowSortData)[], val, idx) => {
      let newIdx = idx;
      if (sort[1] !== Sort.Reset)
        newIdx = acc?.findIndex((r) => (r ? (r as RowSortData).rowIdx === idx : false));

      acc[newIdx] = val;
      return acc;
    }, sortBlueprint?.slice() ?? []);

  if (tableData && tableData.paginationData) {
    if (
      tableData.paginationData.setPage !== undefined &&
      highlightRowPassed.current !== true &&
      tableData.highlightedRow !== undefined
    ) {
      tableData.paginationData.setPage(
        Math.ceil(tableData.highlightedRow / tableData.paginationData.rowsPerPage),
      );
    }
    dataToRows = dataToRows.slice(
      (tableData.paginationData.page - 1) * tableData.paginationData.rowsPerPage,
      tableData.paginationData.page * tableData.paginationData.rowsPerPage,
    );
  }

  return (
    <table
      className={
        (className ?? "") +
        (sort[0] !== "" && sort[1] !== Sort.Reset ? ` sorted ${sort[0]} ${sort[1]}` : "")
      }
    >
      {headerRows ? (
        <thead>
          {headerRows.map((row, rowIdx) => (
            <ArrayTableRow
              key={tableData?.rowKeys ? tableData.rowKeys[rowIdx] : undefined}
              rowIdx={rowIdx}
              iconCellColumns={tableData?.iconCellColumns}
              cellArea={areas.headerCellArea}
              row={row}
              th
              sort={sort}
              setSort={setSort}
            />
          ))}
        </thead>
      ) : (
        <></>
      )}
      <tbody className="table-hover-rows">{dataToRows as React.ReactNode}</tbody>
      {footerRows ? (
        <tfoot>
          {footerRows.map((row, rowIdx) => (
            <ArrayTableRow
              rowIdx={rowIdx}
              iconCellColumns={tableData?.iconCellColumns}
              cellArea={areas.footerCellArea}
              row={row}
              th
            />
          ))}
        </tfoot>
      ) : (
        <></>
      )}
    </table>
  );
};

const createCellAreaMap = (cells: ArrayTableCellData[][]): number[][][] => {
  return cells.map((row, rowIdx) => {
    let prevCellColSpan = 1;
    return row.map((cell, cellIdx) => {
      let colSpan = 1;
      let rowSpan = 1;

      if (prevCellColSpan > 1) {
        colSpan = prevCellColSpan - 1;
      } else {
        let checkingCellIdx = cellIdx + 1;
        while (
          row[checkingCellIdx] !== undefined &&
          row[checkingCellIdx] !== undefined &&
          row[checkingCellIdx].expandCell !== undefined &&
          (row[checkingCellIdx].expandCell as [boolean, boolean])[1]
        ) {
          colSpan++;
          checkingCellIdx++;
        }
      }

      let checkingRowIdx = rowIdx + 1;
      while (
        cells[checkingRowIdx] !== undefined &&
        cells[checkingRowIdx][cellIdx] !== undefined &&
        cells[checkingRowIdx][cellIdx].expandCell !== undefined &&
        (cells[checkingRowIdx][cellIdx].expandCell as [boolean, boolean])[0]
      ) {
        rowSpan++;
        checkingRowIdx++;
      }

      prevCellColSpan = colSpan;
      return [rowSpan, colSpan];
    });
  });
};

export default ArrayTable;
