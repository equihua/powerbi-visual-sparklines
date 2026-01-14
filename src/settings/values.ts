import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";
import { VALUES_DEFAULTS, TextAlignment } from "../constants/visualDefaults";

export interface ValuesStyle {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textColor: string;
  backgroundColor: string;
  alternateTextColor: string;
  alternateBackgroundColor: string;
}

export class ValuesCard extends formattingSettings.SimpleCard {
  font = new formattingSettings.FontControl({
    name: "font",
    displayName: "Fuente",
    fontFamily: new formattingSettings.FontPicker({
      name: "fontFamily",
      displayName: "Familia",
      value: VALUES_DEFAULTS.fontFamily,
    }),
    fontSize: new formattingSettings.NumUpDown({
      name: "fontSize",
      displayName: "Tamaño",
      value: VALUES_DEFAULTS.fontSize,
      options: {
        minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
        maxValue: { value: 72, type: powerbi.visuals.ValidatorType.Max },
      },
    }),
    bold: new formattingSettings.ToggleSwitch({
      name: "bold",
      displayName: "Negrita",
      value: VALUES_DEFAULTS.bold,
    }),
    italic: new formattingSettings.ToggleSwitch({
      name: "italic",
      displayName: "Cursiva",
      value: VALUES_DEFAULTS.italic,
    }),
    underline: new formattingSettings.ToggleSwitch({
      name: "underline",
      displayName: "Subrayado",
      value: VALUES_DEFAULTS.underline,
    }),
  });

  textColor = new formattingSettings.ColorPicker({
    name: "textColor",
    displayName: "Color del texto",
    value: { value: VALUES_DEFAULTS.textColor },
  });

  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Color de fondo",
    value: { value: VALUES_DEFAULTS.backgroundColor },
  });

  alternateTextColor = new formattingSettings.ColorPicker({
    name: "alternateTextColor",
    displayName: "Color del texto alternativo",
    value: { value: VALUES_DEFAULTS.alternateTextColor },
  });

  alternateBackgroundColor = new formattingSettings.ColorPicker({
    name: "alternateBackgroundColor",
    displayName: "Alternar color de fondo",
    value: { value: VALUES_DEFAULTS.alternateBackgroundColor },
  });

  alignment = new formattingSettings.AlignmentGroup({
    name: "alignment",
    displayName: "Alineación",
    mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
    value: TextAlignment.Left,
  });

  wrapText = new formattingSettings.ToggleSwitch({
    name: "wrapText",
    displayName: "Ajustar texto",
    value: false,
  });

  name: string = "values";
  displayName: string = "Valores";
  slices = [
    this.font,
    this.textColor,
    this.backgroundColor,
    this.alternateTextColor,
    this.alternateBackgroundColor,
    this.alignment,
    this.wrapText,
  ];

  getStyle(): ValuesStyle {
    return {
      fontFamily: this.font.fontFamily.value as string,
      fontSize: this.font.fontSize.value,
      bold: this.font.bold.value,
      italic: this.font.italic.value,
      underline: this.font.underline.value,
      textColor: this.textColor.value.value,
      backgroundColor: this.backgroundColor.value.value,
      alternateTextColor: this.alternateTextColor.value.value,
      alternateBackgroundColor: this.alternateBackgroundColor.value.value,
    };
  }
}
