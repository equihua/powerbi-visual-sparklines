import React from "react";

interface TableHeaderProps {
  columnNames: string[];
  sparklineColumnNames: string[];
  sortable: boolean;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (columnName: string) => void;
  alignment: "left" | "center" | "right";
  padding: number;
  bold: boolean;
  sticky: boolean;
  showVerticalLines: boolean;
  verticalLineColor: string;
  verticalLineWidth: number;
  borderBottom?: string;
  fontColor: string;
  fontSize: number;
  backgroundColor: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columnNames,
  sparklineColumnNames,
  sortable,
  sortColumn,
  sortDirection,
  onSort,
  alignment,
  padding,
  bold,
  sticky,
  showVerticalLines,
  verticalLineColor,
  verticalLineWidth,
  borderBottom,
  fontColor,
  fontSize,
  backgroundColor,
}) => {
  const getSortIndicator = (columnName: string) => {
    if (!sortable || sortColumn !== columnName) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  return (
    <thead>
      <tr style={{ borderBottom }}>
        {columnNames.map((columnName, index) => (
          <th
            key={index}
            onClick={() => sortable && onSort(columnName)}
            style={{
              cursor: sortable ? "pointer" : "default",
              userSelect: "none",
              textAlign: alignment,
              padding,
              fontWeight: bold ? 700 : 400,
              color: fontColor,
              fontSize,
              position: sticky && index === 0 ? ("sticky" as const) : undefined,
              left: sticky && index === 0 ? 0 : undefined,
              background:
                sticky && index === 0
                  ? backgroundColor || "#fff"
                  : backgroundColor || undefined,
              borderRight: showVerticalLines
                ? `${verticalLineWidth}px solid ${verticalLineColor}`
                : undefined,
            }}
          >
            {columnName}
            {getSortIndicator(columnName)}
          </th>
        ))}
        {sparklineColumnNames.map((columnName, index) => (
          <th
            key={`sparkline-${index}`}
            style={{
              textAlign: alignment,
              padding,
              fontWeight: bold ? 700 : 400,
              color: fontColor,
              fontSize,
              backgroundColor,
            }}
          >
            {columnName}
          </th>
        ))}
      </tr>
    </thead>
  );
};
