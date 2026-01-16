import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import {
  SPARKLINE_TYPE_OPTIONS,
  SPARKLINE_DEFAULTS,
  VALIDATORS,
} from "../constants/visualDefaults";

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
    items: [...SPARKLINE_TYPE_OPTIONS],
    value: SPARKLINE_TYPE_OPTIONS[0],
  });

  color = new formattingSettings.ColorPicker({
    name: "color",
    displayName: "Color",
    value: { value: SPARKLINE_DEFAULTS.color },
  });

  lineWidth = new formattingSettings.NumUpDown({
    name: "lineWidth",
    displayName: "Grosor de línea",
    value: SPARKLINE_DEFAULTS.lineWidth,
    options: {
      minValue: VALIDATORS.lineWidth.min,
      maxValue: VALIDATORS.lineWidth.max,
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
      chartType: SPARKLINE_DEFAULTS.chartType,
      color: SPARKLINE_DEFAULTS.color,
      lineWidth: SPARKLINE_DEFAULTS.lineWidth,
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
