import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import {
  TEXT_ALIGNMENT_OPTIONS,
  COLUMN_DEFAULTS,
} from "../constants/visualDefaults";

export interface ColumnConfigSettings {
  headerFontColor: string;
  headerFontSize: number;
  headerAlignment: string;
  headerBold: boolean;
  headerBackgroundColor: string;
  headerPadding: number;
  cellFontColor: string;
  cellFontSize: number;
  cellAlignment: string;
  cellBackgroundColor: string;
  cellPadding: number;
  decimalPlaces: number;
  thousandsSeparator: boolean;
  prefix: string;
  suffix: string;
  columnWidth: number;
  sortable: boolean;
  columnVisible: boolean;
}

class ColumnConfigGroup extends formattingSettings.Group {
  headerFontColor = new formattingSettings.ColorPicker({
    name: "headerFontColor",
    displayName: "Color de fuente encabezado",
    value: { value: COLUMN_DEFAULTS.headerFontColor },
  });

  headerFontSize = new formattingSettings.NumUpDown({
    name: "headerFontSize",
    displayName: "Tamaño fuente encabezado",
    value: COLUMN_DEFAULTS.headerFontSize,
  });

  headerAlignment = new formattingSettings.ItemDropdown({
    name: "headerAlignment",
    displayName: "Alineación encabezado",
    items: [...TEXT_ALIGNMENT_OPTIONS],
    value: TEXT_ALIGNMENT_OPTIONS[1], // Centro
  });

  headerBold = new formattingSettings.ToggleSwitch({
    name: "headerBold",
    displayName: "Negrita encabezado",
    value: COLUMN_DEFAULTS.headerBold,
  });

  headerBackgroundColor = new formattingSettings.ColorPicker({
    name: "headerBackgroundColor",
    displayName: "Color fondo encabezado",
    value: { value: COLUMN_DEFAULTS.headerBackgroundColor },
  });

  headerPadding = new formattingSettings.NumUpDown({
    name: "headerPadding",
    displayName: "Espaciado encabezado",
    value: COLUMN_DEFAULTS.headerPadding,
  });

  cellFontColor = new formattingSettings.ColorPicker({
    name: "cellFontColor",
    displayName: "Color de fuente celda",
    value: { value: COLUMN_DEFAULTS.cellFontColor },
  });

  cellFontSize = new formattingSettings.NumUpDown({
    name: "cellFontSize",
    displayName: "Tamaño fuente celda",
    value: COLUMN_DEFAULTS.cellFontSize,
  });

  cellAlignment = new formattingSettings.ItemDropdown({
    name: "cellAlignment",
    displayName: "Alineación celda",
    items: [...TEXT_ALIGNMENT_OPTIONS],
    value: TEXT_ALIGNMENT_OPTIONS[0], // Izquierda
  });

  cellBackgroundColor = new formattingSettings.ColorPicker({
    name: "cellBackgroundColor",
    displayName: "Color fondo celda",
    value: { value: COLUMN_DEFAULTS.cellBackgroundColor },
  });

  cellPadding = new formattingSettings.NumUpDown({
    name: "cellPadding",
    displayName: "Espaciado celda",
    value: COLUMN_DEFAULTS.cellPadding,
  });

  decimalPlaces = new formattingSettings.NumUpDown({
    name: "decimalPlaces",
    displayName: "Decimales",
    value: COLUMN_DEFAULTS.decimalPlaces,
  });

  thousandsSeparator = new formattingSettings.ToggleSwitch({
    name: "thousandsSeparator",
    displayName: "Separador de miles",
    value: COLUMN_DEFAULTS.thousandsSeparator,
  });

  prefix = new formattingSettings.TextInput({
    name: "prefix",
    displayName: "Prefijo",
    value: COLUMN_DEFAULTS.prefix,
    placeholder: "$",
  });

  suffix = new formattingSettings.TextInput({
    name: "suffix",
    displayName: "Sufijo",
    value: COLUMN_DEFAULTS.suffix,
    placeholder: "%",
  });

  columnWidth = new formattingSettings.NumUpDown({
    name: "columnWidth",
    displayName: "Ancho de columna",
    value: COLUMN_DEFAULTS.columnWidth,
  });

  sortable = new formattingSettings.ToggleSwitch({
    name: "sortable",
    displayName: "Ordenable",
    value: COLUMN_DEFAULTS.sortable,
  });

  columnVisible = new formattingSettings.ToggleSwitch({
    name: "columnVisible",
    displayName: "Visible",
    value: COLUMN_DEFAULTS.columnVisible,
  });

  constructor(name: string, displayName: string) {
    super({
      name: name,
      displayName: displayName,
      slices: [],
    });
    this.slices = [
      this.headerFontColor,
      this.headerFontSize,
      this.headerAlignment,
      this.headerBold,
      this.headerBackgroundColor,
      this.headerPadding,
      this.cellFontColor,
      this.cellFontSize,
      this.cellAlignment,
      this.cellBackgroundColor,
      this.cellPadding,
      this.decimalPlaces,
      this.thousandsSeparator,
      this.prefix,
      this.suffix,
      this.columnWidth,
      this.sortable,
      this.columnVisible,
    ];
  }
}

export class ColumnSettings extends formattingSettings.CompositeCard {
  name: string = "columns";
  displayName: string = "Columnas";

  columnSelector = new formattingSettings.ItemDropdown({
    name: "columnSelector",
    displayName: "Seleccionar columna",
    items: [{ value: "__ALL__", displayName: "Todas" }],
    value: { value: "__ALL__", displayName: "Todas" },
  });

  topLevelSlice = this.columnSelector;
  groups: ColumnConfigGroup[] = [];

  private allGroups: Map<string, ColumnConfigGroup> = new Map();
  private measureColumnNames: string[] = [];
  private currentSelectedColumn: string = "__ALL__";

  constructor(measureColumnNames: string[] = []) {
    super();
    this.measureColumnNames = measureColumnNames;

    const allGroup = new ColumnConfigGroup("__ALL__", "Configuración");
    this.allGroups.set("__ALL__", allGroup);

    const selectorItems = [{ value: "__ALL__", displayName: "Todas" }];

    measureColumnNames.forEach((columnName) => {
      const groupName = `column_${columnName.replace(/[^a-zA-Z0-9]/g, "_")}`;
      const group = new ColumnConfigGroup(groupName, columnName);
      this.allGroups.set(columnName, group);
      selectorItems.push({ value: columnName, displayName: columnName });
    });

    this.columnSelector.items = selectorItems;
    this.groups = [allGroup];
  }

  public switchToColumn(columnName: string): void {
    const group = this.allGroups.get(columnName);
    if (group) {
      this.groups = [group];
      this.currentSelectedColumn = columnName;
    }
  }

  public getCurrentSelectedColumn(): string {
    return this.currentSelectedColumn;
  }

  public getSettings(columnName: string): ColumnConfigSettings {
    if (columnName === "__ALL__") {
      const group = this.allGroups.get("__ALL__");
      if (group) {
        return this.extractSettingsFromGroup(group);
      }
    } else {
      const individualGroup = this.allGroups.get(columnName);
      const globalGroup = this.allGroups.get("__ALL__");

      if (individualGroup && globalGroup) {
        return this.mergeSettings(
          this.extractSettingsFromGroup(globalGroup),
          this.extractSettingsFromGroup(individualGroup)
        );
      } else if (globalGroup) {
        return this.extractSettingsFromGroup(globalGroup);
      }
    }

    return this.getDefaultSettings();
  }

  private extractSettingsFromGroup(
    group: ColumnConfigGroup
  ): ColumnConfigSettings {
    return {
      headerFontColor: group.headerFontColor.value.value,
      headerFontSize: group.headerFontSize.value,
      headerAlignment: group.headerAlignment.value.value as string,
      headerBold: group.headerBold.value,
      headerBackgroundColor: group.headerBackgroundColor.value.value,
      headerPadding: group.headerPadding.value,
      cellFontColor: group.cellFontColor.value.value,
      cellFontSize: group.cellFontSize.value,
      cellAlignment: group.cellAlignment.value.value as string,
      cellBackgroundColor: group.cellBackgroundColor.value.value,
      cellPadding: group.cellPadding.value,
      decimalPlaces: group.decimalPlaces.value,
      thousandsSeparator: group.thousandsSeparator.value,
      prefix: group.prefix.value,
      suffix: group.suffix.value,
      columnWidth: group.columnWidth.value,
      sortable: group.sortable.value,
      columnVisible: group.columnVisible.value,
    };
  }

  private mergeSettings(
    globalSettings: ColumnConfigSettings,
    individualSettings: ColumnConfigSettings
  ): ColumnConfigSettings {
    return { ...globalSettings, ...individualSettings };
  }

  private getDefaultSettings(): ColumnConfigSettings {
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

  public setSettings(columnName: string, settings: ColumnConfigSettings): void {
    const group = this.allGroups.get(columnName);
    if (group) {
      group.headerFontColor.value = { value: settings.headerFontColor };
      group.headerFontSize.value = settings.headerFontSize;
      const headerAlignmentItem = group.headerAlignment.items.find(
        (item) => item.value === settings.headerAlignment
      );
      if (headerAlignmentItem) {
        group.headerAlignment.value = headerAlignmentItem;
      }
      group.headerBold.value = settings.headerBold;
      group.headerBackgroundColor.value = {
        value: settings.headerBackgroundColor,
      };
      group.headerPadding.value = settings.headerPadding;
      group.cellFontColor.value = { value: settings.cellFontColor };
      group.cellFontSize.value = settings.cellFontSize;
      const cellAlignmentItem = group.cellAlignment.items.find(
        (item) => item.value === settings.cellAlignment
      );
      if (cellAlignmentItem) {
        group.cellAlignment.value = cellAlignmentItem;
      }
      group.cellBackgroundColor.value = { value: settings.cellBackgroundColor };
      group.cellPadding.value = settings.cellPadding;
      group.decimalPlaces.value = settings.decimalPlaces;
      group.thousandsSeparator.value = settings.thousandsSeparator;
      group.prefix.value = settings.prefix;
      group.suffix.value = settings.suffix;
      group.columnWidth.value = settings.columnWidth;
      group.sortable.value = settings.sortable;
      group.columnVisible.value = settings.columnVisible;
    }
  }

  public getAllMeasureColumnNames(): string[] {
    return this.measureColumnNames;
  }
}
