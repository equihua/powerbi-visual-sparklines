import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class CellFormattingSettings extends formattingSettings.SimpleCard {
  decimalPlaces = new formattingSettings.NumUpDown({
    name: "decimalPlaces",
    displayName: "Lugares decimales",
    value: 2,
  });
  thousandsSeparator = new formattingSettings.ToggleSwitch({
    name: "thousandsSeparator",
    displayName: "Separador de miles",
    value: true,
  });
  cellPadding = new formattingSettings.NumUpDown({
    name: "cellPadding",
    displayName: "Espaciado interno de celdas",
    value: 6,
  });
  cellAlignment = new formattingSettings.ItemDropdown({
    name: "cellAlignment",
    displayName: "Alineación de celda",
    items: [
      { value: "left", displayName: "Izquierda" },
      { value: "center", displayName: "Centro" },
      { value: "right", displayName: "Derecha" },
    ],
    value: { value: "right", displayName: "Derecha" },
  });

  name: string = "cellFormatting";
  displayName: string = "Formato de celda";
  slices: formattingSettings.Slice[] = [
    this.decimalPlaces,
    this.thousandsSeparator,
    this.cellPadding,
    this.cellAlignment,
  ];
}

export class MeasureCellSettings extends formattingSettings.SimpleCard {
  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Color de fuente",
    value: { value: "#000000" },
  });
  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Tamaño de fuente",
    value: 12,
  });
  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Color de fondo",
    value: { value: "#FFFFFF" },
  });
  alignment = new formattingSettings.ItemDropdown({
    name: "alignment",
    displayName: "Alineación",
    items: [
      { value: "left", displayName: "Izquierda" },
      { value: "center", displayName: "Centro" },
      { value: "right", displayName: "Derecha" },
    ],
    value: { value: "right", displayName: "Derecha" },
  });
  padding = new formattingSettings.NumUpDown({
    name: "padding",
    displayName: "Espaciado interno",
    value: 6,
  });
  decimalPlaces = new formattingSettings.NumUpDown({
    name: "decimalPlaces",
    displayName: "Lugares decimales",
    value: 2,
  });

  name: string = "measureCell";
  displayName: string = "Celda de medida";
  slices: formattingSettings.Slice[] = [
    this.fontColor,
    this.fontSize,
    this.backgroundColor,
    this.alignment,
    this.padding,
    this.decimalPlaces,
  ];
}
