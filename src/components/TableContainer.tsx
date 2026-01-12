import React from "react";
import { Table } from "./Table";
import { TableViewModel } from "../visualViewModel";
import { VisualFormattingSettingsModel } from "../settings";
import type {
  SparklineColumnSettings,
  ColumnConfigSettings,
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
  viewport,
}) => {
  // Obtener configuración por defecto de columnas
  const defaultColumnSettings = formattingSettings.getColumnSettings("");

  // Mapear las propiedades del modelo de formateo a las props del componente Table
  const tableProps = {
    // Datos principales
    viewModel,
    width: viewport.width,

    // Configuración general
    textSize: formattingSettings.general.textSize.value,
    tableStyle: formattingSettings.general.tableStyle.value.value as string,
    fontFamily: formattingSettings.typography.fontFamily.value.value as string,

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

    // Interactividad
    rowSelection:
      formattingSettings.interactivity.selectionGroup.rowSelection.value,
    rowSelectionColor:
      formattingSettings.interactivity.selectionGroup.rowSelectionColor.value
        .value,
    sortable: formattingSettings.interactivity.featuresGroup.sortable.value,
    freezeCategories:
      formattingSettings.interactivity.navigationGroup.freezeCategories.value,
    searchable: formattingSettings.interactivity.featuresGroup.searchable.value,
    pagination:
      formattingSettings.interactivity.navigationGroup.pagination.value,
    rowsPerPage:
      formattingSettings.interactivity.navigationGroup.rowsPerPage.value,

    // Configuración de filas
    rowHeight: formattingSettings.rows.rowDimensionsGroup.rowHeight.value,
    alternatingRowColor:
      formattingSettings.rows.rowColorsGroup.alternatingRowColor.value.value,
    hoverBackgroundColor:
      formattingSettings.rows.rowEffectsGroup.hoverBackgroundColor.value.value,
    rowPadding: formattingSettings.rows.rowDimensionsGroup.rowPadding.value,

    // Configuración de encabezados (desde defaultColumnSettings)
    headerAlignment: defaultColumnSettings.headerAlignment as
      | "left"
      | "center"
      | "right",
    headerPadding: defaultColumnSettings.headerPadding,
    headerBold: defaultColumnSettings.headerBold,
    headerFontColor: defaultColumnSettings.headerFontColor,
    headerFontSize: defaultColumnSettings.headerFontSize,
    headerBackgroundColor: defaultColumnSettings.headerBackgroundColor,

    // Configuración de celdas de categoría
    categoryColumnAlignment: defaultColumnSettings.cellAlignment as
      | "left"
      | "center"
      | "right",
    categoryCellAlignment: defaultColumnSettings.cellAlignment as
      | "left"
      | "center"
      | "right",
    categoryCellPadding: defaultColumnSettings.cellPadding,
    categoryCellFontColor: defaultColumnSettings.cellFontColor,
    categoryCellFontSize: defaultColumnSettings.cellFontSize,
    categoryCellBackgroundColor: defaultColumnSettings.cellBackgroundColor,

    // Configuración de celdas de medidas
    measureCellAlignment: defaultColumnSettings.cellAlignment as
      | "left"
      | "center"
      | "right",
    measureCellPadding: defaultColumnSettings.cellPadding,
    measureCellFontColor: defaultColumnSettings.cellFontColor,
    measureCellFontSize: defaultColumnSettings.cellFontSize,
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
  };

  return React.createElement(Table, tableProps);
};
