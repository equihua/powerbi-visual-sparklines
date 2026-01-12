import React from "react";
import { ColumnConfigSettings } from "../settings";

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
  columnSettings: Map<string, ColumnConfigSettings>;
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
  columnSettings,
}) => {
  const getSortIndicator = (columnName: string) => {
    if (!sortable || sortColumn !== columnName) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  return (
    <thead>
      <tr style={{ borderBottom }}>
        {columnNames.map((columnName, index) => {
          const colSettings = columnSettings.get(columnName);
          const colAlignment = colSettings?.headerAlignment || alignment;
          const colPadding = colSettings?.headerPadding ?? padding;
          const colBold = colSettings?.headerBold ?? bold;
          const colFontColor = colSettings?.headerFontColor || fontColor;
          const colFontSize = colSettings?.headerFontSize ?? fontSize;
          const colBackgroundColor = colSettings?.headerBackgroundColor || backgroundColor;

          return (
            <th
              key={index}
              onClick={() => sortable && onSort(columnName)}
              style={{
                cursor: sortable ? "pointer" : "default",
                userSelect: "none",
                textAlign: colAlignment as "left" | "center" | "right",
                padding: colPadding,
                fontWeight: colBold ? 700 : 400,
                color: colFontColor,
                fontSize: colFontSize,
                position: sticky && index === 0 ? ("sticky" as const) : undefined,
                left: sticky && index === 0 ? 0 : undefined,
                background:
                  sticky && index === 0
                    ? colBackgroundColor || "#fff"
                    : colBackgroundColor || undefined,
                borderRight: showVerticalLines
                  ? `${verticalLineWidth}px solid ${verticalLineColor}`
                  : undefined,
              }}
            >
              {columnName}
              {getSortIndicator(columnName)}
            </th>
          );
        })}
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
