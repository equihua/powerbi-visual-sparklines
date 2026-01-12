import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import {
  BORDER_STYLE_OPTIONS,
  BORDER_SECTION_OPTIONS,
  GRID_DEFAULTS,
} from "../constants/visualDefaults";

class HorizontalLinesGroup extends formattingSettings.SimpleCard {
  showHorizontalLines = new formattingSettings.ToggleSwitch({
    name: "showHorizontalLines",
    displayName: "Mostrar líneas horizontales",
    value: GRID_DEFAULTS.showHorizontalLines,
  });

  horizontalLineColor = new formattingSettings.ColorPicker({
    name: "horizontalLineColor",
    displayName: "Color",
    value: { value: GRID_DEFAULTS.horizontalLineColor },
  });

  horizontalLineWidth = new formattingSettings.NumUpDown({
    name: "horizontalLineWidth",
    displayName: "Ancho",
    value: GRID_DEFAULTS.horizontalLineWidth,
  });

  name: string = "horizontalLines";
  displayName: string = "Líneas horizontales";
  slices: formattingSettings.Slice[] = [
    this.showHorizontalLines,
    this.horizontalLineColor,
    this.horizontalLineWidth,
  ];
}

class VerticalLinesGroup extends formattingSettings.SimpleCard {
  showVerticalLines = new formattingSettings.ToggleSwitch({
    name: "showVerticalLines",
    displayName: "Mostrar líneas verticales",
    value: GRID_DEFAULTS.showVerticalLines,
  });

  verticalLineColor = new formattingSettings.ColorPicker({
    name: "verticalLineColor",
    displayName: "Color",
    value: { value: GRID_DEFAULTS.verticalLineColor },
  });

  verticalLineWidth = new formattingSettings.NumUpDown({
    name: "verticalLineWidth",
    displayName: "Ancho",
    value: GRID_DEFAULTS.verticalLineWidth,
  });

  name: string = "verticalLines";
  displayName: string = "Líneas verticales";
  slices: formattingSettings.Slice[] = [
    this.showVerticalLines,
    this.verticalLineColor,
    this.verticalLineWidth,
  ];
}

class BordersGroup extends formattingSettings.SimpleCard {
  borderSection = new formattingSettings.ItemDropdown({
    name: "borderSection",
    displayName: "Aplicar a",
    items: [...BORDER_SECTION_OPTIONS],
    value: BORDER_SECTION_OPTIONS[0],
  });

  borderTop = new formattingSettings.ToggleSwitch({
    name: "borderTop",
    displayName: "Superior",
    value: GRID_DEFAULTS.borderTop,
  });

  borderBottom = new formattingSettings.ToggleSwitch({
    name: "borderBottom",
    displayName: "Inferior",
    value: GRID_DEFAULTS.borderBottom,
  });

  borderLeft = new formattingSettings.ToggleSwitch({
    name: "borderLeft",
    displayName: "Izquierda",
    value: GRID_DEFAULTS.borderLeft,
  });

  borderRight = new formattingSettings.ToggleSwitch({
    name: "borderRight",
    displayName: "Derecha",
    value: GRID_DEFAULTS.borderRight,
  });

  borderColor = new formattingSettings.ColorPicker({
    name: "borderColor",
    displayName: "Color",
    value: { value: GRID_DEFAULTS.borderColor },
  });

  borderWidth = new formattingSettings.NumUpDown({
    name: "borderWidth",
    displayName: "Ancho",
    value: GRID_DEFAULTS.borderWidth,
  });

  borderStyle = new formattingSettings.ItemDropdown({
    name: "borderStyle",
    displayName: "Estilo",
    items: [...BORDER_STYLE_OPTIONS],
    value: BORDER_STYLE_OPTIONS[0],
  });

  borderRadius = new formattingSettings.NumUpDown({
    name: "borderRadius",
    displayName: "Radio de esquina",
    value: GRID_DEFAULTS.borderRadius,
  });

  shadowBorder = new formattingSettings.ToggleSwitch({
    name: "shadowBorder",
    displayName: "Sombra",
    value: GRID_DEFAULTS.shadowBorder,
  });

  shadowColor = new formattingSettings.ColorPicker({
    name: "shadowColor",
    displayName: "Color de sombra",
    value: { value: GRID_DEFAULTS.shadowColor },
  });

  name: string = "borders";
  displayName: string = "Bordes";
  slices: formattingSettings.Slice[] = [
    this.borderSection,
    this.borderTop,
    this.borderBottom,
    this.borderLeft,
    this.borderRight,
    this.borderColor,
    this.borderWidth,
    this.borderStyle,
    this.borderRadius,
    this.shadowBorder,
    this.shadowColor,
  ];
}

class SpacingGroup extends formattingSettings.SimpleCard {
  rowSpacing = new formattingSettings.NumUpDown({
    name: "rowSpacing",
    displayName: "Espaciado interno filas",
    value: GRID_DEFAULTS.rowSpacing,
  });

  name: string = "spacing";
  displayName: string = "Espaciado";
  slices: formattingSettings.Slice[] = [this.rowSpacing];
}

export class GridSettings extends formattingSettings.CompositeCard {
  horizontalLinesGroup = new HorizontalLinesGroup();
  verticalLinesGroup = new VerticalLinesGroup();
  bordersGroup = new BordersGroup();
  spacingGroup = new SpacingGroup();

  name: string = "grid";
  displayName: string = "Cuadrícula y bordes";
  groups: formattingSettings.Group[] = [
    this.horizontalLinesGroup,
    this.verticalLinesGroup,
    this.bordersGroup,
    this.spacingGroup,
  ];
}
