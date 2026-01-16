import React, { useState, useMemo, memo, useEffect } from "react";
import { TableViewModel } from "../visualViewModel";
import { SparklineColumnSettings } from "../settings";
import { TotalsSettings } from "../settings/totals";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { areMapsEqual } from "../utils/memoization";
import { useColumnReorder } from "../hooks/useColumnReorder";
import { useColumnResize } from "../hooks/useColumnResize";
import type {
  ColumnHeadersSettings,
  ValuesCard,
  GridSettings,
} from "../settings/index";

interface TableProps {
  viewModel: TableViewModel;
  width: number;

  columnHeadersSettings: ColumnHeadersSettings;
  valuesSettings: ValuesCard;
  totalsSettings: TotalsSettings;
  gridSettings: GridSettings;

  rowSelection: boolean;
  rowSelectionColor: string;
  sortable: boolean;
  searchable: boolean;
  enableColumnReorder: boolean;
  enableColumnResize: boolean;
  pagination: boolean;
  rowsPerPage: number;

  sparklineSettings: Map<string, SparklineColumnSettings>;

  // Estilo de tabla (TableStyle)
  tableStyle: string;
}

function arePropsEqual(prevProps: TableProps, nextProps: TableProps): boolean {
  if (prevProps.viewModel !== nextProps.viewModel) return false;
  if (prevProps.width !== nextProps.width) return false;
  if (prevProps.pagination !== nextProps.pagination) return false;
  if (prevProps.rowsPerPage !== nextProps.rowsPerPage) return false;
  if (prevProps.searchable !== nextProps.searchable) return false;
  if (prevProps.sortable !== nextProps.sortable) return false;
  if (prevProps.enableColumnReorder !== nextProps.enableColumnReorder)
    return false;
  if (prevProps.enableColumnResize !== nextProps.enableColumnResize)
    return false;
  if (prevProps.rowSelection !== nextProps.rowSelection) return false;

  if (!areMapsEqual(prevProps.sparklineSettings, nextProps.sparklineSettings)) {
    return false;
  }

  return true;
}

export const Table = memo<TableProps>(
  ({
    viewModel,
    width,
    columnHeadersSettings,
    valuesSettings,
    totalsSettings,
    gridSettings,
    rowSelection,
    rowSelectionColor,
    sortable,
    searchable,
    enableColumnReorder,
    enableColumnResize,
    pagination,
    rowsPerPage,
    sparklineSettings,
    tableStyle,
  }) => {
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(
      null,
    );
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
      if (!rowSelection) {
        setSelectedRowIndex(null);
      }
    }, [rowSelection]);

    const columns = useMemo(() => {
      if (!viewModel.rows || viewModel.rows.length === 0) return [];
      return Object.keys(viewModel.rows[0]);
    }, [viewModel.rows]);

    // Hooks para reordenamiento y resize de columnas
    const {
      columnOrder,
      draggedColumn,
      dropTargetColumn,
      handleDragStart,
      handleDragOver,
      handleDragEnd,
    } = useColumnReorder(columns.length);

    const { columnWidths, handleResizeStart } = useColumnResize({
      columnCount: columns.length,
      containerWidth: width,
      minWidth: 80,
    });

    const filteredRows = useMemo(() => {
      if (!searchable || !searchTerm) return viewModel.rows;

      return viewModel.rows.filter((row) => {
        const rowValues = Object.keys(row).map((key) => row[key]);
        return rowValues.some((value) => {
          if (value === null || value === undefined) return false;
          if (typeof value === "object") return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }, [viewModel.rows, searchTerm, searchable]);

    const sortedRows = useMemo(() => {
      if (!sortColumn) return filteredRows;

      return [...filteredRows].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortDirection === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }, [filteredRows, sortColumn, sortDirection]);

    const paginatedRows = useMemo(() => {
      if (!pagination) return sortedRows;
      const startIndex = (currentPage - 1) * rowsPerPage;
      return sortedRows.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedRows, pagination, currentPage, rowsPerPage]);

    const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

    const shouldApplyBorderToTotals = (
      position: "Top" | "Bottom" | "Left" | "Right",
    ): boolean => {
      const borderSection = gridSettings.borderCard.borderSection.value.value;

      if (borderSection !== "all" && borderSection !== "totalsSection") {
        return false;
      }

      const borderKey =
        `border${position}` as keyof typeof gridSettings.borderCard;
      const borderSetting = gridSettings.borderCard[borderKey] as any;
      return borderSetting?.value === true;
    };

    const handleSort = (column: string) => {
      if (!sortable) return;
      if (sortColumn === column) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
    };

    const handleRowClick = (index: number) => {
      if (!rowSelection) return;
      setSelectedRowIndex(selectedRowIndex === index ? null : index);
    };

    const gridStyles: React.CSSProperties = {
      borderCollapse: "collapse",
      width: "100%",
      fontFamily: valuesSettings.font.fontFamily.value as string,
    };

    if (
      gridSettings.gridlinesCard.showHorizontal.value ||
      gridSettings.gridlinesCard.showVertical.value
    ) {
      gridStyles.borderSpacing = "0";
    }

    const totalsRow = useMemo(() => {
      if (
        !totalsSettings.show.value ||
        !viewModel.rows ||
        viewModel.rows.length === 0
      ) {
        return null;
      }

      const totals: { [key: string]: any } = {};
      columns.forEach((column) => {
        const values = viewModel.rows.map((row) => row[column]);
        const numericValues = values.filter((v) => typeof v === "number");

        if (numericValues.length > 0) {
          totals[column] = numericValues.reduce((sum, val) => sum + val, 0);
        } else {
          totals[column] = "";
        }
      });

      if (columns.length > 0) {
        totals[columns[0]] = totalsSettings.label.value;
      }

      return totals;
    }, [
      viewModel.rows,
      columns,
      totalsSettings.show.value,
      totalsSettings.label.value,
    ]);

    const totalsStyle = totalsSettings.getStyle();

    return (
      <div
        className="table-wrapper"
        style={{ width: `${width}px`, overflow: "auto" }}
      >
        {searchable && (
          <div className="search-bar" style={{ padding: "10px" }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                fontSize: "14px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
        )}

        <table
          className={`sparkline-table style-${tableStyle}`}
          style={gridStyles}
        >
          <TableHeader
            columns={columns}
            columnOrder={enableColumnReorder ? columnOrder : undefined}
            columnWidths={enableColumnResize ? columnWidths : undefined}
            draggedColumn={enableColumnReorder ? draggedColumn : undefined}
            dropTargetColumn={
              enableColumnReorder ? dropTargetColumn : undefined
            }
            onDragStart={enableColumnReorder ? handleDragStart : undefined}
            onDragOver={enableColumnReorder ? handleDragOver : undefined}
            onDragEnd={enableColumnReorder ? handleDragEnd : undefined}
            onResizeStart={enableColumnResize ? handleResizeStart : undefined}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            sortable={sortable}
            columnHeadersSettings={columnHeadersSettings}
            gridSettings={gridSettings}
          />
          <tbody>
            {paginatedRows.map((row, index) => (
              <TableRow
                key={index}
                row={row}
                columns={columns}
                index={index}
                isSelected={selectedRowIndex === index}
                onClick={() => handleRowClick(index)}
                rowSelection={rowSelection}
                rowSelectionColor={rowSelectionColor}
                valuesSettings={valuesSettings}
                gridSettings={gridSettings}
                sparklineSettings={sparklineSettings}
              />
            ))}
            {totalsRow && (
              <tr
                style={{
                  fontFamily: totalsStyle.fontFamily,
                  fontSize: `${totalsStyle.fontSize}pt`,
                  fontWeight: totalsStyle.bold ? "bold" : "normal",
                  fontStyle: totalsStyle.italic ? "italic" : "normal",
                  textDecoration: totalsStyle.underline ? "underline" : "none",
                  color: totalsStyle.textColor,
                  backgroundColor: totalsStyle.backgroundColor,
                }}
              >
                {columns.map((column, colIndex) => {
                  const cellStyle: React.CSSProperties = {
                    padding: "8px",
                    borderTop: gridSettings.gridlinesCard.showHorizontal.value
                      ? `${gridSettings.gridlinesCard.gridHorizontalWeight.value}px solid ${gridSettings.gridlinesCard.gridHorizontalColor.value}`
                      : "none",
                    borderLeft:
                      colIndex > 0 &&
                      gridSettings.gridlinesCard.showVertical.value
                        ? `${gridSettings.gridlinesCard.gridVerticalWeight.value}px solid ${gridSettings.gridlinesCard.gridVerticalColor.value}`
                        : "none",
                  };

                  if (shouldApplyBorderToTotals("Top")) {
                    cellStyle.borderTop = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
                  }
                  if (shouldApplyBorderToTotals("Bottom")) {
                    cellStyle.borderBottom = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
                  }
                  if (shouldApplyBorderToTotals("Left")) {
                    cellStyle.borderLeft = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
                  }
                  if (shouldApplyBorderToTotals("Right")) {
                    cellStyle.borderRight = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
                  }

                  return (
                    <td key={colIndex} style={cellStyle}>
                      {typeof totalsRow[column] === "number"
                        ? totalsRow[column].toLocaleString()
                        : totalsRow[column]}
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>

        {pagination && totalPages > 1 && (
          <div
            className="pagination"
            style={{ padding: "10px", textAlign: "center" }}
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{ margin: "0 5px", padding: "5px 10px" }}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              style={{ margin: "0 5px", padding: "5px 10px" }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  },
  arePropsEqual,
);
