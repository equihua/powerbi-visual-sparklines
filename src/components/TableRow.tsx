import React from "react";
import { TableRowData, SparklineData } from "../visualViewModel";
import { SparklineColumnSettings, ColumnConfigSettings } from "../settings";
import { TableCell } from "./TableCell";
import { Sparkline } from "./Sparkline";

interface TableRowProps {
  rowData: TableRowData;
  columnNames: string[];
  sparklineColumnNames: string[];
  index: number;
  tableStyle: string;
  showHorizontalLines: boolean;
  horizontalLineColor: string;
  horizontalLineWidth: number;
  showVerticalLines: boolean;
  verticalLineColor: string;
  verticalLineWidth: number;
  isSelected: boolean;
  onRowClick: () => void;
  rowSelectionColor: string;
  freezeCategories: boolean;
  rowHeight: number;
  alternatingRowColor: string;
  hoverBackgroundColor: string;
  rowPadding: number;
  categoryCellAlignment: "left" | "center" | "right";
  categoryCellPadding: number;
  categoryCellFontColor: string;
  categoryCellFontSize: number;
  categoryCellBackgroundColor: string;
  measureCellAlignment: "left" | "center" | "right";
  measureCellPadding: number;
  measureCellFontColor: string;
  measureCellFontSize: number;
  measureCellBackgroundColor: string;
  wordWrap: boolean;
  textOverflow: "clip" | "ellipsis" | "wrap";
  borderForRows?: string;
  decimalPlaces: number;
  thousandsSeparator: boolean;
  currencySymbol: string;
  currencyPosition: "before" | "after";
  negativeNumberFormat: "minus" | "parentheses" | "minusred" | "parenthesesred";
  customNegativeColor: string;
  sparklineSettings: Map<string, SparklineColumnSettings>;
  columnSettings: Map<string, ColumnConfigSettings>;
}

export const TableRow: React.FC<TableRowProps> = ({
  rowData,
  columnNames,
  sparklineColumnNames,
  index,
  tableStyle,
  showHorizontalLines,
  horizontalLineColor,
  horizontalLineWidth,
  showVerticalLines,
  verticalLineColor,
  verticalLineWidth,
  isSelected,
  onRowClick,
  rowSelectionColor,
  freezeCategories,
  rowHeight,
  alternatingRowColor,
  hoverBackgroundColor,
  rowPadding,
  categoryCellAlignment,
  categoryCellPadding,
  categoryCellFontColor,
  categoryCellFontSize,
  categoryCellBackgroundColor,
  measureCellAlignment,
  measureCellPadding,
  measureCellFontColor,
  measureCellFontSize,
  measureCellBackgroundColor,
  wordWrap,
  textOverflow,
  borderForRows,
  decimalPlaces,
  thousandsSeparator,
  currencySymbol,
  currencyPosition,
  negativeNumberFormat,
  customNegativeColor,
  sparklineSettings,
  columnSettings,
}) => {
  let backgroundColor =
    tableStyle === "striped" && index % 2 === 1
      ? alternatingRowColor || "#f0f0f0"
      : undefined;

  if (isSelected) {
    backgroundColor = rowSelectionColor || "#d0e8ff";
  }

  const borderBottom = showHorizontalLines
    ? `${horizontalLineWidth}px solid ${horizontalLineColor}`
    : "none";

  return (
    <tr
      style={{
        backgroundColor,
        borderBottom,
        cursor: "pointer",
        height: rowHeight,
        border: borderForRows,
        transition: "background-color 150ms ease-in-out",
      }}
      onClick={onRowClick}
    >
      {columnNames.map((columnName, cellIndex) => {
        const colSettings = columnSettings.get(columnName);
        const isCategory = cellIndex === 0;

        const cellAlignment = colSettings?.cellAlignment || (isCategory ? categoryCellAlignment : measureCellAlignment);
        const cellPadding = colSettings?.cellPadding ?? (isCategory ? categoryCellPadding : measureCellPadding);
        const cellColor = colSettings?.cellFontColor || (isCategory ? categoryCellFontColor : measureCellFontColor);
        const cellFontSize = colSettings?.cellFontSize ?? (isCategory ? categoryCellFontSize : measureCellFontSize);
        const cellBgColor = colSettings?.cellBackgroundColor || (isCategory ? categoryCellBackgroundColor : measureCellBackgroundColor);
        const cellDecimalPlaces = colSettings?.decimalPlaces ?? decimalPlaces;
        const cellThousandsSeparator = colSettings?.thousandsSeparator ?? thousandsSeparator;
        const cellPrefix = colSettings?.prefix || currencySymbol;

        return (
          <TableCell
            key={cellIndex}
            value={rowData[columnName]}
            alignment={cellAlignment as "left" | "center" | "right"}
            padding={cellPadding}
            color={cellColor}
            fontSize={cellFontSize}
            backgroundColor={cellBgColor}
            freezeLeft={freezeCategories && cellIndex === 0}
            showVerticalLines={showVerticalLines}
            verticalLineColor={verticalLineColor}
            verticalLineWidth={verticalLineWidth}
            wordWrap={wordWrap}
            textOverflow={textOverflow}
            decimalPlaces={cellDecimalPlaces}
            thousandsSeparator={cellThousandsSeparator}
            currencySymbol={cellPrefix}
            currencyPosition={currencyPosition}
            negativeNumberFormat={negativeNumberFormat}
            customNegativeColor={customNegativeColor}
          />
        );
      })}
      {sparklineColumnNames.map((columnName, sparklineIndex) => {
        const sparklineData = rowData[columnName] as SparklineData;
        const settings = sparklineSettings.get(columnName) || {
          chartType: "line",
          color: "#0078D4",
          lineWidth: 1.5,
        };

        return (
          <td
            key={`sparkline-${sparklineIndex}`}
            style={{
              borderBottom,
              borderRight: showVerticalLines
                ? `${verticalLineWidth}px solid ${verticalLineColor}`
                : undefined,
            }}
          >
            {sparklineData &&
              sparklineData.Values &&
              sparklineData.Values.length > 0 && (
                <Sparkline sparklineData={sparklineData} settings={settings} />
              )}
          </td>
        );
      })}
    </tr>
  );
};
