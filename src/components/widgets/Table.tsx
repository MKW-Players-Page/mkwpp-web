import { useContext } from "react";
import { SettingsContext } from "../../utils/Settings";

export interface ArrayTableCellData {
  lockedCell?: boolean;
  className?: string;
  content: React.ReactNode;
  /** Lets cells above and to the left expand into it. Up and then Left respectively */
  expandCell?: [boolean, boolean];
}

interface ArrayTableRowProps {
  row: ArrayTableCellData[];
  rowIdx: number;
  iconCellColumns?: number[];
  th?: boolean;
  cellArea: number[][][];
  className?: string;
}

const ArrayTableRow = ({
  row,
  rowIdx,
  th,
  cellArea,
  iconCellColumns,
  className,
}: ArrayTableRowProps) => {
  const { settings } = useContext(SettingsContext);
  const Cell: keyof JSX.IntrinsicElements = `t${th ? "h" : "d"}`;

  return (
    <tr className={className}>
      {row.map((cell, idx, arr) =>
        cell.expandCell && cell.expandCell.includes(true) ? (
          <></>
        ) : (
          <Cell
            className={`${
              settings.lockTableCells && cell.lockedCell === true ? "lock-table-cells" : ""
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

export interface ArrayTableData {
  /** Negative values work like Array.at() */
  iconCellColumns?: number[];
  classNames?: { rowIdx: number; className: string }[];
}

export interface ArrayTableProps {
  /** 2D array, should always be square */
  rows: ArrayTableCellData[][];
  /** 2D array, should always be square */
  headerRows?: ArrayTableCellData[][];
  /** 2D array, should always be square */
  footerRows?: ArrayTableCellData[][];
  tableData?: ArrayTableData;
}

const ArrayTable = ({ rows, footerRows, tableData, headerRows }: ArrayTableProps) => {
  const areas = {
    bodyCellArea: createCellAreaMap(rows),
    headerCellArea: createCellAreaMap(headerRows ? headerRows : []),
    footerCellArea: createCellAreaMap(footerRows ? footerRows : []),
  };

  return (
    <table>
      {headerRows ? (
        <thead>
          {headerRows.map((row, rowIdx) => (
            <ArrayTableRow
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
      <tbody className="table-hover-rows">
        {rows.map((row, rowIdx) => (
          <ArrayTableRow
            rowIdx={rowIdx}
            iconCellColumns={tableData?.iconCellColumns}
            cellArea={areas.bodyCellArea}
            row={row}
          />
        ))}
      </tbody>
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
