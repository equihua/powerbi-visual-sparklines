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
} from "../settings";
import { TableViewModel } from "../visualViewModel";
import { generateHash } from "../utils/memoization";
import { getPresetForStyle, TableStylePreset } from "../constants/stylePresets";
import { TableStyle } from "../constants/visualDefaults";

/**
 * Configuración tipada para columnas de sparkline
 * Extraída de SparklineColumnSettings para mayor claridad
 */
export interface SparklineColumnConfig {
  chartType: string;
  color: string;
  lineWidth: number;
}

/**
 * Configuración tipada para columnas de valor
 * Agrupa propiedades de formato, alineación y numeración
 */
export interface ValueColumnConfig {
  // Propiedades de header
  headerBackgroundColor: string;
  headerPadding: number;

  // Propiedades de celda
  cellBackgroundColor: string;
  cellPadding: number;
  cellFontColor: string;
  cellFontSize: number;

  // Formato de números
  decimalPlaces: number;
  thousandsSeparator: boolean;
  prefix: string;
  suffix: string;
}

/**
 * Interfaz que define las propiedades necesarias para renderizar la tabla
 * Aísla a Visual de la estructura interna de VisualFormattingSettingsModel
 * @deprecated Usar getSimplifiedProps() en su lugar
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
  sparklineSettings: Map<string, SparklineColumnConfig>;
  columnSettings: Map<string, ValueColumnConfig>;
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
  private sparklineSettings: Map<string, SparklineColumnConfig>;
  private valueSettings: Map<string, ValueColumnConfig>;

  // Estado para memoización
  private lastSchemaHash: string = "";
  private detectedSparklineColumns: string[] = [];
  private detectedValueColumns: string[] = [];

  constructor() {
    this.formattingSettingsService = new FormattingSettingsService();
    this.formattingSettings = new VisualFormattingSettingsModel();
    this.sparklineSettings = new Map();
    this.valueSettings = new Map();
  }

  /**
   * Inicializa las configuraciones de formato a partir de un DataView y ViewModel
   *
   * Este método sincroniza automáticamente:
   * 1. Pobla las configuraciones desde el DataView usando FormattingSettingsService
   * 2. Detecta columnas de sparkline vs valor desde el ViewModel
   * 3. Actualiza los esquemas dinámicos de sparklines
   * 4. Sincroniza selectores de columnas
   * 5. Extrae configuraciones en Maps tipadas
   *
   * @param dataView - DataView de Power BI con las configuraciones
   * @param viewModel - ViewModel con la estructura de datos
   */
  public initializeSettings(
    dataView: DataView,
    viewModel: TableViewModel,
  ): void {
    // 1. Popula desde DataView usando el servicio de Power BI
    this.formattingSettings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        VisualFormattingSettingsModel,
        dataView,
      );

    // 2. Detecta columnas automáticamente desde el viewModel
    const { sparklineColumnNames, measureColumnNames } =
      this.detectColumns(viewModel);

    this.detectedSparklineColumns = sparklineColumnNames;
    this.detectedValueColumns = measureColumnNames;

    // 3. Sincroniza los esquemas dinámicos
    this.syncSchemaColumns(sparklineColumnNames, measureColumnNames);

    // 4. Extrae las configuraciones
    this.extractSettings(sparklineColumnNames, measureColumnNames);

    // 5. Aplica preset completo si hay un estilo seleccionado
    const styleValue = this.formattingSettings.general?.styleGroup?.tableStyle
      ?.value?.value as TableStyle | string | undefined;
    if (styleValue) {
      this.applyTableStylePreset(styleValue);
    }
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
    measureColumnNames: string[],
  ): void {
    // Actualiza los modelos de tarjetas dinámicas
    this.formattingSettings.updateSparklineCards(sparklineColumnNames);

    // Sincroniza los selectores de columnas con la lista de columnas de valor
    if (this.formattingSettings.specificColumn) {
      this.formattingSettings.specificColumn.updateColumnList(
        measureColumnNames,
      );
    }

    if (this.formattingSettings.cellElements) {
      this.formattingSettings.cellElements.updateColumnList(measureColumnNames);
    }
  }

  /**
   * Detecta automáticamente columnas de sparkline vs columnas de valor
   *
   * Analiza el primer row del viewModel para identificar objetos sparkline
   * (que contienen propiedades Nombre, Axis, Values) vs columnas de valor normales.
   *
   * @param viewModel - ViewModel con datos
   * @returns DetectedColumns con listas de ambos tipos
   */
  private detectColumns(viewModel: TableViewModel): DetectedColumns {
    if (!viewModel.rows || viewModel.rows.length === 0) {
      return { sparklineColumnNames: [], measureColumnNames: [] };
    }

    const firstRow = viewModel.rows[0];
    const sparklineColumnNames: string[] = [];
    const allColumnNames = Object.keys(firstRow);

    // Identifica columnas de sparkline por su estructura
    allColumnNames.forEach((key) => {
      const value = firstRow[key];
      if (
        value &&
        typeof value === "object" &&
        "Nombre" in value &&
        "Axis" in value &&
        "Values" in value
      ) {
        sparklineColumnNames.push(key);
      }
    });

    // Las columnas de valor son todas las demás
    const measureColumnNames = allColumnNames.filter(
      (col) => sparklineColumnNames.indexOf(col) === -1,
    );

    return { sparklineColumnNames, measureColumnNames };
  }

  /**
   * Extrae y cachea las configuraciones de sparklines y valores
   *
   * Este método prepara las configuraciones tipadas para el renderizado,
   * evitando lecturas repetidas durante la renderización.
   * Usa memoización para evitar re-extracciones cuando el esquema no cambia.
   *
   * @param sparklineColumnNames - Columnas de sparkline para extraer
   * @param measureColumnNames - Columnas de medida para extraer
   */
  public extractSettings(
    sparklineColumnNames: string[],
    measureColumnNames: string[],
  ): void {
    // Genera hash para memoización
    const currentSchemaHash = generateHash({
      sparklines: sparklineColumnNames.sort(),
      values: measureColumnNames.sort(),
    });

    // Si el esquema no cambió, no re-extraemos
    if (
      this.lastSchemaHash === currentSchemaHash &&
      this.sparklineSettings.size > 0
    ) {
      return;
    }

    this.lastSchemaHash = currentSchemaHash;

    // Extrae configuraciones de sparklines
    this.sparklineSettings.clear();
    sparklineColumnNames.forEach((columnName) => {
      const settings = this.formattingSettings.getSparklineSettings(columnName);
      this.sparklineSettings.set(columnName, {
        chartType: settings.chartType,
        color: settings.color,
        lineWidth: settings.lineWidth,
      });
    });

    // Extrae configuraciones de columnas de valor
    this.valueSettings.clear();
    measureColumnNames.forEach((columnName) => {
      const valueConfig = this.extractValueColumnConfig(columnName);
      this.valueSettings.set(columnName, valueConfig);
    });
  }

  /**
   * Extrae la configuración completa de una columna de valor
   * desde las tarjetas de formato relevantes
   *
   * @param columnName - Nombre de la columna
   * @returns ValueColumnConfig tipada
   */
  private extractValueColumnConfig(columnName: string): ValueColumnConfig {
    // Valores por defecto
    const defaults: ValueColumnConfig = {
      headerBackgroundColor: "#F5F5F5",
      headerPadding: 8,
      cellBackgroundColor: "#FFFFFF",
      cellPadding: 6,
      cellFontColor: "#000000",
      cellFontSize: 11,
      decimalPlaces: 2,
      thousandsSeparator: true,
      prefix: "",
      suffix: "",
    };

    // TODO: Extraer desde specificColumn y cellElements si están disponibles
    // Por ahora retornamos los valores por defecto
    // En futuro, agregar lógica para consultar:
    // - this.formattingSettings.specificColumn.getStyle()
    // - this.formattingSettings.values para formato de números
    // - this.formattingSettings.columnHeaders para estilos de header

    return defaults;
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
      this.formattingSettings,
    );
  }

  /**
   * Retorna las configuraciones de formato internas
   *
   * Usar solo cuando sea absolutamente necesario acceder a la estructura interna.
   * Preferir métodos específicos para mantener la abstracción.
   *
   * @returns La instancia de VisualFormattingSettingsModel
   */
  public getFormattingSettings(): VisualFormattingSettingsModel {
    return this.formattingSettings;
  }

  /**
   * Retorna la lista de columnas de sparkline detectadas
   *
   * @returns Array de nombres de columnas de sparkline
   */
  public getSparklineColumnNames(): string[] {
    return [...this.detectedSparklineColumns];
  }

  /**
   * Retorna la lista de columnas de valor detectadas
   *
   * @returns Array de nombres de columnas de valor
   */
  public getValueColumnNames(): string[] {
    return [...this.detectedValueColumns];
  }

  /**
   * Detecta si el esquema ha cambiado comparando hashes
   *
   * Útil para optimización: solo re-renderizar si el esquema cambió.
   *
   * @param viewModel - Nuevo viewModel para comparar
   * @returns true si el esquema cambió
   */
  public hasSchemaChanged(viewModel: TableViewModel): boolean {
    const { sparklineColumnNames, measureColumnNames } =
      this.detectColumns(viewModel);

    const newHash = generateHash({
      sparklines: sparklineColumnNames.sort(),
      values: measureColumnNames.sort(),
    });

    return this.lastSchemaHash !== newHash;
  }

  /**
   * Obtiene la configuración actual de una columna de sparkline
   *
   * @param columnName - Nombre de la columna
   * @returns Configuración del sparkline
   */
  public getSparklineSettings(columnName: string): SparklineColumnConfig {
    return (
      this.sparklineSettings.get(columnName) || {
        chartType: "line",
        color: "#0078D4",
        lineWidth: 1.5,
      }
    );
  }

  /**
   * Obtiene el Map completo de configuraciones de sparklines
   *
   * @returns Map con todas las configuraciones de sparklines
   */
  public getSparklineSettingsMap(): Map<string, SparklineColumnConfig> {
    return new Map(this.sparklineSettings);
  }

  /**
   * Obtiene la configuración actual de una columna de valor
   *
   * @param columnName - Nombre de la columna
   * @returns Configuración de la columna
   */
  public getValueSettings(columnName: string): ValueColumnConfig {
    return (
      this.valueSettings.get(columnName) || {
        headerBackgroundColor: "#F5F5F5",
        headerPadding: 8,
        cellBackgroundColor: "#FFFFFF",
        cellPadding: 6,
        cellFontColor: "#000000",
        cellFontSize: 11,
        decimalPlaces: 2,
        thousandsSeparator: true,
        prefix: "",
        suffix: "",
      }
    );
  }

  /**
   * Interfaz simplificada que expone solo lo necesario para renderizar
   *
   * Aísla completamente a Visual de la estructura interna de VisualFormattingSettingsModel.
   * Este es el método preferido para obtener configuraciones.
   *
   * @returns Objeto con solo las propiedades/tarjetas necesarias para render
   */
  public getSimplifiedProps() {
    return {
      sparklineSettings: this.sparklineSettings,
      valueSettings: this.valueSettings,
      general: this.formattingSettings.general,
      grid: this.formattingSettings.grid,
      columnHeaders: this.formattingSettings.columnHeaders,
      values: this.formattingSettings.values,
      totals: this.formattingSettings.totals,
    };
  }

  /**
   * Aplica un preset de estilo de tabla completo sobre el modelo interno
   *
   * @param style - Nombre del estilo (TableStyle)
   */
  public applyTableStylePreset(style: TableStyle | string): void {
    const preset = getPresetForStyle(style);
    if (!preset) return;
    this.setSettings(preset);
  }

  /**
   * setSettings: actualiza valores de todas las tarjetas según un objeto preset
   *
   * Este método permite aplicar un conjunto completo de propiedades de una sola vez,
   * ideal para presets de estilo. No persiste en Power BI; afecta el modelo en memoria.
   */
  public setSettings(preset: TableStylePreset): void {
    const fs = this.formattingSettings;

    // General
    if (preset.general && fs.general) {
      const g = fs.general;
      if (preset.general.selection) {
        const s = preset.general.selection;
        if (typeof s.rowSelection === "boolean")
          g.selectionGroup.rowSelection.value = s.rowSelection;
        if (typeof s.rowSelectionColor === "string")
          g.selectionGroup.rowSelectionColor.value = {
            value: s.rowSelectionColor,
          } as any;
      }
      if (preset.general.navigation) {
        const n = preset.general.navigation;
        if (typeof n.pagination === "boolean")
          g.navigationGroup.pagination.value = n.pagination;
        if (typeof n.rowsPerPage === "number")
          g.navigationGroup.rowsPerPage.value = n.rowsPerPage;
        if (typeof n.scrollBehavior === "string")
          g.navigationGroup.scrollBehavior.value = {
            value: n.scrollBehavior,
            displayName: "",
          } as any;
      }
      if (preset.general.features) {
        const f = preset.general.features;
        if (typeof f.searchable === "boolean")
          g.featuresGroup.searchable.value = f.searchable;
        if (typeof f.sortable === "boolean")
          g.featuresGroup.sortable.value = f.sortable;
        if (typeof f.columnReorder === "boolean")
          g.featuresGroup.columnReorder.value = f.columnReorder;
        if (typeof f.columnResize === "boolean")
          g.featuresGroup.columnResize.value = f.columnResize;
      }
    }

    // Grid
    if (preset.grid && fs.grid) {
      const grid = fs.grid;
      if (preset.grid.gridlinesCard) {
        const gl = preset.grid.gridlinesCard;
        if (typeof gl.showHorizontal === "boolean")
          grid.gridlinesCard.showHorizontal.value = gl.showHorizontal;
        if (typeof gl.gridHorizontalColor === "string")
          grid.gridlinesCard.gridHorizontalColor.value = {
            value: gl.gridHorizontalColor,
          } as any;
        if (typeof gl.gridHorizontalWeight === "number")
          grid.gridlinesCard.gridHorizontalWeight.value =
            gl.gridHorizontalWeight;
        if (typeof gl.showVertical === "boolean")
          grid.gridlinesCard.showVertical.value = gl.showVertical;
        if (typeof gl.gridVerticalColor === "string")
          grid.gridlinesCard.gridVerticalColor.value = {
            value: gl.gridVerticalColor,
          } as any;
        if (typeof gl.gridVerticalWeight === "number")
          grid.gridlinesCard.gridVerticalWeight.value = gl.gridVerticalWeight;
      }
      if (preset.grid.borderCard) {
        const b = preset.grid.borderCard;
        if (typeof b.borderSection === "string")
          grid.borderCard.borderSection.value = {
            value: b.borderSection,
            displayName: "",
          } as any;
        if (typeof b.borderTop === "boolean")
          grid.borderCard.borderTop.value = b.borderTop;
        if (typeof b.borderBottom === "boolean")
          grid.borderCard.borderBottom.value = b.borderBottom;
        if (typeof b.borderLeft === "boolean")
          grid.borderCard.borderLeft.value = b.borderLeft;
        if (typeof b.borderRight === "boolean")
          grid.borderCard.borderRight.value = b.borderRight;
        if (typeof b.borderColor === "string")
          grid.borderCard.borderColor.value = { value: b.borderColor } as any;
        if (typeof b.borderWeight === "number")
          grid.borderCard.borderWeight.value = b.borderWeight;
      }
      if (preset.grid.optionsCard) {
        const o = preset.grid.optionsCard;
        if (typeof o.rowPadding === "number")
          grid.optionsCard.rowPadding.value = o.rowPadding;
        if (typeof o.globalFontSize === "number")
          grid.optionsCard.globalFontSize.value = o.globalFontSize;
      }
    }

    // Column Headers
    if (preset.columnHeaders && fs.columnHeaders) {
      const ch = fs.columnHeaders;
      const p = preset.columnHeaders;
      if (typeof p.fontFamily === "string")
        ch.textGroup.font.fontFamily.value = p.fontFamily as any;
      if (typeof p.fontSize === "number")
        ch.textGroup.font.fontSize.value = p.fontSize;
      if (typeof p.bold === "boolean") ch.textGroup.font.bold.value = p.bold;
      if (typeof p.italic === "boolean")
        ch.textGroup.font.italic.value = p.italic;
      if (typeof p.underline === "boolean")
        ch.textGroup.font.underline.value = p.underline;
      if (typeof p.textColor === "string")
        ch.textGroup.textColor.value = { value: p.textColor } as any;
      if (typeof p.backgroundColor === "string")
        ch.textGroup.backgroundColor.value = {
          value: p.backgroundColor,
        } as any;
      if (typeof p.alignment === "string")
        ch.textGroup.alignment.value = p.alignment as any;
      if (typeof p.wrapText === "boolean")
        ch.textGroup.wrapText.value = p.wrapText;
      if (typeof p.autoSizeWidth === "boolean")
        ch.optionsGroup.autoSizeWidth.value = p.autoSizeWidth;
      if (typeof p.resizeBehavior === "string")
        ch.optionsGroup.resizeBehavior.value = {
          value: p.resizeBehavior,
          displayName: "",
        } as any;
    }

    // Values
    if (preset.values && fs.values) {
      const v = fs.values;
      const p = preset.values;
      if (typeof p.fontFamily === "string")
        v.font.fontFamily.value = p.fontFamily as any;
      if (typeof p.fontSize === "number") v.font.fontSize.value = p.fontSize;
      if (typeof p.bold === "boolean") v.font.bold.value = p.bold;
      if (typeof p.italic === "boolean") v.font.italic.value = p.italic;
      if (typeof p.underline === "boolean")
        v.font.underline.value = p.underline;
      if (typeof p.textColor === "string")
        v.textColor.value = { value: p.textColor } as any;
      if (typeof p.backgroundColor === "string")
        v.backgroundColor.value = { value: p.backgroundColor } as any;
      if (typeof p.alternateTextColor === "string")
        v.alternateTextColor.value = { value: p.alternateTextColor } as any;
      if (typeof p.alternateBackgroundColor === "string")
        v.alternateBackgroundColor.value = {
          value: p.alternateBackgroundColor,
        } as any;
      if (typeof p.alignment === "string")
        v.alignment.value = p.alignment as any;
      if (typeof p.wrapText === "boolean") v.wrapText.value = p.wrapText;
    }

    // Totals
    if (preset.totals && fs.totals) {
      const t = fs.totals;
      const p = preset.totals;
      if (typeof p.show === "boolean") t.show.value = p.show;
      if (typeof p.label === "string") t.label.value = p.label;
      if (typeof p.fontFamily === "string")
        t.font.fontFamily.value = p.fontFamily as any;
      if (typeof p.fontSize === "number") t.font.fontSize.value = p.fontSize;
      if (typeof p.bold === "boolean") t.font.bold.value = p.bold;
      if (typeof p.italic === "boolean") t.font.italic.value = p.italic;
      if (typeof p.underline === "boolean")
        t.font.underline.value = p.underline;
      if (typeof p.textColor === "string")
        t.textColor.value = { value: p.textColor } as any;
      if (typeof p.backgroundColor === "string")
        t.backgroundColor.value = { value: p.backgroundColor } as any;
    }

    // Tras aplicar, volvemos a extraer configs para cache coherente
    this.extractSettings(
      this.detectedSparklineColumns,
      this.detectedValueColumns,
    );
  }
}
