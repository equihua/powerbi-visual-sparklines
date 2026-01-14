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
    fontFamily: columnHeadersSettings.textGroup.font.fontFamily.value as string,
    fontSize:
      gridSettings.optionsCard.globalFontSize.value > 0
        ? `${gridSettings.optionsCard.globalFontSize.value}px`
        : `${columnHeadersSettings.textGroup.font.fontSize.value}px`,
    fontWeight: columnHeadersSettings.textGroup.font.bold.value ? "bold" : "normal",
    fontStyle: columnHeadersSettings.textGroup.font.italic.value ? "italic" : "normal",
    textDecoration: columnHeadersSettings.textGroup.font.underline.value
      ? "underline"
      : "none",
    color: columnHeadersSettings.textGroup.textColor.value.value,
    backgroundColor: columnHeadersSettings.textGroup.backgroundColor.value.value,
    textAlign: columnHeadersSettings.textGroup.alignment.value as
      | "left"
      | "center"
      | "right",
    padding: `${gridSettings.optionsCard.rowPadding.value}px`,
    cursor: sortable ? "pointer" : "default",
    userSelect: "none" as const,
    whiteSpace: columnHeadersSettings.textGroup.wrapText.value ? "normal" : "nowrap",
  };

  if (gridSettings.gridlinesCard.showVertical.value) {
    headerStyle.borderRight = `${gridSettings.gridlinesCard.gridVerticalWeight.value}px solid ${gridSettings.gridlinesCard.gridVerticalColor.value.value}`;
  }

  if (gridSettings.gridlinesCard.showHorizontal.value) {
    headerStyle.borderBottom = `${gridSettings.gridlinesCard.gridHorizontalWeight.value}px solid ${gridSettings.gridlinesCard.gridHorizontalColor.value.value}`;
  }

  // Aplicar bordes según la sección y posiciones seleccionadas
  const shouldApplyBorder = (
    position: "Top" | "Bottom" | "Left" | "Right"
  ): boolean => {
    const borderSection = gridSettings.borderCard.borderSection.value.value;

    if (borderSection !== "all" && borderSection !== "columnHeader") {
      return false;
    }

    const borderKey =
      `border${position}` as keyof typeof gridSettings.borderCard;
    const borderSetting = gridSettings.borderCard[borderKey] as any;
    return borderSetting?.value === true;
  };

  if (shouldApplyBorder("Top")) {
    headerStyle.borderTop = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
  }
  if (shouldApplyBorder("Bottom")) {
    headerStyle.borderBottom = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
  }
  if (shouldApplyBorder("Left")) {
    headerStyle.borderLeft = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
  }
  if (shouldApplyBorder("Right")) {
    headerStyle.borderRight = `${gridSettings.borderCard.borderWeight.value}px solid ${gridSettings.borderCard.borderColor.value.value}`;
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
