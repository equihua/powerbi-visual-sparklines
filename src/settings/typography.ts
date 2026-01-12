import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import {
  FONT_FAMILY_OPTIONS,
  TYPOGRAPHY_DEFAULTS,
} from "../constants/visualDefaults";

export class TypographySettings extends formattingSettings.SimpleCard {
  fontFamily = new formattingSettings.ItemDropdown({
    name: "fontFamily",
    displayName: "Familia de fuente",
    items: [...FONT_FAMILY_OPTIONS],
    value: FONT_FAMILY_OPTIONS[4], // Segoe UI
  });

  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Tamaño de fuente base",
    value: TYPOGRAPHY_DEFAULTS.fontSize,
  });

  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Color de fuente base",
    value: { value: TYPOGRAPHY_DEFAULTS.fontColor },
  });

  lineHeight = new formattingSettings.NumUpDown({
    name: "lineHeight",
    displayName: "Alto de línea",
    value: TYPOGRAPHY_DEFAULTS.lineHeight,
  });

  letterSpacing = new formattingSettings.NumUpDown({
    name: "letterSpacing",
    displayName: "Espaciado entre letras",
    value: TYPOGRAPHY_DEFAULTS.letterSpacing,
  });

  bold = new formattingSettings.ToggleSwitch({
    name: "bold",
    displayName: "Negrita",
    value: TYPOGRAPHY_DEFAULTS.bold,
  });

  italic = new formattingSettings.ToggleSwitch({
    name: "italic",
    displayName: "Cursiva",
    value: TYPOGRAPHY_DEFAULTS.italic,
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
