import React from "react";
import { SparklineColumnSettings } from "../settings";
import { Sparkline } from "./Sparkline";
import type { ValuesSettings, GridSettings } from "../settings/index";

interface TableRowProps {
  row: Record<string, any>;
  columns: string[];
  index: number;
  isSelected: boolean;
  onClick: () => void;
  rowSelection: boolean;
  rowSelectionColor: string;
  valuesSettings: ValuesSettings;
  gridSettings: GridSettings;
  sparklineSettings: Map<string, SparklineColumnSettings>;
}

export const TableRow: React.FC<TableRowProps> = ({
  row,
  columns,
  index,
  isSelected,
  onClick,
  rowSelection,
  rowSelectionColor,
  valuesSettings,
  gridSettings,
  sparklineSettings,
}) => {
  const isAlternateRow = index % 2 === 1;
  
  const rowStyle: React.CSSProperties = {
    backgroundColor: isSelected
      ? rowSelectionColor
      : isAlternateRow && valuesSettings.altBackgroundColor.value.value
      ? valuesSettings.altBackgroundColor.value.value
      : valuesSettings.backgroundColor.value.value,
    cursor: rowSelection ? "pointer" : "default",
  };

  const cellStyle: React.CSSProperties = {
    fontFamily: valuesSettings.fontFamily.value,
    fontSize: `${valuesSettings.fontSize.value}px`,
    fontWeight: valuesSettings.bold.value ? "bold" : "normal",
    fontStyle: valuesSettings.italic.value ? "italic" : "normal",
    textDecoration: valuesSettings.underline.value ? "underline" : "none",
    color: valuesSettings.fontColor.value.value,
    textAlign: (valuesSettings.alignment.value.value || "left") as "left" | "center" | "right",
    padding: "8px",
    whiteSpace: valuesSettings.wrapText.value ? "normal" : "nowrap",
  };

  if (gridSettings.showVertical.value) {
    cellStyle.borderRight = `1px solid ${gridSettings.gridVerticalColor.value.value}`;
  }

  if (gridSettings.showHorizontal.value) {
    cellStyle.borderBottom = `1px solid ${gridSettings.gridHorizontalColor.value.value}`;
  }

  return (
    <tr style={rowStyle} onClick={onClick}>
      {columns.map((column, colIndex) => {
        const cellValue = row[column];
        const sparklineConfig = sparklineSettings.get(column);

        if (sparklineConfig && typeof cellValue === "object" && cellValue !== null) {
          return (
            <td key={colIndex} style={cellStyle}>
              <Sparkline
                sparklineData={cellValue}
                settings={sparklineConfig}
              />
            </td>
          );
        }

        return (
          <td key={colIndex} style={cellStyle}>
            {cellValue !== null && cellValue !== undefined ? String(cellValue) : ""}
          </td>
        );
      })}
    </tr>
  );
};
