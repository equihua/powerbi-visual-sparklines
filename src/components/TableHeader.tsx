import React from "react";
import type { ColumnHeadersSettings, GridSettings } from "../settings/index";

interface TableHeaderProps {
  columns: string[];
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  sortable: boolean;
  columnHeadersSettings: ColumnHeadersSettings;
  gridSettings: GridSettings;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  sortable,
  columnHeadersSettings,
  gridSettings,
}) => {
  const getSortIndicator = (column: string) => {
    if (!sortable || sortColumn !== column) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: columnHeadersSettings.fontFamily.value,
    fontSize: `${columnHeadersSettings.fontSize.value}px`,
    fontWeight: columnHeadersSettings.bold.value ? "bold" : "normal",
    fontStyle: columnHeadersSettings.italic.value ? "italic" : "normal",
    textDecoration: columnHeadersSettings.underline.value ? "underline" : "none",
    color: columnHeadersSettings.fontColor.value.value,
    backgroundColor: columnHeadersSettings.backgroundColor.value.value,
    textAlign: columnHeadersSettings.alignment.value as "left" | "center" | "right",
    padding: "8px",
    cursor: sortable ? "pointer" : "default",
    userSelect: "none" as const,
    whiteSpace: columnHeadersSettings.wrapText.value ? "normal" : "nowrap",
  };

  if (gridSettings.showVertical.value) {
    headerStyle.borderRight = `1px solid ${gridSettings.gridVerticalColor.value.value}`;
  }

  if (gridSettings.showHorizontal.value) {
    headerStyle.borderBottom = `1px solid ${gridSettings.gridHorizontalColor.value.value}`;
  }

  return (
    <thead>
      <tr>
        {columns.map((column, index) => (
          <th
            key={index}
            onClick={() => sortable && onSort(column)}
            style={headerStyle}
          >
            {column}
            {getSortIndicator(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
};
