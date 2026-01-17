import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";
import {
  SPARKLINE_TYPE_OPTIONS,
  SPARKLINE_DEFAULTS,
  VALIDATORS,
} from "../constants/visualDefaults";

type DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
type Selector = powerbi.data.Selector;

/**
 * Interface para configuraciones de columna sparkline.
 * Define tipo de gráfico, color y grosor de línea base.
 * También incluye configuraciones específicas para cada tipo de gráfico.
 */
export interface SparklineColumnSettings {
  // Propiedades base
  chartType: string;
  color: string;
  lineWidth: number;

  // Propiedades específicas para Line
  lineShowPoints?: boolean;
  linePointRadius?: number;
  lineCurveType?: string;

  // Propiedades específicas para Area
  areaStrokeWidth?: number;
  areaFillOpacity?: number;
  areaCurveType?: string;

  // Propiedades específicas para Bar
  barSpacing?: number;
  barOpacity?: number;

  // Propiedades específicas para Pie
  pieStartAngle?: number;
  pieShowLabels?: boolean;
  pieLabelPosition?: string;

  // Propiedades específicas para Donut
  donutInnerRadius?: number;
  donutStartAngle?: number;
  donutShowLabels?: boolean;
  donutLabelPosition?: string;
}

class SparklineColumnGroup extends formattingSettings.Group {
  chartType: formattingSettings.ItemDropdown;
  color: formattingSettings.ColorPicker;
  lineWidth: formattingSettings.NumUpDown;

  constructor(name: string, displayName: string, selector: powerbi.data.Selector) {
    super({
      name: name,
      displayName: displayName,
      slices: [],
    });

    this.chartType = new formattingSettings.ItemDropdown({
      name: "chartType",
      displayName: "Tipo de gráfico",
      items: [...SPARKLINE_TYPE_OPTIONS],
      value: SPARKLINE_TYPE_OPTIONS[0],
      selector: selector,
    });

    this.color = new formattingSettings.ColorPicker({
      name: "color",
      displayName: "Color",
      value: { value: SPARKLINE_DEFAULTS.color },
      selector: selector,
    });

    this.lineWidth = new formattingSettings.NumUpDown({
      name: "lineWidth",
      displayName: "Grosor de línea",
      value: SPARKLINE_DEFAULTS.lineWidth,
      options: {
        minValue: VALIDATORS.lineWidth.min,
        maxValue: VALIDATORS.lineWidth.max,
      },
      selector: selector,
    });

    this.slices = [this.chartType, this.color, this.lineWidth];
  }
}

export class SparklineCompositeCard extends formattingSettings.CompositeCard {
  name: string = "sparklineColumn";
  displayName: string = "Minigráficos";
  groups: SparklineColumnGroup[] = [];
  private columnKeyMap: Map<string, SparklineColumnGroup> = new Map();

  constructor(sparklineColumns: powerbi.DataViewMetadataColumn[]) {
    super();
    this.groups = sparklineColumns.map((column) => {
      const columnName = column.displayName || "";
      const columnKey = column.queryName || column.displayName || "";
      const selector: powerbi.data.Selector = { metadata: column.queryName };
      const groupName = `sparkline_${columnKey.replace(/[^a-zA-Z0-9]/g, "_")}`;
      const group = new SparklineColumnGroup(groupName, columnName, selector);

      this.columnKeyMap.set(columnName, group);
      return group;
    });
  }

  public getSettings(columnName: string): SparklineColumnSettings {
    const group = this.columnKeyMap.get(columnName);
    if (group) {
      console.log(`[SparklineCompositeCard] getSettings for ${columnName}:`, {
        chartType: group.chartType.value,
        chartTypeValue: group.chartType.value.value,
        color: group.color.value.value,
        lineWidth: group.lineWidth.value,
      });
      return {
        chartType: group.chartType.value.value as string,
        color: group.color.value.value,
        lineWidth: group.lineWidth.value,
        // Propiedades específicas con defaults del SPARKLINE_DEFAULTS
        lineShowPoints: SPARKLINE_DEFAULTS.line.showPoints,
        linePointRadius: SPARKLINE_DEFAULTS.line.pointRadius,
        lineCurveType: SPARKLINE_DEFAULTS.line.curveType,
        areaStrokeWidth: SPARKLINE_DEFAULTS.area.strokeWidth,
        areaFillOpacity: SPARKLINE_DEFAULTS.area.fillOpacity,
        areaCurveType: SPARKLINE_DEFAULTS.area.curveType,
        barSpacing: SPARKLINE_DEFAULTS.bar.spacing,
        barOpacity: SPARKLINE_DEFAULTS.bar.opacity,
        pieStartAngle: SPARKLINE_DEFAULTS.pie.startAngle,
        pieShowLabels: SPARKLINE_DEFAULTS.pie.showLabels,
        pieLabelPosition: SPARKLINE_DEFAULTS.pie.labelPosition,
        donutInnerRadius: SPARKLINE_DEFAULTS.donut.innerRadius,
        donutStartAngle: SPARKLINE_DEFAULTS.donut.startAngle,
        donutShowLabels: SPARKLINE_DEFAULTS.donut.showLabels,
        donutLabelPosition: SPARKLINE_DEFAULTS.donut.labelPosition,
      };
    }
    return {
      chartType: SPARKLINE_DEFAULTS.chartType,
      color: SPARKLINE_DEFAULTS.color,
      lineWidth: SPARKLINE_DEFAULTS.lineWidth,
      lineShowPoints: SPARKLINE_DEFAULTS.line.showPoints,
      linePointRadius: SPARKLINE_DEFAULTS.line.pointRadius,
      lineCurveType: SPARKLINE_DEFAULTS.line.curveType,
      areaStrokeWidth: SPARKLINE_DEFAULTS.area.strokeWidth,
      areaFillOpacity: SPARKLINE_DEFAULTS.area.fillOpacity,
      areaCurveType: SPARKLINE_DEFAULTS.area.curveType,
      barSpacing: SPARKLINE_DEFAULTS.bar.spacing,
      barOpacity: SPARKLINE_DEFAULTS.bar.opacity,
      pieStartAngle: SPARKLINE_DEFAULTS.pie.startAngle,
      pieShowLabels: SPARKLINE_DEFAULTS.pie.showLabels,
      pieLabelPosition: SPARKLINE_DEFAULTS.pie.labelPosition,
      donutInnerRadius: SPARKLINE_DEFAULTS.donut.innerRadius,
      donutStartAngle: SPARKLINE_DEFAULTS.donut.startAngle,
      donutShowLabels: SPARKLINE_DEFAULTS.donut.showLabels,
      donutLabelPosition: SPARKLINE_DEFAULTS.donut.labelPosition,
    };
  }

  public setSettings(
    columnName: string,
    settings: SparklineColumnSettings,
  ): void {
    const group = this.columnKeyMap.get(columnName);
    if (group) {
      console.log(`[SparklineCompositeCard] setSettings for ${columnName}:`, {
        incomingChartType: settings.chartType,
        currentChartType: group.chartType.value,
      });
      const chartTypeItem = group.chartType.items.find(
        (item) => item.value === settings.chartType,
      );
      console.log(`[SparklineCompositeCard] Found chartTypeItem:`, chartTypeItem);
      if (chartTypeItem) {
        group.chartType.value = chartTypeItem;
        console.log(`[SparklineCompositeCard] Updated chartType.value to:`, group.chartType.value);
      }
      group.color.value = { value: settings.color };
      group.lineWidth.value = settings.lineWidth;
    }
  }
}
