import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import {
  GeneralSettings,
  GridSettings,
  RowsSettings,
  InteractivitySettings,
  ColumnSettings,
  TypographySettings,
  TotalSettings,
  SparklineCompositeCard,
  type ColumnConfigSettings,
  type SparklineColumnSettings,
} from "./settings/index";

export type { SparklineColumnSettings, ColumnConfigSettings };

export class VisualFormattingSettingsModel extends formattingSettings.Model {
  general: GeneralSettings = new GeneralSettings();
  typography: TypographySettings = new TypographySettings();
  interactivity: InteractivitySettings = new InteractivitySettings();
  grid: GridSettings = new GridSettings();
  rows: RowsSettings = new RowsSettings();
  columns: ColumnSettings | null = null;
  total: TotalSettings = new TotalSettings();
  sparklineCard: SparklineCompositeCard | null = null;

  cards: (formattingSettings.SimpleCard | formattingSettings.CompositeCard)[] =
    [
      this.general,
      this.typography,
      this.rows,
      this.grid,
      this.interactivity,
      this.total,
    ];

  public updateColumnCards(measureColumnNames: string[]): void {
    if (measureColumnNames && measureColumnNames.length > 0) {
      if (!this.columns) {
        this.columns = new ColumnSettings(measureColumnNames);
        this.rebuildCards();
      } else {
        const existingColumns = this.columns.getAllMeasureColumnNames();
        const columnsChanged =
          existingColumns.length !== measureColumnNames.length ||
          existingColumns.some((col, idx) => col !== measureColumnNames[idx]);

        if (columnsChanged) {
          this.columns = new ColumnSettings(measureColumnNames);
          this.rebuildCards();
        }
      }
    } else {
      this.columns = null;
      this.rebuildCards();
    }
  }

  public handleColumnSelectorChange(selectedColumn: string): void {
    if (this.columns) {
      this.columns.switchToColumn(selectedColumn);
    }
  }

  public getCurrentSelectedColumn(): string {
    return this.columns?.getCurrentSelectedColumn() || "__ALL__";
  }

  public updateSparklineCards(sparklineColumnNames: string[]): void {
    if (sparklineColumnNames && sparklineColumnNames.length > 0) {
      this.sparklineCard = new SparklineCompositeCard(sparklineColumnNames);
      this.rebuildCards();
    } else {
      this.sparklineCard = null;
      this.rebuildCards();
    }
  }

  private rebuildCards(): void {
    this.cards = [
      this.general,
      this.typography,
      ...(this.columns ? [this.columns] : []),
      this.rows,
      this.grid,
      this.interactivity,
      this.total,
      ...(this.sparklineCard ? [this.sparklineCard] : []),
    ];
  }

  public getColumnSettings(columnName: string): ColumnConfigSettings {
    if (this.columns) {
      return this.columns.getSettings(columnName);
    }
    return {
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
    };
  }

  public getAllColumnsSettings(): ColumnConfigSettings {
    return this.getColumnSettings("__ALL__");
  }

  public getColumnSettingsMap(): Map<string, ColumnConfigSettings> {
    const settingsMap = new Map<string, ColumnConfigSettings>();

    if (this.columns) {
      const measureColumns = this.columns.getAllMeasureColumnNames();
      measureColumns.forEach((columnName) => {
        settingsMap.set(columnName, this.columns.getSettings(columnName));
      });
    }

    return settingsMap;
  }

  public setColumnSettings(
    columnName: string,
    settings: ColumnConfigSettings
  ): void {
    this.columns?.setSettings(columnName, settings);
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
