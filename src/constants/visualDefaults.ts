/**
 * Constantes centralizadas para el visual de Power BI
 * Este archivo contiene todos los valores predeterminados, opciones de enumeración y constantes
 * utilizados en las configuraciones del visual para evitar duplicación.
 */

import powerbi from "powerbi-visuals-api";

// ============================================================================
// ENUMERACIONES Y OPCIONES
// ============================================================================

/**
 * Tipos de gráficos sparkline disponibles
 */
export enum SparklineChartType {
  Line = "line",
  Bar = "bar",
  Area = "area",
  Pie = "pie",
  Donut = "donut",
}

/**
 * Opciones de tipos de gráfico para dropdowns
 */
export const SPARKLINE_CHART_TYPE_OPTIONS = [
  { value: SparklineChartType.Line, displayName: "Línea" },
  { value: SparklineChartType.Bar, displayName: "Barras" },
  { value: SparklineChartType.Area, displayName: "Área" },
  { value: SparklineChartType.Pie, displayName: "Circular" },
  { value: SparklineChartType.Donut, displayName: "Anillo" },
] as const;

/**
 * Estilos de tabla disponibles
 */
export enum TableStyle {
  Default = "default",
  Striped = "striped",
  Bordered = "bordered",
  Hover = "hover",
}

/**
 * Opciones de estilos de tabla para dropdowns
 */
export const TABLE_STYLE_OPTIONS = [
  { value: TableStyle.Default, displayName: "Predeterminado" },
  { value: TableStyle.Striped, displayName: "A rayas" },
  { value: TableStyle.Bordered, displayName: "Con bordes" },
  { value: TableStyle.Hover, displayName: "Al pasar el ratón" },
] as const;

/**
 * Opciones de alineación de texto
 */
export enum TextAlignment {
  Left = "left",
  Center = "center",
  Right = "right",
}

/**
 * Opciones de alineación para dropdowns
 */
export const TEXT_ALIGNMENT_OPTIONS = [
  { value: TextAlignment.Left, displayName: "Izquierda" },
  { value: TextAlignment.Center, displayName: "Centro" },
  { value: TextAlignment.Right, displayName: "Derecha" },
] as const;

/**
 * Familias de fuentes disponibles
 */
export enum FontFamily {
  Arial = "Arial, sans-serif",
  Verdana = "Verdana, sans-serif",
  Georgia = "Georgia, serif",
  CourierNew = "Courier New, monospace",
  SegoeUI = "Segoe UI, sans-serif",
  Tahoma = "Tahoma, sans-serif",
  TimesNewRoman = "Times New Roman, serif",
}

/**
 * Opciones de familias de fuente para dropdowns
 */
export const FONT_FAMILY_OPTIONS = [
  { value: FontFamily.Arial, displayName: "Arial" },
  { value: FontFamily.Verdana, displayName: "Verdana" },
  { value: FontFamily.Georgia, displayName: "Georgia" },
  { value: FontFamily.CourierNew, displayName: "Courier" },
  { value: FontFamily.SegoeUI, displayName: "Segoe UI" },
  { value: FontFamily.Tahoma, displayName: "Tahoma" },
  { value: FontFamily.TimesNewRoman, displayName: "Times New Roman" },
] as const;

/**
 * Estilos de borde disponibles
 */
export enum BorderStyle {
  Solid = "solid",
  Dashed = "dashed",
  Dotted = "dotted",
  Double = "double",
}

/**
 * Opciones de estilos de borde para dropdowns
 */
export const BORDER_STYLE_OPTIONS = [
  { value: BorderStyle.Solid, displayName: "Sólido" },
  { value: BorderStyle.Dashed, displayName: "Guionado" },
  { value: BorderStyle.Dotted, displayName: "Punteado" },
  { value: BorderStyle.Double, displayName: "Doble" },
] as const;

/**
 * Secciones donde aplicar bordes
 */
export enum BorderSection {
  All = "all",
  Header = "header",
  Rows = "rows",
}

/**
 * Opciones de secciones de borde para dropdowns
 */
export const BORDER_SECTION_OPTIONS = [
  { value: BorderSection.All, displayName: "Todas" },
  { value: BorderSection.Header, displayName: "Encabezado" },
  { value: BorderSection.Rows, displayName: "Filas" },
] as const;

/**
 * Comportamientos de scroll disponibles
 */
export enum ScrollBehavior {
  Smooth = "smooth",
  Auto = "auto",
}

/**
 * Opciones de comportamiento de scroll para dropdowns
 */
export const SCROLL_BEHAVIOR_OPTIONS = [
  { value: ScrollBehavior.Smooth, displayName: "Suave" },
  { value: ScrollBehavior.Auto, displayName: "Automático" },
] as const;

// ============================================================================
// COLORES PREDETERMINADOS
// ============================================================================

/**
 * Colores predeterminados para el visual
 */
export const DEFAULT_COLORS = {
  // Colores de texto
  primaryText: "#000000",
  secondaryText: "#666666",

  // Colores de fondo
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  alternatingRow: "#f9f9f9",
  hoverBackground: "#f0f7ff",

  // Colores de borde y líneas
  borderGray: "#E0E0E0",
  lineGray: "#E0E0E0",
  shadowGray: "#00000020",

  // Colores de acento
  primaryBlue: "#0078D4",
  selectionBlue: "#CCE4F7",
} as const;

// ============================================================================
// VALORES PREDETERMINADOS - TIPOGRAFÍA
// ============================================================================

export const TYPOGRAPHY_DEFAULTS = {
  fontFamily: FontFamily.SegoeUI,
  fontSize: 11,
  fontColor: DEFAULT_COLORS.primaryText,
  lineHeight: 1.4,
  letterSpacing: 0,
  bold: false,
  italic: false,
} as const;

// ============================================================================
// VALORES PREDETERMINADOS - SPARKLINE
// ============================================================================

export const SPARKLINE_DEFAULTS = {
  chartType: SparklineChartType.Line,
  color: DEFAULT_COLORS.primaryBlue,
  lineWidth: 1.5,
  lineWidthMin: 0.5,
  lineWidthMax: 10,
} as const;

// ============================================================================
// VALORES PREDETERMINADOS - TABLA GENERAL
// ============================================================================

export const GENERAL_DEFAULTS = {
  tableStyle: TableStyle.Default,
  textSize: 12,
  textSizeMin: 8,
  textSizeMax: 40,
} as const;

// ============================================================================
// VALORES PREDETERMINADOS - COLUMNAS
// ============================================================================

export const COLUMN_DEFAULTS = {
  // Encabezado
  headerFontColor: DEFAULT_COLORS.primaryText,
  headerFontSize: 12,
  headerAlignment: TextAlignment.Center,
  headerBold: true,
  headerBackgroundColor: DEFAULT_COLORS.lightGray,
  headerPadding: 8,

  // Celda
  cellFontColor: DEFAULT_COLORS.primaryText,
  cellFontSize: 11,
  cellAlignment: TextAlignment.Left,
  cellBackgroundColor: DEFAULT_COLORS.white,
  cellPadding: 6,

  // Formato de números
  decimalPlaces: 2,
  thousandsSeparator: true,
  prefix: "",
  suffix: "",

  // Propiedades de columna
  columnWidth: 100,
  sortable: true,
  columnVisible: true,
} as const;

// ============================================================================
// VALORES PREDETERMINADOS - FILAS
// ============================================================================

export const ROW_DEFAULTS = {
  rowHeight: 28,
  rowPadding: 6,
  alternatingRowColor: DEFAULT_COLORS.alternatingRow,
  hoverBackgroundColor: DEFAULT_COLORS.hoverBackground,
} as const;

// ============================================================================
// VALORES PREDETERMINADOS - GRID Y BORDES
// ============================================================================

export const GRID_DEFAULTS = {
  // Líneas horizontales
  showHorizontalLines: true,
  horizontalLineColor: DEFAULT_COLORS.lineGray,
  horizontalLineWidth: 1,

  // Líneas verticales
  showVerticalLines: false,
  verticalLineColor: DEFAULT_COLORS.lineGray,
  verticalLineWidth: 1,

  // Bordes
  borderSection: BorderSection.All,
  borderTop: false,
  borderBottom: true,
  borderLeft: false,
  borderRight: false,
  borderColor: DEFAULT_COLORS.borderGray,
  borderWidth: 1,
  borderStyle: BorderStyle.Solid,
  borderRadius: 0,

  // Sombras
  shadowBorder: false,
  shadowColor: DEFAULT_COLORS.shadowGray,

  // Espaciado
  rowSpacing: 6,
} as const;

// ============================================================================
// VALORES PREDETERMINADOS - INTERACTIVIDAD
// ============================================================================

export const INTERACTIVITY_DEFAULTS = {
  freezeCategories: false,
  rowSelection: true,
  rowSelectionColor: DEFAULT_COLORS.selectionBlue,
  pagination: false,
  rowsPerPage: 10,
  searchable: false,
  sortable: true,
  scrollBehavior: ScrollBehavior.Smooth,
} as const;

// ============================================================================
// VALIDADORES DE POWERBI
// ============================================================================

/**
 * Configuraciones de validadores comunes de Power BI
 */
export const VALIDATORS = {
  textSize: {
    min: { value: 8, type: powerbi.visuals.ValidatorType.Min },
    max: { value: 40, type: powerbi.visuals.ValidatorType.Max },
  },
  lineWidth: {
    min: { value: 0.5, type: powerbi.visuals.ValidatorType.Min },
    max: { value: 10, type: powerbi.visuals.ValidatorType.Max },
  },
} as const;

// ============================================================================
// LÍMITES DE DATOS
// ============================================================================

/**
 * Límites máximos para roles de datos
 */
export const DATA_ROLE_LIMITS = {
  mainCategory: 1,
  axis: 1,
  measure: 10,
  sparkline: 5,
  dataVolume: 2,
} as const;
