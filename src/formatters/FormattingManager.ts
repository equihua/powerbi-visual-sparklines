/**
 * Mediador centralizado para la sincronización de configuraciones de formato
 *
 * Responsabilidades:
 * - Aislar la lógica de sincronización entre Visual y VisualFormattingSettingsModel
 * - Gestionar el ciclo de vida de las configuraciones de formato
 * - Exponer una interfaz simple y clara a la clase Visual
 * - Mantener compatibilidad con FormattingSettingsService
 *
 * @author PowerBI Visual Sparklines
 * @version 1.0.0
 */

import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import FormattingModel = powerbi.visuals.FormattingModel;

import {
  VisualFormattingSettingsModel,
  type SparklineColumnSettings,
  type ColumnConfigSettings,
} from "../settings";

/**
 * Interfaz que define las propiedades necesarias para renderizar la tabla
 * Aísla a Visual de la estructura interna de VisualFormattingSettingsModel
 */
export interface TableFormattingProps {
  // General
  textSize: number;
  tableStyle: string;

  // Grid - Líneas horizontales
  showHorizontalLines: boolean;
  horizontalLineColor: string;
  horizontalLineWidth: number;

  // Grid - Líneas verticales
  showVerticalLines: boolean;
  verticalLineColor: string;
  verticalLineWidth: number;

  // Grid - Bordes
  borderStyle: "solid" | "dashed" | "dotted" | "double";
  borderColor: string;
  borderWidth: number;
  borderSection: "all" | "header" | "rows";

  // Interactividad
  rowSelection: boolean;
  rowSelectionColor: string;
  sortable: boolean;
  freezeCategories: boolean;
  searchable: boolean;
  pagination: boolean;
  rowsPerPage: number;

  // Tipografía
  fontFamily: string;

  // Filas
  rowHeight: number;
  alternatingRowColor: string;
  hoverBackgroundColor: string;
  rowPadding: number;

  // Encabezados (por defecto)
  headerAlignment: "left" | "center" | "right";
  headerPadding: number;
  headerBold: boolean;
  headerFontColor: string;
  headerFontSize: number;
  headerBackgroundColor: string;

  // Celdas (por defecto)
  categoryColumnAlignment: "left" | "center" | "right";
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

  // Formato de números
  decimalPlaces: number;
  thousandsSeparator: boolean;
  currencySymbol: string;
  currencyPosition: "before" | "after";
  negativeNumberFormat: "minus" | "parentheses" | "minusred" | "parenthesesred";
  customNegativeColor: string;

  // Configuraciones dinámicas por columna
  sparklineSettings: Map<string, SparklineColumnSettings>;
  columnSettings: Map<string, ColumnConfigSettings>;
}

/**
 * Resultado de la detección de columnas en el esquema
 */
export interface DetectedColumns {
  sparklineColumnNames: string[];
  measureColumnNames: string[];
}

/**
 * FormattingManager: Orquestador centralizado de configuraciones de formato
 *
 * Esta clase actúa como mediador entre Visual y VisualFormattingSettingsModel,
 * simplificando la sincronización de configuraciones y reduciendo el acoplamiento.
 */
export class FormattingManager {
  private formattingSettings: VisualFormattingSettingsModel;
  private formattingSettingsService: FormattingSettingsService;
  private sparklineSettings: Map<string, SparklineColumnSettings>;
  private columnSettings: Map<string, ColumnConfigSettings>;

  constructor() {
    this.formattingSettingsService = new FormattingSettingsService();
    this.formattingSettings = new VisualFormattingSettingsModel();
    this.sparklineSettings = new Map();
    this.columnSettings = new Map();
  }

  /**
   * Inicializa las configuraciones de formato a partir de un DataView
   *
   * Este método sincroniza automáticamente:
   * 1. Pobla las configuraciones desde el DataView usando FormattingSettingsService
   * 2. Actualiza los esquemas dinámicos de sparklines y columnas de medida
   * 3. Selecciona la columna por defecto en el selector
   *
   * @param dataView - DataView de Power BI con las configuraciones
   * @param sparklineColumnNames - Nombres de las columnas de sparkline detectadas
   * @param measureColumnNames - Nombres de las columnas de medida detectadas
   */
  public initializeSettings(
    dataView: DataView,
    sparklineColumnNames: string[],
    measureColumnNames: string[]
  ): void {
    // 1. Popula desde DataView usando el servicio de Power BI
    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        dataView
      );

    // 2. Sincroniza los esquemas dinámicos
    this.syncSchemaColumns(sparklineColumnNames, measureColumnNames);
  }

  /**
   * Sincroniza las columnas dinámicas (sparklines y medidas)
   *
   * Esta operación es necesaria cuando el esquema de datos cambia,
   * para que los paneles de formato incluyan controles para cada columna.
   *
   * @param sparklineColumnNames - Columnas de sparkline a sincronizar
   * @param measureColumnNames - Columnas de medida a sincronizar
   */
  public syncSchemaColumns(
    sparklineColumnNames: string[],
    measureColumnNames: string[]
  ): void {
    // Actualiza los modelos de tarjetas dinámicas
    this.formattingSettings.updateSparklineCards(sparklineColumnNames);
    this.formattingSettings.updateColumnCards(measureColumnNames);

    // Si hay columnas, sincroniza el selector con la columna seleccionada actualmente
    if (this.formattingSettings.columns) {
      const selectedColumn = this.formattingSettings.columns.columnSelector
        .value.value as string;
      this.formattingSettings.handleColumnSelectorChange(selectedColumn);
    }
  }

  /**
   * Extrae y cachea las configuraciones de sparklines y columnas
   *
   * Este método prepara las configuraciones para el renderizado,
   * evitando lecturas repetidas durante la renderización.
   *
   * @param sparklineColumnNames - Columnas de sparkline para extraer
   * @param measureColumnNames - Columnas de medida para extraer
   */
  public extractSettings(
    sparklineColumnNames: string[],
    measureColumnNames: string[]
  ): void {
    // Limpia y extrae configuraciones de sparklines
    this.sparklineSettings.clear();
    sparklineColumnNames.forEach((columnName) => {
      const settings = this.formattingSettings.getSparklineSettings(columnName);
      this.sparklineSettings.set(columnName, settings);
    });

    // Limpia y extrae configuraciones de columnas de medida
    this.columnSettings.clear();
    measureColumnNames.forEach((columnName) => {
      const settings = this.formattingSettings.getColumnSettings(columnName);
      this.columnSettings.set(columnName, settings);
    });
  }

  /**
   * Retorna un objeto con todas las propiedades de formato necesarias para renderizar la tabla
   *
   * Este método aísla a Visual de la estructura interna de VisualFormattingSettingsModel,
   * permitiendo cambios futuros sin afectar la clase Visual.
   *
   * @returns Objeto con todas las propiedades de formato para la tabla
   */
  public getTableFormattingProps(): TableFormattingProps {
    const defaultColumnSettings = this.formattingSettings.getColumnSettings("");

    return {
      // General
      textSize: this.formattingSettings.general.textSize.value,
      tableStyle: this.formattingSettings.general.tableStyle.value
        .value as string,

      // Grid - Líneas horizontales
      showHorizontalLines:
        this.formattingSettings.grid.horizontalLinesGroup.showHorizontalLines
          .value,
      horizontalLineColor:
        this.formattingSettings.grid.horizontalLinesGroup.horizontalLineColor
          .value.value,
      horizontalLineWidth:
        this.formattingSettings.grid.horizontalLinesGroup.horizontalLineWidth
          .value,

      // Grid - Líneas verticales
      showVerticalLines:
        this.formattingSettings.grid.verticalLinesGroup.showVerticalLines.value,
      verticalLineColor:
        this.formattingSettings.grid.verticalLinesGroup.verticalLineColor.value
          .value,
      verticalLineWidth:
        this.formattingSettings.grid.verticalLinesGroup.verticalLineWidth.value,

      // Grid - Bordes
      borderStyle: this.formattingSettings.grid.bordersGroup.borderStyle.value
        .value as "solid" | "dashed" | "dotted" | "double",
      borderColor:
        this.formattingSettings.grid.bordersGroup.borderColor.value.value,
      borderWidth: this.formattingSettings.grid.bordersGroup.borderWidth.value,
      borderSection: this.formattingSettings.grid.bordersGroup.borderSection
        .value.value as "all" | "header" | "rows",

      // Interactividad
      rowSelection:
        this.formattingSettings.interactivity.selectionGroup.rowSelection.value,
      rowSelectionColor:
        this.formattingSettings.interactivity.selectionGroup.rowSelectionColor
          .value.value,
      sortable:
        this.formattingSettings.interactivity.featuresGroup.sortable.value,
      freezeCategories:
        this.formattingSettings.interactivity.navigationGroup.freezeCategories
          .value,
      searchable:
        this.formattingSettings.interactivity.featuresGroup.searchable.value,
      pagination:
        this.formattingSettings.interactivity.navigationGroup.pagination.value,
      rowsPerPage:
        this.formattingSettings.interactivity.navigationGroup.rowsPerPage.value,

      // Tipografía
      fontFamily: this.formattingSettings.typography.fontFamily.value
        .value as string,

      // Filas
      rowHeight:
        this.formattingSettings.rows.rowDimensionsGroup.rowHeight.value,
      alternatingRowColor:
        this.formattingSettings.rows.rowColorsGroup.alternatingRowColor.value
          .value,
      hoverBackgroundColor:
        this.formattingSettings.rows.rowEffectsGroup.hoverBackgroundColor.value
          .value,
      rowPadding:
        this.formattingSettings.rows.rowDimensionsGroup.rowPadding.value,

      // Encabezados (por defecto)
      headerAlignment: defaultColumnSettings.headerAlignment as
        | "left"
        | "center"
        | "right",
      headerPadding: defaultColumnSettings.headerPadding,
      headerBold: defaultColumnSettings.headerBold,
      headerFontColor: defaultColumnSettings.headerFontColor,
      headerFontSize: defaultColumnSettings.headerFontSize,
      headerBackgroundColor: defaultColumnSettings.headerBackgroundColor,

      // Celdas (por defecto)
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

      // Configuraciones dinámicas por columna
      sparklineSettings: this.sparklineSettings,
      columnSettings: this.columnSettings,
    };
  }

  /**
   * Retorna el modelo de formato para Power BI
   *
   * Este modelo se usa en el panel de formato de Power BI Desktop.
   * Mantiene compatibilidad total con FormattingSettingsService.
   *
   * @returns Modelo de formato compatible con Power BI
   */
  public getFormattingModel(): FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(
      this.formattingSettings
    );
  }

  /**
   * Retorna las configuraciones de formato internas
   *
   * Usar solo cuando sea absolutamente necesario acceder a la estructura interna.
   * Preferir getTableFormattingProps() para mantener la abstracción.
   *
   * @returns La instancia de VisualFormattingSettingsModel
   */
  public getFormattingSettings(): VisualFormattingSettingsModel {
    return this.formattingSettings;
  }

  /**
   * Obtiene la configuración actual de una columna de sparkline
   *
   * @param columnName - Nombre de la columna
   * @returns Configuración del sparkline
   */
  public getSparklineSettings(columnName: string): SparklineColumnSettings {
    return (
      this.sparklineSettings.get(columnName) || {
        chartType: "line",
        color: "#0078D4",
        lineWidth: 1.5,
      }
    );
  }

  /**
   * Obtiene la configuración actual de una columna de medida
   *
   * @param columnName - Nombre de la columna
   * @returns Configuración de la columna
   */
  public getColumnSettings(columnName: string): ColumnConfigSettings {
    return (
      this.columnSettings.get(columnName) ||
      this.formattingSettings.getColumnSettings("") || {
        headerFontColor: "#000000",
        headerFontSize: 12,
        headerAlignment: "center",
        headerBold: true,
        headerBackgroundColor: "#F5F5F5",
        headerPadding: 8,
        cellFontColor: "#000000",
        cellFontSize: 11,
        cellAlignment: "left",
        cellBackgroundColor: "#FFFFFF",
        cellPadding: 6,
        decimalPlaces: 2,
        thousandsSeparator: true,
        prefix: "",
        suffix: "",
        columnWidth: 120,
        sortable: true,
        columnVisible: true,
      }
    );
  }
}
