import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

/**
 * Interface para configuraciones de columna sparkline.
 * Define tipo de gráfico, color y grosor de línea.
 */
export interface SparklineColumnSettings {
  chartType: string;
  color: string;
  lineWidth: number;
}

class SparklineColumnGroup extends formattingSettings.Group {
  chartType = new formattingSettings.ItemDropdown({
    name: "chartType",
    displayName: "Tipo de gráfico",
    items: [
      { value: "line", displayName: "Línea" },
      { value: "bar", displayName: "Barras" },
      { value: "area", displayName: "Área" },
      { value: "pie", displayName: "Circular" },
      { value: "donut", displayName: "Anillo" },
    ],
    value: { value: "line", displayName: "Línea" },
  });

  color = new formattingSettings.ColorPicker({
    name: "color",
    displayName: "Color",
    value: { value: "#0078D4" },
  });

  lineWidth = new formattingSettings.NumUpDown({
    name: "lineWidth",
    displayName: "Grosor de línea",
    value: 1.5,
    options: {
      minValue: { value: 0.5, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  constructor(name: string, displayName: string) {
    super({
      name: name,
      displayName: displayName,
      slices: [],
    });
    this.slices = [this.chartType, this.color, this.lineWidth];
  }
}

export class SparklineCompositeCard extends formattingSettings.CompositeCard {
  name: string = "sparklineColumn";
  displayName: string = "Minigráficos";
  groups: SparklineColumnGroup[] = [];
  private columnKeyMap: Map<string, SparklineColumnGroup> = new Map();

  constructor(sparklineColumnNames: string[]) {
    super();
    this.groups = sparklineColumnNames.map((columnName) => {
      const groupName = `sparkline_${columnName.replace(/[^a-zA-Z0-9]/g, "_")}`;
      const group = new SparklineColumnGroup(groupName, columnName);

      this.columnKeyMap.set(columnName, group);
      return group;
    });
  }

  public getSettings(columnName: string): SparklineColumnSettings {
    const group = this.columnKeyMap.get(columnName);
    if (group) {
      return {
        chartType: group.chartType.value.value as string,
        color: group.color.value.value,
        lineWidth: group.lineWidth.value,
      };
    }
    return {
      chartType: "line",
      color: "#0078D4",
      lineWidth: 1.5,
    };
  }

  public setSettings(
    columnName: string,
    settings: SparklineColumnSettings
  ): void {
    const group = this.columnKeyMap.get(columnName);
    if (group) {
      const chartTypeItem = group.chartType.items.find(
        (item) => item.value === settings.chartType
      );
      if (chartTypeItem) {
        group.chartType.value = chartTypeItem;
      }
      group.color.value = { value: settings.color };
      group.lineWidth.value = settings.lineWidth;
    }
  }
}
