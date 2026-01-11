import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

/**
 * Configuraciones tipográficas avanzadas.
 * Define familia de fuente, estilos de texto y espaciado.
 */
export class TypographySettings extends formattingSettings.SimpleCard {
  fontFamily = new formattingSettings.ItemDropdown({
    name: "fontFamily",
    displayName: "Familia de fuente",
    items: [
      { value: "arial", displayName: "Arial" },
      { value: "verdana", displayName: "Verdana" },
      { value: "georgia", displayName: "Georgia" },
      { value: "courier", displayName: "Courier" },
      { value: "segoe", displayName: "Segoe UI" },
    ],
    value: { value: "segoe", displayName: "Segoe UI" },
  });
  italic = new formattingSettings.ToggleSwitch({
    name: "italic",
    displayName: "Cursiva",
    value: false,
  });
  underline = new formattingSettings.ToggleSwitch({
    name: "underline",
    displayName: "Subrayado",
    value: false,
  });
  strikethrough = new formattingSettings.ToggleSwitch({
    name: "strikethrough",
    displayName: "Tachado",
    value: false,
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

  name: string = "typography";
  displayName: string = "Tipografía avanzada";
  slices: formattingSettings.Slice[] = [
    this.fontFamily,
    this.italic,
    this.underline,
    this.strikethrough,
    this.lineHeight,
    this.letterSpacing,
  ];
}
