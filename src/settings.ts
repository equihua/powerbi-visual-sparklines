import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import {
  GeneralCompositeCard,
  ColumnHeadersSettings,
  ValuesCard,
  TotalsSettings,
  SpecificColumnSettings,
  CellElementsSettings,
  GridSettings,
  SparklineCompositeCard,
  type SparklineColumnSettings,
} from "./settings/index";

export type { SparklineColumnSettings };

export class VisualFormattingSettingsModel extends formattingSettings.Model {
  general: GeneralCompositeCard = new GeneralCompositeCard();
  columnHeaders: ColumnHeadersSettings = new ColumnHeadersSettings();
  values: ValuesCard = new ValuesCard();
  totals: TotalsSettings = new TotalsSettings();
  specificColumn: SpecificColumnSettings = new SpecificColumnSettings();
  cellElements: CellElementsSettings = new CellElementsSettings();
  grid: GridSettings = new GridSettings();
  sparklineCard: SparklineCompositeCard | null = null;

  cards: (formattingSettings.SimpleCard | formattingSettings.CompositeCard)[] =
    [
      this.general,
      this.grid,
      this.values,
      this.columnHeaders,
      this.totals,
      this.specificColumn,
      this.cellElements,
      ...(this.sparklineCard ? [this.sparklineCard] : []),
    ];

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
      this.grid,
      this.values,
      this.columnHeaders,
      this.totals,
      this.specificColumn,
      this.cellElements,
      ...(this.sparklineCard ? [this.sparklineCard] : []),
    ];
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
