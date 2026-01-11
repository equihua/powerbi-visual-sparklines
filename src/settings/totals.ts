import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class TotalSettings extends formattingSettings.SimpleCard {
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
  bold = new formattingSettings.ToggleSwitch({
    name: "bold",
    displayName: "Negrita",
    value: true,
  });

  name: string = "total";
  displayName: string = "Totales";
  slices: formattingSettings.Slice[] = [
    this.fontColor,
    this.fontSize,
    this.backgroundColor,
    this.alignment,
    this.padding,
    this.bold,
  ];
}
