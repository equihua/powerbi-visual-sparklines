import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class TypographySettings extends formattingSettings.SimpleCard {
  fontFamily = new formattingSettings.ItemDropdown({
    name: "fontFamily",
    displayName: "Familia de fuente",
    items: [
      { value: "Arial, sans-serif", displayName: "Arial" },
      { value: "Verdana, sans-serif", displayName: "Verdana" },
      { value: "Georgia, serif", displayName: "Georgia" },
      { value: "Courier New, monospace", displayName: "Courier" },
      { value: "Segoe UI, sans-serif", displayName: "Segoe UI" },
      { value: "Tahoma, sans-serif", displayName: "Tahoma" },
      { value: "Times New Roman, serif", displayName: "Times New Roman" },
    ],
    value: { value: "Segoe UI, sans-serif", displayName: "Segoe UI" },
  });

  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Tamaño de fuente base",
    value: 11,
  });

  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Color de fuente base",
    value: { value: "#000000" },
  });

  lineHeight = new formattingSettings.NumUpDown({
    name: "lineHeight",
    displayName: "Alto de línea",
    value: 1.4,
  });

  letterSpacing = new formattingSettings.NumUpDown({
    name: "letterSpacing",
    displayName: "Espaciado entre letras",
    value: 0,
  });

  bold = new formattingSettings.ToggleSwitch({
    name: "bold",
    displayName: "Negrita",
    value: false,
  });

  italic = new formattingSettings.ToggleSwitch({
    name: "italic",
    displayName: "Cursiva",
    value: false,
  });

  name: string = "typography";
  displayName: string = "Tipografía global";
  slices: formattingSettings.Slice[] = [
    this.fontFamily,
    this.fontSize,
    this.fontColor,
    this.lineHeight,
    this.letterSpacing,
    this.bold,
    this.italic,
  ];
}
