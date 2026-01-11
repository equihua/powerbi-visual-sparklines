/**
 * Módulo de configuraciones de formato.
 * Exporta un único objeto que contiene todas las clases de configuración.
 */

// Importar todas las clases
import { GeneralSettings } from "./general";
import { GridSettings } from "./grid";
import { RowsSettings } from "./rows";
import { InteractivitySettings } from "./interactivity";
import {
  CategoryColumnSettings,
  CategoryCellSettings,
  ColumnHeaderSettings,
  MeasureColumnSettings,
} from "./columns";
import { CellFormattingSettings, MeasureCellSettings } from "./cells";
import { HeaderFormattingSettings, HeaderAdvancedSettings } from "./headers";
import { TypographySettings } from "./typography";
import { AdvancedBordersSettings } from "./borders";
import { SpacingSettings } from "./spacing";
import { VisualEffectsSettings } from "./effects";
import { NumberFormattingSettings } from "./numbers";
import { TotalSettings } from "./totals";
import {
  SparklineCompositeCard,
  type SparklineColumnSettings,
} from "./sparkline";

/**
 * Objeto que agrupa todas las clases de configuración de formato.
 * Proporciona un punto de entrada único para todas las configuraciones.
 */
export const Settings = {
  // Configuraciones básicas
  GeneralSettings,
  GridSettings,
  RowsSettings,
  InteractivitySettings,

  // Configuraciones de columnas
  CategoryColumnSettings,
  CategoryCellSettings,
  ColumnHeaderSettings,
  MeasureColumnSettings,

  // Configuraciones de celdas
  CellFormattingSettings,
  MeasureCellSettings,

  // Configuraciones de encabezados
  HeaderFormattingSettings,
  HeaderAdvancedSettings,

  // Configuraciones de estilo
  TypographySettings,
  AdvancedBordersSettings,
  SpacingSettings,
  VisualEffectsSettings,

  // Configuraciones numéricas y totales
  NumberFormattingSettings,
  TotalSettings,

  // Configuraciones de sparkline
  SparklineCompositeCard,
};

// Exportar tipos
export type { SparklineColumnSettings };
