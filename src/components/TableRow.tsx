import React from "react";
import { SparklineColumnSettings } from "../settings";
import { Sparkline } from "./Sparkline";
import type { ValuesCard, GridSettings } from "../settings/index";

interface TableRowProps {
  row: Record<string, any>;
  columns: string[];
  index: number;
  isSelected: boolean;
  onClick: () => void;
  rowSelection: boolean;
  rowSelectionColor: string;
  valuesSettings: ValuesCard;
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
    backgroundColor: (isSelected && rowSelection)
      ? rowSelectionColor
      : valuesSettings.backgroundColor.value.value,
    cursor: rowSelection ? "pointer" : "default",
  };

  const cellStyle: React.CSSProperties = {
    fontFamily: valuesSettings.font.fontFamily.value as string,
    fontSize:
      gridSettings.optionsCard.globalFontSize.value > 0
        ? `${gridSettings.optionsCard.globalFontSize.value}px`
        : `${valuesSettings.font.fontSize.value}px`,
    fontWeight: valuesSettings.font.bold.value ? "bold" : "normal",
    fontStyle: valuesSettings.font.italic.value ? "italic" : "normal",
    textDecoration: valuesSettings.font.underline.value ? "underline" : "none",
    color: valuesSettings.textColor.value.value,
    textAlign: (valuesSettings.alignment.value || "left") as
      | "left"
      | "center"
      | "right",
    padding: `${gridSettings.optionsCard.rowPadding.value}px`,
    whiteSpace: valuesSettings.wrapText.value ? "normal" : "nowrap",
  };

  if (gridSettings.gridlinesCard.showVertical.value) {
    cellStyle.borderRight = `${gridSettings.gridlinesCard.gridVerticalWeight.value}px solid ${gridSettings.gridlinesCard.gridVerticalColor.value.value}`;
  }

  if (gridSettings.gridlinesCard.showHorizontal.value) {
    cellStyle.borderBottom = `${gridSettings.gridlinesCard.gridHorizontalWeight.value}px solid ${gridSettings.gridlinesCard.gridHorizontalColor.value.value}`;
  }

  // Aplicar bordes según la sección y posiciones seleccionadas
  const shouldApplyBorder = (
    position: "Top" | "Bottom" | "Left" | "Right"
  ): boolean => {
    const borderSection = gridSettings.borderCard.borderSection.value.value;

    if (borderSection !== "all" && borderSection !== "valuesSection") {
      return false;
    }

    const borderKey =
      `border${position}` as keyof typeof gridSettings.borderCard;
    const borderSetting = gridSettings.borderCard[borderKey] as any;
    return borderSetting?.value === true;
  };

  if (shouldApplyBorder("Top")) {
    cellStyle.borderTop = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
  }
  if (shouldApplyBorder("Bottom")) {
    cellStyle.borderBottom = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
  }
  if (shouldApplyBorder("Left")) {
    cellStyle.borderLeft = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
  }
  if (shouldApplyBorder("Right")) {
    cellStyle.borderRight = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
  }

  return (
    <tr style={rowStyle} onClick={onClick}>
      {columns.map((column, colIndex) => {
        const cellValue = row[column];
        const sparklineConfig = sparklineSettings.get(column);

        if (
          sparklineConfig &&
          typeof cellValue === "object" &&
          cellValue !== null
        ) {
          return (
            <td key={colIndex} style={cellStyle}>
              <Sparkline sparklineData={cellValue} settings={sparklineConfig} />
            </td>
          );
        }

        return (
          <td key={colIndex} style={cellStyle}>
            {cellValue !== null && cellValue !== undefined
              ? String(cellValue)
              : ""}
          </td>
        );
      })}
    </tr>
  );
};
