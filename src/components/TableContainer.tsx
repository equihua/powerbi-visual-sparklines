import React from "react";
import { Table } from "./Table";
import { TableViewModel } from "../visualViewModel";
import {
  VisualFormattingSettingsModel,
  type SparklineColumnSettings,
  type ColumnConfigSettings,
  type TypographyStyle,
} from "../settings";
import powerbi from "powerbi-visuals-api";
import IViewport = powerbi.IViewport;

/**
 * Props que recibe TableContainer desde visual.ts
 * Estos son los datos mínimos necesarios desde Power BI
 */
export interface TableContainerProps {
  viewModel: TableViewModel;
  formattingSettings: VisualFormattingSettingsModel;
  sparklineSettings: Map<string, SparklineColumnSettings>;
  columnSettings: Map<string, ColumnConfigSettings>;
  typographyStyle: TypographyStyle;
  viewport: IViewport;
}

/**
 * TableContainer - Componente contenedor responsable de:
 * 1. Mapear VisualFormattingSettingsModel a las props específicas de Table
 * 2. Separar la lógica de negocio del renderizado
 * 3. Actuar como puente entre visual.ts y Table.tsx
 *
 * Beneficios:
 * - visual.ts se mantiene limpio y enfocado en la integración con Power BI
 * - Table.tsx permanece como componente de presentación puro
 * - Facilita testing unitario de la lógica de mapeo
 * - Mejora la mantenibilidad al centralizar la transformación de props
 */
export const TableContainer: React.FC<TableContainerProps> = ({
  viewModel,
  formattingSettings,
  sparklineSettings,
  columnSettings,
  typographyStyle, // ← NUEVO: Estilos tipográficos reactivos
  viewport,
}) => {
  // Obtener configuración por defecto de columnas
  const defaultColumnSettings = formattingSettings.getColumnSettings("");

  const typography = typographyStyle;

  // Mapear las propiedades del modelo de formateo a las props del componente Table
  const tableProps = {
    // Datos principales
    viewModel,
    width: viewport.width,

    // Configuración general (Estilo)
    textSize: formattingSettings.general.styleGroup.textSize.value,
    tableStyle: formattingSettings.general.styleGroup.tableStyle.value
      .value as string,
    fontFamily: formattingSettings.typography.font.fontFamily.value as string,

    // Configuración de grilla
    showHorizontalLines:
      formattingSettings.grid.horizontalLinesGroup.showHorizontalLines.value,
    horizontalLineColor:
      formattingSettings.grid.horizontalLinesGroup.horizontalLineColor.value
        .value,
    horizontalLineWidth:
      formattingSettings.grid.horizontalLinesGroup.horizontalLineWidth.value,
    showVerticalLines:
      formattingSettings.grid.verticalLinesGroup.showVerticalLines.value,
    verticalLineColor:
      formattingSettings.grid.verticalLinesGroup.verticalLineColor.value.value,
    verticalLineWidth:
      formattingSettings.grid.verticalLinesGroup.verticalLineWidth.value,

    // Configuración de bordes
    borderStyle: formattingSettings.grid.bordersGroup.borderStyle.value
      .value as string,
    borderColor: formattingSettings.grid.bordersGroup.borderColor.value.value,
    borderWidth: formattingSettings.grid.bordersGroup.borderWidth.value,
    borderSection: formattingSettings.grid.bordersGroup.borderSection.value
      .value as "all" | "header" | "rows",

    // Interactividad (Selection, Navigation, Features)
    rowSelection: formattingSettings.general.selectionGroup.rowSelection.value,
    rowSelectionColor:
      formattingSettings.general.selectionGroup.rowSelectionColor.value.value,
    sortable: formattingSettings.general.featuresGroup.sortable.value,
    freezeCategories:
      formattingSettings.general.navigationGroup.freezeCategories.value,
    searchable: formattingSettings.general.featuresGroup.searchable.value,
    pagination: formattingSettings.general.navigationGroup.pagination.value,
    rowsPerPage: formattingSettings.general.navigationGroup.rowsPerPage.value,

    // Configuración de filas
    rowHeight: formattingSettings.rows.rowDimensionsGroup.rowHeight.value,
    alternatingRowColor:
      formattingSettings.rows.rowColorsGroup.alternatingRowColor.value.value,
    hoverBackgroundColor:
      formattingSettings.rows.rowEffectsGroup.hoverBackgroundColor.value.value,
    rowPadding: formattingSettings.rows.rowDimensionsGroup.rowPadding.value,

    // Configuración de encabezados (desde defaultColumnSettings)
    headerAlignment: typography.alignment as "left" | "center" | "right",
    headerPadding: defaultColumnSettings.headerPadding,
    headerBold: typography.fontWeight === "bold",
    headerFontColor: typography.fontColor,
    headerFontSize: typography.fontSize,
    headerBackgroundColor: defaultColumnSettings.headerBackgroundColor,

    // Configuración de celdas de categoría
    categoryColumnAlignment: typography.alignment as
      | "left"
      | "center"
      | "right",
    categoryCellAlignment: typography.alignment as "left" | "center" | "right",
    categoryCellPadding: defaultColumnSettings.cellPadding,
    categoryCellFontColor: typography.fontColor,
    categoryCellFontSize: typography.fontSize,
    categoryCellBackgroundColor: defaultColumnSettings.cellBackgroundColor,

    // Configuración de celdas de medidas
    measureCellAlignment: typography.alignment as "left" | "center" | "right",
    measureCellPadding: defaultColumnSettings.cellPadding,
    measureCellFontColor: typography.fontColor,
    measureCellFontSize: typography.fontSize,
    measureCellBackgroundColor: defaultColumnSettings.cellBackgroundColor,

    // Formato de números
    decimalPlaces: defaultColumnSettings.decimalPlaces,
    thousandsSeparator: defaultColumnSettings.thousandsSeparator,
    currencySymbol: defaultColumnSettings.prefix,
    currencyPosition: "before" as "before" | "after",
    negativeNumberFormat: "minus" as
      | "minus"
      | "parentheses"
      | "minusred"
      | "parenthesesred",
    customNegativeColor: "#FF0000",

    // Configuración adicional
    wordWrap: true,
    textOverflow: "ellipsis" as "clip" | "ellipsis" | "wrap",
    stickyHeader: false,

    // Settings mapeados
    sparklineSettings,
    columnSettings,
    typographyStyle,
  };

  return React.createElement(Table, tableProps);
};
