import React, { useState, useMemo, memo } from "react";
import { TableViewModel } from "../visualViewModel";
import { SparklineColumnSettings } from "../settings";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { areMapsEqual } from "../utils/memoization";
import type { ColumnHeadersSettings, ValuesSettings, TotalsSettings, GridSettings } from "../settings/index";

interface TableProps {
  viewModel: TableViewModel;
  width: number;
  
  columnHeadersSettings: ColumnHeadersSettings;
  valuesSettings: ValuesSettings;
  totalsSettings: TotalsSettings;
  gridSettings: GridSettings;
  
  rowSelection: boolean;
  rowSelectionColor: string;
  sortable: boolean;
  searchable: boolean;
  pagination: boolean;
  rowsPerPage: number;
  
  sparklineSettings: Map<string, SparklineColumnSettings>;
}

function arePropsEqual(prevProps: TableProps, nextProps: TableProps): boolean {
  if (prevProps.viewModel !== nextProps.viewModel) return false;
  if (prevProps.width !== nextProps.width) return false;
  if (prevProps.pagination !== nextProps.pagination) return false;
  if (prevProps.rowsPerPage !== nextProps.rowsPerPage) return false;
  if (prevProps.searchable !== nextProps.searchable) return false;
  if (prevProps.sortable !== nextProps.sortable) return false;
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
    pagination,
    rowsPerPage,
    sparklineSettings,
  }) => {
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const columns = useMemo(() => {
      if (!viewModel.rows || viewModel.rows.length === 0) return [];
      return Object.keys(viewModel.rows[0]);
    }, [viewModel.rows]);

    const filteredRows = useMemo(() => {
      if (!searchable || !searchTerm) return viewModel.rows;

      return viewModel.rows.filter((row) => {
        const rowValues = Object.keys(row).map(key => row[key]);
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
      fontFamily: valuesSettings.fontFamily.value,
    };

    if (gridSettings.showHorizontal.value || gridSettings.showVertical.value) {
      gridStyles.borderSpacing = "0";
    }

    return (
      <div className="table-wrapper" style={{ width: `${width}px`, overflow: "auto" }}>
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

        <table style={gridStyles}>
          <TableHeader
            columns={columns}
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
          </tbody>
        </table>

        {pagination && totalPages > 1 && (
          <div className="pagination" style={{ padding: "10px", textAlign: "center" }}>
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
  arePropsEqual
);
