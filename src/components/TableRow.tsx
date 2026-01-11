import React from "react";
import { TableRowData, SparklineData } from "../visualViewModel";
import { SparklineColumnSettings } from "../settings";
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
      {columnNames.map((columnName, cellIndex) => (
        <TableCell
          key={cellIndex}
          value={rowData[columnName]}
          alignment={
            cellIndex === 0 ? categoryCellAlignment : measureCellAlignment
          }
          padding={cellIndex === 0 ? categoryCellPadding : measureCellPadding}
          color={cellIndex === 0 ? categoryCellFontColor : measureCellFontColor}
          fontSize={
            cellIndex === 0 ? categoryCellFontSize : measureCellFontSize
          }
          backgroundColor={
            cellIndex === 0
              ? categoryCellBackgroundColor
              : measureCellBackgroundColor
          }
          freezeLeft={freezeCategories && cellIndex === 0}
          showVerticalLines={showVerticalLines}
          verticalLineColor={verticalLineColor}
          verticalLineWidth={verticalLineWidth}
          wordWrap={wordWrap}
          textOverflow={textOverflow}
          decimalPlaces={decimalPlaces}
          thousandsSeparator={thousandsSeparator}
          currencySymbol={currencySymbol}
          currencyPosition={currencyPosition}
          negativeNumberFormat={negativeNumberFormat}
          customNegativeColor={customNegativeColor}
        />
      ))}
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
