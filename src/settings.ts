import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { GeneralSettings } from "./settings/general";
import { GridSettings } from "./settings/grid";
import { RowsSettings } from "./settings/rows";
import { InteractivitySettings } from "./settings/interactivity";
import {
  CategoryColumnSettings,
  CategoryCellSettings,
  ColumnHeaderSettings,
  MeasureColumnSettings,
} from "./settings/columns";
import { CellFormattingSettings, MeasureCellSettings } from "./settings/cells";
import {
  HeaderFormattingSettings,
  HeaderAdvancedSettings,
} from "./settings/headers";
import { TypographySettings } from "./settings/typography";
import { AdvancedBordersSettings } from "./settings/borders";
import { SpacingSettings } from "./settings/spacing";
import { VisualEffectsSettings } from "./settings/effects";
import { NumberFormattingSettings } from "./settings/numbers";
import { TotalSettings } from "./settings/totals";
import {
  SparklineCompositeCard,
  type SparklineColumnSettings,
} from "./settings/sparkline";

// Re-exportar tipos necesarios para otros módulos
export type { SparklineColumnSettings };

/**
 * Modelo principal de configuración de formato para el visual.
 * Orquesta todas las tarjetas de formato individual en una interfaz única.
 */
export class VisualFormattingSettingsModel extends formattingSettings.Model {
  general: GeneralSettings = new GeneralSettings();
  grid: GridSettings = new GridSettings();
  rows: RowsSettings = new RowsSettings();
  categoryColumn: CategoryColumnSettings = new CategoryColumnSettings();
  categoryCell: CategoryCellSettings = new CategoryCellSettings();
  cellFormatting: CellFormattingSettings = new CellFormattingSettings();
  headerFormatting: HeaderFormattingSettings = new HeaderFormattingSettings();
  columnHeader: ColumnHeaderSettings = new ColumnHeaderSettings();
  measureColumn: MeasureColumnSettings = new MeasureColumnSettings();
  measureCell: MeasureCellSettings = new MeasureCellSettings();
  typography: TypographySettings = new TypographySettings();
  advancedBorders: AdvancedBordersSettings = new AdvancedBordersSettings();
  spacing: SpacingSettings = new SpacingSettings();
  headerAdvanced: HeaderAdvancedSettings = new HeaderAdvancedSettings();
  visualEffects: VisualEffectsSettings = new VisualEffectsSettings();
  numberFormatting: NumberFormattingSettings = new NumberFormattingSettings();
  total: TotalSettings = new TotalSettings();
  interactivity: InteractivitySettings = new InteractivitySettings();
  sparklineCard: SparklineCompositeCard | null = null;

  cards: (formattingSettings.SimpleCard | formattingSettings.CompositeCard)[] =
    [
      this.general,
      this.grid,
      this.rows,
      this.categoryColumn,
      this.categoryCell,
      this.cellFormatting,
      this.headerFormatting,
      this.columnHeader,
      this.measureColumn,
      this.measureCell,
      this.typography,
      this.advancedBorders,
      this.spacing,
      this.headerAdvanced,
      this.visualEffects,
      this.numberFormatting,
      this.total,
      this.interactivity,
    ];

  public updateSparklineCards(sparklineColumnNames: string[]): void {
    if (sparklineColumnNames && sparklineColumnNames.length > 0) {
      this.sparklineCard = new SparklineCompositeCard(sparklineColumnNames);
      this.cards = [
        this.general,
        this.grid,
        this.rows,
        this.categoryColumn,
        this.categoryCell,
        this.cellFormatting,
        this.headerFormatting,
        this.measureColumn,
        this.measureCell,
        this.typography,
        this.advancedBorders,
        this.spacing,
        this.headerAdvanced,
        this.visualEffects,
        this.numberFormatting,
        this.interactivity,
        this.sparklineCard,
      ];
    } else {
      this.sparklineCard = null;
      this.cards = [
        this.general,
        this.grid,
        this.rows,
        this.categoryColumn,
        this.categoryCell,
        this.cellFormatting,
        this.headerFormatting,
        this.measureColumn,
        this.measureCell,
        this.typography,
        this.advancedBorders,
        this.spacing,
        this.headerAdvanced,
        this.visualEffects,
        this.numberFormatting,
        this.interactivity,
      ];
    }
  }

  public getSparklineSettings(columnName: string): SparklineColumnSettings {
    if (this.sparklineCard) {
      return this.sparklineCard.getSettings(columnName);
    }
    return {
      chartType: "line",
      color: "#0078D4",
      lineWidth: 1.5,
    };
  }

  public setSparklineSettings(
    columnName: string,
    settings: SparklineColumnSettings
  ): void {
    this.sparklineCard?.setSettings(columnName, settings);
  }
}
