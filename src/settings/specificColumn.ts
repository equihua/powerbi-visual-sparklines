import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";
import { SPECIFIC_COLUMN_DEFAULTS } from "../constants/visualDefaults";

export interface SpecificColumnStyle {
  textColor: string;
  backgroundColor: string;
  alignment: string;
}

class ApplyToGroup extends formattingSettings.SimpleCard {
  name = "applyToGroup";
  displayName = "Aplicar configuración a";

  columnSelector = new formattingSettings.ItemDropdown({
    name: "columnSelector",
    displayName: "Serie",
    items: [],
    value: { value: SPECIFIC_COLUMN_DEFAULTS.columnSelector, displayName: "" },
  });

  applyToHeader = new formattingSettings.ToggleSwitch({
    name: "applyToHeader",
    displayName: "Aplicar al encabezado",
    value: SPECIFIC_COLUMN_DEFAULTS.applyToHeader,
  });

  applyToTotal = new formattingSettings.ToggleSwitch({
    name: "applyToTotal",
    displayName: "Aplicar al total",
    value: SPECIFIC_COLUMN_DEFAULTS.applyToTotal,
  });

  applyToValues = new formattingSettings.ToggleSwitch({
    name: "applyToValues",
    displayName: "Aplicar a los valores",
    value: SPECIFIC_COLUMN_DEFAULTS.applyToValues,
  });

  slices = [
    this.columnSelector,
    this.applyToHeader,
    this.applyToTotal,
    this.applyToValues,
  ];
}

class ValuesGroup extends formattingSettings.SimpleCard {
  name = "valuesGroup";
  displayName = "Valores";

  textColor = new formattingSettings.ColorPicker({
    name: "textColor",
    displayName: "Color del texto",
    value: { value: SPECIFIC_COLUMN_DEFAULTS.textColor },
  });

  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Color de fondo",
    value: { value: SPECIFIC_COLUMN_DEFAULTS.backgroundColor },
  });

  alignment = new formattingSettings.AlignmentGroup({
    name: "alignment",
    displayName: "Alineación",
    mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
    value: SPECIFIC_COLUMN_DEFAULTS.alignment,
  });

  slices = [this.textColor, this.backgroundColor, this.alignment];
}

export class SpecificColumnSettings extends formattingSettings.CompositeCard {
  name = "specificColumn";
  displayName = "Columna específica";

  applyToGroup = new ApplyToGroup();
  valuesGroup = new ValuesGroup();

  groups = [this.applyToGroup, this.valuesGroup];

  updateColumnList(columns: string[]): void {
    const items = columns.map((col) => ({
      displayName: col,
      value: col,
    }));
    this.applyToGroup.columnSelector.items = items;

    if (items.length > 0 && !this.applyToGroup.columnSelector.value.value) {
      this.applyToGroup.columnSelector.value = {
        value: items[0].value,
        displayName: items[0].displayName
      };
    }
  }

  getStyle(): SpecificColumnStyle {
    return {
      textColor: this.valuesGroup.textColor.value.value,
      backgroundColor: this.valuesGroup.backgroundColor.value.value,
      alignment: this.valuesGroup.alignment.value,
    };
  }
}
