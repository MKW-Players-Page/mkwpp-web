import { useContext, useEffect, useRef } from "react";
import { useInfiniteScroll } from "../../hooks/ScrollHook";
import { SettingsContext } from "../../utils/Settings";

type RowIdx = number;
type ColIdx = number;

export interface ThSortData {
  sortKey: string;
  asc?: boolean;
  desc?: boolean;
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
}

const ArrayTableRow = ({
  row,
  rowIdx,
  th,
  cellArea,
  iconCellColumns,
  className,
  reference: ref,
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
            className={`${
              settings.lockTableCells && cell.lockedCell === true ? "lock-table-cells force-bg" : ""
            }${cell.className ? " " + cell.className : ""}${
              iconCellColumns &&
              (iconCellColumns.includes(idx) || iconCellColumns.includes(idx - row.length))
                ? " icon-cell"
                : ""
            }`}
            rowSpan={cellArea[rowIdx][idx][0]}
            colSpan={cellArea[rowIdx][idx][1]}
          >
            {cell.content}
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
  infiniteScrollData?: { padding: number; extraDependencies: any[] };
  highlightedRow?: RowIdx;
  rowSortData?: RowSortData;
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

  const highlightRow = useRef<HTMLTableRowElement | null>(null);
  useEffect(() => {
    if (highlightRow.current !== null) {
      highlightRow.current.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "auto",
      });
      highlightRow.current = null;
    }
  }, [highlightRow]);

  const mapFn = (row: ArrayTableCellData[], rowIdx: RowIdx): React.ReactNode => (
    <ArrayTableRow
      reference={
        tableData?.highlightedRow !== undefined && rowIdx === tableData.highlightedRow
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
  );

  return (
    <table className={className}>
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
            />
          ))}
        </thead>
      ) : (
        <></>
      )}
      {tableData?.infiniteScrollData !== undefined ? (
        <InfiniteScrollTBody
          pad={tableData.infiniteScrollData.padding}
          maxLen={rows.length}
          extraDep={tableData.infiniteScrollData.extraDependencies}
          mapFn={mapFn}
          rows={rows}
          preElement={tableData.highlightedRow ?? 0}
        />
      ) : (
        <tbody className="table-hover-rows">{rows.map(mapFn)}</tbody>
      )}
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

interface InfiniteScrollTBodyProps {
  pad: number;
  maxLen: number;
  extraDep: any[];
  mapFn: (row: ArrayTableCellData[], rowIdx: number) => React.ReactNode;
  rows: ArrayTableCellData[][];
  preElement?: RowIdx;
}

const InfiniteScrollTBody = ({
  rows,
  pad,
  maxLen,
  extraDep,
  mapFn,
  preElement,
}: InfiniteScrollTBodyProps) => {
  const [sliceStart, sliceEnd, tbodyElement] = useInfiniteScroll(pad, maxLen, extraDep, preElement);
  return (
    <tbody ref={tbodyElement}>
      {rows.map((row, rowIdx) => {
        return rowIdx < sliceEnd && rowIdx >= sliceStart ? mapFn(row, rowIdx) : <></>;
      })}
    </tbody>
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
