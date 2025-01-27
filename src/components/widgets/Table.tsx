import { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePageNumber } from "../../utils/SearchParams";
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
  lockedCell?: boolean;
  className?: string;
  content: React.ReactNode;
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
  reference?: React.MutableRefObject<HTMLTableRowElement | null>;
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
  reference: ref,
  sort,
  setSort,
}: ArrayTableRowProps) => {
  const { settings } = useContext(SettingsContext);
  const Cell: keyof JSX.IntrinsicElements = `t${th ? "h" : "d"}`;

  return (
    <tr ref={ref} className={className}>
      {row.map((cell, idx, arr) =>
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
            style={{ cursor: th && cell.thSort ? "pointer" : "" }}
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
  const areas = {
    bodyCellArea: createCellAreaMap(rows),
    headerCellArea: createCellAreaMap(headerRows ? headerRows : []),
    footerCellArea: createCellAreaMap(footerRows ? footerRows : []),
  };

  const [sort, setSort] = useState<[string, Sort]>(["", Sort.Reset]);

  const searchParams = useSearchParams();
  const { pageNumber, setPageNumber } = usePageNumber(searchParams);

  const highlightRow = useRef<HTMLTableRowElement | null>(null);
  const highlightRowPassed = useRef<boolean>(false);
  useEffect(() => {
    if (highlightRow.current !== null && highlightRowPassed.current !== true) {
      highlightRow.current.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "auto",
      });
      highlightRowPassed.current = true;
      highlightRow.current = null;
    }
  }, [highlightRow]);

  let sortBlueprint = tableData?.rowSortData
    ?.filter((r) => r.sortKey === sort[0])
    .sort((a, b) => a.sortValue - b.sortValue);
  if (sort[1] === Sort.Descending) sortBlueprint?.reverse();

  let dataToRows = rows
    .map((row, rowIdx) => () => (
      <ArrayTableRow
        reference={
          tableData?.highlightedRow !== undefined &&
          rowIdx === tableData.highlightedRow &&
          highlightRowPassed.current !== true
            ? highlightRow
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
    .reduce(
      (acc: (() => JSX.Element | RowSortData)[], val, idx) => {
        let newIdx = idx;
        if (sort[1] !== Sort.Reset)
          newIdx = acc?.findIndex((r) => (r ? (r() as RowSortData).rowIdx === idx : false));

        acc[newIdx] = val;
        return acc;
      },
      sortBlueprint?.map((r) => () => r) ?? [],
    );

  if (tableData && tableData.paginationData) {
    if (highlightRowPassed.current !== true && tableData.highlightedRow)
      setPageNumber(Math.ceil(tableData.highlightedRow / tableData.paginationData.rowsPerPage));

    dataToRows.slice(
      (pageNumber - 1) * tableData.paginationData.rowsPerPage,
      pageNumber * tableData.paginationData.rowsPerPage,
    );
  }

  return (
    <table
      className={
        className +
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
      <tbody className="table-hover-rows">{dataToRows.map((r) => r()) as React.ReactNode}</tbody>
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
        for (let checkingCellIdx = cellIdx + 1; true; checkingCellIdx++) {
          if (
            row[checkingCellIdx] !== undefined &&
            row[checkingCellIdx].expandCell !== undefined &&
            (row[checkingCellIdx].expandCell as [boolean, boolean])[1]
          ) {
            colSpan++;
          } else {
            break;
          }
        }
      }

      for (let checkingRowIdx = rowIdx + 1; true; checkingRowIdx++) {
        if (
          cells[checkingRowIdx] !== undefined &&
          cells[checkingRowIdx][cellIdx].expandCell !== undefined &&
          (cells[checkingRowIdx][cellIdx].expandCell as [boolean, boolean])[0]
        ) {
          rowSpan++;
        } else {
          break;
        }
      }

      prevCellColSpan = colSpan;
      return [rowSpan, colSpan];
    });
  });
};

export default ArrayTable;
