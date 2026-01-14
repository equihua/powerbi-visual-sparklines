import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";
import {
  BorderSection,
  BORDER_SECTION_OPTIONS,
} from "../constants/visualDefaults";

// ============================================================================
// SUBTARJETAS (GRUPOS COLAPSIBLES)
// ============================================================================

class GridlinesCard extends formattingSettings.SimpleCard {
  name: string = "gridlines";
  displayName: string = "Líneas de cuadrícula";

  showHorizontal = new formattingSettings.ToggleSwitch({
    name: "showHorizontal",
    displayName: "Líneas de cuadrícula horizontales",
    value: true,
  });

  gridHorizontalWeight = new formattingSettings.NumUpDown({
    name: "gridHorizontalWeight",
    displayName: "Ancho",
    value: 1,
    options: {
      minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  gridHorizontalColor = new formattingSettings.ColorPicker({
    name: "gridHorizontalColor",
    displayName: "Color",
    value: { value: "#E0E0E0" },
  });

  showVertical = new formattingSettings.ToggleSwitch({
    name: "showVertical",
    displayName: "Líneas de cuadrícula verticales",
    value: false,
  });

  gridVerticalWeight = new formattingSettings.NumUpDown({
    name: "gridVerticalWeight",
    displayName: "Ancho",
    value: 1,
    options: {
      minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  gridVerticalColor = new formattingSettings.ColorPicker({
    name: "gridVerticalColor",
    displayName: "Color",
    value: { value: "#E0E0E0" },
  });

  slices = [
    this.showHorizontal,
    this.gridHorizontalWeight,
    this.gridHorizontalColor,
    this.showVertical,
    this.gridVerticalWeight,
    this.gridVerticalColor,
  ];
}

class BorderCard extends formattingSettings.SimpleCard {
  name: string = "border";
  displayName: string = "Borde";

  borderSection = new formattingSettings.ItemDropdown({
    name: "borderSection",
    displayName: "Sección",
    items: BORDER_SECTION_OPTIONS.map((option) => ({
      value: option.value,
      displayName: option.displayName,
    })),
    value: BORDER_SECTION_OPTIONS[0],
  });

  borderTop = new formattingSettings.ToggleSwitch({
    name: "borderTop",
    displayName: "Superior",
    value: false,
  });

  borderBottom = new formattingSettings.ToggleSwitch({
    name: "borderBottom",
    displayName: "Inferior",
    value: false,
  });

  borderLeft = new formattingSettings.ToggleSwitch({
    name: "borderLeft",
    displayName: "Izquierda",
    value: false,
  });

  borderRight = new formattingSettings.ToggleSwitch({
    name: "borderRight",
    displayName: "Derecha",
    value: false,
  });

  borderColor = new formattingSettings.ColorPicker({
    name: "borderColor",
    displayName: "Color",
    value: { value: "#CCCCCC" },
  });

  borderWeight = new formattingSettings.NumUpDown({
    name: "borderWeight",
    displayName: "Ancho",
    value: 1,
    options: {
      minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  slices = [
    this.borderSection,
    this.borderTop,
    this.borderBottom,
    this.borderLeft,
    this.borderRight,
    this.borderColor,
    this.borderWeight,
  ];
}

class OptionsCard extends formattingSettings.SimpleCard {
  name: string = "options";
  displayName: string = "Opciones";

  rowPadding = new formattingSettings.NumUpDown({
    name: "rowPadding",
    displayName: "Espaciado interno de las filas",
    value: 1,
    options: {
      minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 50, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  globalFontSize = new formattingSettings.NumUpDown({
    name: "globalFontSize",
    displayName: "Tamaño de fuente global",
    value: 10,
    options: {
      minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 40, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  slices = [this.rowPadding, this.globalFontSize];
}

// ============================================================================
// TARJETA PRINCIPAL: GRID
// ============================================================================

export class GridSettings extends formattingSettings.CompositeCard {
  name: string = "grid";
  displayName: string = "Grid";

  gridlinesCard = new GridlinesCard();
  borderCard = new BorderCard();
  optionsCard = new OptionsCard();

  groups: formattingSettings.Group[] = [
    this.gridlinesCard,
    this.borderCard,
    this.optionsCard,
  ];
}
