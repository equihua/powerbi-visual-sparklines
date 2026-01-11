import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

/**
 * Configuraciones de cuadrícula.
 * Controla líneas, bordes y espaciado del grid de la tabla.
 */
export class GridSettings extends formattingSettings.SimpleCard {
  showHorizontalLines = new formattingSettings.ToggleSwitch({
    name: "showHorizontalLines",
    displayName: "Líneas horizontales",
    value: true,
  });

  horizontalLineColor = new formattingSettings.ColorPicker({
    name: "horizontalLineColor",
    displayName: "Color",
    value: { value: "#E0E0E0" },
  });

  horizontalLineWidth = new formattingSettings.NumUpDown({
    name: "horizontalLineWidth",
    displayName: "Ancho líneas horizontales",
    value: 1,
  });

  showVerticalLines = new formattingSettings.ToggleSwitch({
    name: "showVerticalLines",
    displayName: "Líneas verticales",
    value: false,
  });

  verticalLineColor = new formattingSettings.ColorPicker({
    name: "verticalLineColor",
    displayName: "Color líneas verticales",
    value: { value: "#E0E0E0" },
  });

  verticalLineWidth = new formattingSettings.NumUpDown({
    name: "verticalLineWidth",
    displayName: "Ancho líneas verticales",
    value: 1,
  });

  borderSection = new formattingSettings.ItemDropdown({
    name: "borderSection",
    displayName: "Borde",
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
    displayName: "Color de borde",
    value: { value: "#E0E0E0" },
  });
  borderWidth = new formattingSettings.NumUpDown({
    name: "borderWidth",
    displayName: "Ancho de borde",
    value: 1,
  });

  rowSpacing = new formattingSettings.NumUpDown({
    name: "rowSpacing",
    displayName: "Espaciado interno filas",
    value: 4,
  });
  globalFontSize = new formattingSettings.NumUpDown({
    name: "globalFontSize",
    displayName: "Tamaño de fuente global",
    value: 12,
  });

  name: string = "grid";
  displayName: string = "Cuadrícula";
  slices: formattingSettings.Slice[] = [
    this.showHorizontalLines,
    this.horizontalLineColor,
    this.horizontalLineWidth,
    this.showVerticalLines,
    this.verticalLineColor,
    this.verticalLineWidth,
    this.borderSection,
    this.borderTop,
    this.borderBottom,
    this.borderLeft,
    this.borderRight,
    this.borderColor,
    this.borderWidth,
    this.rowSpacing,
    this.globalFontSize,
  ];
}
