import React from "react";
import type { ColumnHeadersSettings, GridSettings } from "../settings/index";

interface TableHeaderProps {
  columns: string[];
  columnOrder?: number[];
  columnWidths?: number[];
  draggedColumn?: number | null;
  dropTargetColumn?: number | null;
  onDragStart?: (columnIndex: number) => void;
  onDragOver?: (columnIndex: number) => void;
  onDragEnd?: () => void;
  onResizeStart?: (columnIndex: number, startX: number) => void;
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
  sortable: boolean;
  columnHeadersSettings: ColumnHeadersSettings;
  gridSettings: GridSettings;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  columns,
  columnOrder,
  columnWidths,
  draggedColumn,
  dropTargetColumn,
  onDragStart,
  onDragOver,
  onDragEnd,
  onResizeStart,
  sortColumn,
  sortDirection,
  onSort,
  sortable,
  columnHeadersSettings,
  gridSettings,
}) => {
  const reorderEnabled = Boolean(onDragStart && onDragOver && onDragEnd);
  const resizeEnabled = Boolean(onResizeStart);
  const orderedColumns =
    reorderEnabled && columnOrder
      ? columnOrder
          .map((idx) => ({
            column: columns[idx],
            originalIndex: idx,
          }))
          .filter((item) => item.column)
      : columns.map((column, idx) => ({ column, originalIndex: idx }));
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
    fontWeight: columnHeadersSettings.textGroup.font.bold.value
      ? "bold"
      : "normal",
    fontStyle: columnHeadersSettings.textGroup.font.italic.value
      ? "italic"
      : "normal",
    textDecoration: columnHeadersSettings.textGroup.font.underline.value
      ? "underline"
      : "none",
    color: columnHeadersSettings.textGroup.textColor.value.value,
    backgroundColor:
      columnHeadersSettings.textGroup.backgroundColor.value.value,
    textAlign: columnHeadersSettings.textGroup.alignment.value as
      | "left"
      | "center"
      | "right",
    padding: `${gridSettings.optionsCard.rowPadding.value}px`,
    cursor: sortable ? "pointer" : "default",
    userSelect: "none" as const,
    whiteSpace: columnHeadersSettings.textGroup.wrapText.value
      ? "normal"
      : "nowrap",
  };

  if (gridSettings.gridlinesCard.showVertical.value) {
    headerStyle.borderRight = `${gridSettings.gridlinesCard.gridVerticalWeight.value}px solid ${gridSettings.gridlinesCard.gridVerticalColor.value.value}`;
  }

  if (gridSettings.gridlinesCard.showHorizontal.value) {
    headerStyle.borderBottom = `${gridSettings.gridlinesCard.gridHorizontalWeight.value}px solid ${gridSettings.gridlinesCard.gridHorizontalColor.value.value}`;
  }

  // Aplicar bordes según la sección y posiciones seleccionadas
  const shouldApplyBorder = (
    position: "Top" | "Bottom" | "Left" | "Right",
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
        {orderedColumns.map(({ column, originalIndex }) => {
          const isDragging = reorderEnabled && draggedColumn === originalIndex;
          const isDropTarget =
            reorderEnabled && dropTargetColumn === originalIndex;
          const width =
            resizeEnabled && columnWidths
              ? columnWidths[originalIndex]
              : undefined;

          const thStyle = {
            ...headerStyle,
            position: "relative" as const,
            width: width ? `${width}px` : "auto",
            minWidth: "80px",
            cursor: reorderEnabled ? "grab" : sortable ? "pointer" : "default",
            backgroundColor: isDragging
              ? "#e3f2fd"
              : isDropTarget
                ? "#bbdefb"
                : headerStyle.backgroundColor,
            opacity: isDragging ? 0.7 : 1,
            borderLeft: isDropTarget
              ? "3px solid #1976d2"
              : headerStyle.borderLeft,
            transition: "background-color 0.15s ease",
          };

          return (
            <th
              key={originalIndex}
              draggable={reorderEnabled}
              onDragStart={
                reorderEnabled && onDragStart
                  ? (e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData(
                        "text/plain",
                        String(originalIndex),
                      );
                      onDragStart(originalIndex);
                    }
                  : undefined
              }
              onDragOver={
                reorderEnabled && onDragOver
                  ? (e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      onDragOver(originalIndex);
                    }
                  : undefined
              }
              onDragEnd={reorderEnabled && onDragEnd ? onDragEnd : undefined}
              onDrop={
                reorderEnabled && onDragEnd
                  ? (e) => {
                      e.preventDefault();
                      onDragEnd();
                    }
                  : undefined
              }
              onClick={() => {
                if (sortable && !isDragging) {
                  onSort(column);
                }
              }}
              style={thStyle}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: columnHeadersSettings.textGroup.wrapText.value
                      ? "normal"
                      : "nowrap",
                  }}
                >
                  {column}
                </span>
                {getSortIndicator(column)}
              </div>
              {resizeEnabled && onResizeStart && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "6px",
                    cursor: "col-resize",
                    backgroundColor: "transparent",
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onResizeStart(originalIndex, e.clientX);
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "#0078D4";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                  }}
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                />
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
