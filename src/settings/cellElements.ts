import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { CELL_ELEMENTS_DEFAULTS } from "../constants/visualDefaults";

export interface CellElementsStyle {
  backgroundColorToggle: boolean;
  backgroundGradient: {
    minColor: string;
    maxColor: string;
  };
  fontColorToggle: boolean;
  fontGradient: {
    minColor: string;
    maxColor: string;
  };
  iconsToggle: boolean;
  iconsGradient: {
    minColor: string;
    maxColor: string;
  };
  webUrlToggle: boolean;
  webUrlGradient: {
    minColor: string;
    maxColor: string;
  };
}

class ApplyToGroup extends formattingSettings.SimpleCard {
  name = "applyToGroup";
  displayName = "Aplicar configuración a";

  columnSelector = new formattingSettings.ItemDropdown({
    name: "columnSelector",
    displayName: "Serie",
    items: [],
    value: { value: CELL_ELEMENTS_DEFAULTS.columnSelector, displayName: "" },
  });

  slices = [this.columnSelector];
}

class ElementsGroup extends formattingSettings.SimpleCard {
  name = "elementsGroup";
  displayName = "Elementos";

  backgroundColorToggle = new formattingSettings.ToggleSwitch({
    name: "backgroundColorToggle",
    displayName: "Color de fondo",
    value: CELL_ELEMENTS_DEFAULTS.backgroundColorToggle,
  });

  backgroundMinColor = new formattingSettings.ColorPicker({
    name: "backgroundMinColor",
    displayName: "Color mínimo",
    value: CELL_ELEMENTS_DEFAULTS.backgroundGradient.minColor,
  });

  backgroundMaxColor = new formattingSettings.ColorPicker({
    name: "backgroundMaxColor",
    displayName: "Color máximo",
    value: CELL_ELEMENTS_DEFAULTS.backgroundGradient.maxColor,
  });

  fontColorToggle = new formattingSettings.ToggleSwitch({
    name: "fontColorToggle",
    displayName: "Color de fuente",
    value: CELL_ELEMENTS_DEFAULTS.fontColorToggle,
  });

  fontMinColor = new formattingSettings.ColorPicker({
    name: "fontMinColor",
    displayName: "Color mínimo",
    value: CELL_ELEMENTS_DEFAULTS.fontGradient.minColor,
  });

  fontMaxColor = new formattingSettings.ColorPicker({
    name: "fontMaxColor",
    displayName: "Color máximo",
    value: CELL_ELEMENTS_DEFAULTS.fontGradient.maxColor,
  });

  iconsToggle = new formattingSettings.ToggleSwitch({
    name: "iconsToggle",
    displayName: "Iconos",
    value: CELL_ELEMENTS_DEFAULTS.iconsToggle,
  });

  iconsMinColor = new formattingSettings.ColorPicker({
    name: "iconsMinColor",
    displayName: "Color mínimo",
    value: CELL_ELEMENTS_DEFAULTS.iconsGradient.minColor,
  });

  iconsMaxColor = new formattingSettings.ColorPicker({
    name: "iconsMaxColor",
    displayName: "Color máximo",
    value: CELL_ELEMENTS_DEFAULTS.iconsGradient.maxColor,
  });

  webUrlToggle = new formattingSettings.ToggleSwitch({
    name: "webUrlToggle",
    displayName: "URL web",
    value: CELL_ELEMENTS_DEFAULTS.webUrlToggle,
  });

  webUrlMinColor = new formattingSettings.ColorPicker({
    name: "webUrlMinColor",
    displayName: "Color mínimo",
    value: CELL_ELEMENTS_DEFAULTS.webUrlGradient.minColor,
  });

  webUrlMaxColor = new formattingSettings.ColorPicker({
    name: "webUrlMaxColor",
    displayName: "Color máximo",
    value: CELL_ELEMENTS_DEFAULTS.webUrlGradient.maxColor,
  });

  slices = [
    this.backgroundColorToggle,
    this.backgroundMinColor,
    this.backgroundMaxColor,
    this.fontColorToggle,
    this.fontMinColor,
    this.fontMaxColor,
    this.iconsToggle,
    this.iconsMinColor,
    this.iconsMaxColor,
    this.webUrlToggle,
    this.webUrlMinColor,
    this.webUrlMaxColor,
  ];
}

export class CellElementsSettings extends formattingSettings.CompositeCard {
  name = "cellElements";
  displayName = "Elementos de celda";

  applyToGroup = new ApplyToGroup();
  elementsGroup = new ElementsGroup();

  groups = [this.applyToGroup, this.elementsGroup];

  updateColumnList(columns: string[]): void {
    const items = columns.map((col) => ({
      displayName: col,
      value: col,
    }));
    this.applyToGroup.columnSelector.items = items;

    if (items.length > 0 && !this.applyToGroup.columnSelector.value.value) {
      this.applyToGroup.columnSelector.value = {
        value: items[0].value,
        displayName: items[0].displayName,
      };
    }
  }

  getStyle(): CellElementsStyle {
    return {
      backgroundColorToggle: this.elementsGroup.backgroundColorToggle.value,
      backgroundGradient: {
        minColor: this.elementsGroup.backgroundMinColor.value.value,
        maxColor: this.elementsGroup.backgroundMaxColor.value.value,
      },
      fontColorToggle: this.elementsGroup.fontColorToggle.value,
      fontGradient: {
        minColor: this.elementsGroup.fontMinColor.value.value,
        maxColor: this.elementsGroup.fontMaxColor.value.value,
      },
      iconsToggle: this.elementsGroup.iconsToggle.value,
      iconsGradient: {
        minColor: this.elementsGroup.iconsMinColor.value.value,
        maxColor: this.elementsGroup.iconsMaxColor.value.value,
      },
      webUrlToggle: this.elementsGroup.webUrlToggle.value,
      webUrlGradient: {
        minColor: this.elementsGroup.webUrlMinColor.value.value,
        maxColor: this.elementsGroup.webUrlMaxColor.value.value,
      },
    };
  }
}
