import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

class HorizontalLinesGroup extends formattingSettings.SimpleCard {
  showHorizontalLines = new formattingSettings.ToggleSwitch({
    name: "showHorizontalLines",
    displayName: "Mostrar líneas horizontales",
    value: true,
  });

  horizontalLineColor = new formattingSettings.ColorPicker({
    name: "horizontalLineColor",
    displayName: "Color",
    value: { value: "#E0E0E0" },
  });

  horizontalLineWidth = new formattingSettings.NumUpDown({
    name: "horizontalLineWidth",
    displayName: "Ancho",
    value: 1,
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
    value: false,
  });

  verticalLineColor = new formattingSettings.ColorPicker({
    name: "verticalLineColor",
    displayName: "Color",
    value: { value: "#E0E0E0" },
  });

  verticalLineWidth = new formattingSettings.NumUpDown({
    name: "verticalLineWidth",
    displayName: "Ancho",
    value: 1,
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
    items: [
      { value: "all", displayName: "Todas" },
      { value: "header", displayName: "Encabezado" },
      { value: "rows", displayName: "Filas" },
    ],
    value: { value: "all", displayName: "Todas" },
  });

  borderTop = new formattingSettings.ToggleSwitch({
    name: "borderTop",
    displayName: "Superior",
    value: false,
  });

  borderBottom = new formattingSettings.ToggleSwitch({
    name: "borderBottom",
    displayName: "Inferior",
    value: true,
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
    value: { value: "#E0E0E0" },
  });

  borderWidth = new formattingSettings.NumUpDown({
    name: "borderWidth",
    displayName: "Ancho",
    value: 1,
  });

  borderStyle = new formattingSettings.ItemDropdown({
    name: "borderStyle",
    displayName: "Estilo",
    items: [
      { value: "solid", displayName: "Sólido" },
      { value: "dashed", displayName: "Guionado" },
      { value: "dotted", displayName: "Punteado" },
      { value: "double", displayName: "Doble" },
    ],
    value: { value: "solid", displayName: "Sólido" },
  });

  borderRadius = new formattingSettings.NumUpDown({
    name: "borderRadius",
    displayName: "Radio de esquina",
    value: 0,
  });

  shadowBorder = new formattingSettings.ToggleSwitch({
    name: "shadowBorder",
    displayName: "Sombra",
    value: false,
  });

  shadowColor = new formattingSettings.ColorPicker({
    name: "shadowColor",
    displayName: "Color de sombra",
    value: { value: "#000000" },
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
    value: 4,
  });

  name: string = "spacing";
  displayName: string = "Espaciado";
  slices: formattingSettings.Slice[] = [
    this.rowSpacing,
  ];
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
