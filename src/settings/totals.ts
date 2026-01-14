import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";
import { TOTALS_DEFAULTS } from "../constants/visualDefaults";

export interface TotalsStyle {
  show: boolean;
  label: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textColor: string;
  backgroundColor: string;
}

export class TotalsSettings extends formattingSettings.SimpleCard {
  name = "totals";
  displayName = "Totales";

  show = new formattingSettings.ToggleSwitch({
    name: "show",
    displayName: "Valores",
    value: TOTALS_DEFAULTS.show,
  });

  label = new formattingSettings.TextInput({
    name: "label",
    displayName: "Etiqueta de total",
    value: TOTALS_DEFAULTS.label,
    placeholder: "Total",
  });

  font = new formattingSettings.FontControl({
    name: "font",
    displayName: "Fuente",
    fontFamily: new formattingSettings.FontPicker({
      name: "fontFamily",
      displayName: "Familia",
      value: TOTALS_DEFAULTS.fontFamily,
    }),
    fontSize: new formattingSettings.NumUpDown({
      name: "fontSize",
      displayName: "Tamaño",
      value: TOTALS_DEFAULTS.fontSize,
      options: {
        minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
        maxValue: { value: 72, type: powerbi.visuals.ValidatorType.Max },
      },
    }),
    bold: new formattingSettings.ToggleSwitch({
      name: "bold",
      displayName: "Negrita",
      value: TOTALS_DEFAULTS.bold,
    }),
    italic: new formattingSettings.ToggleSwitch({
      name: "italic",
      displayName: "Cursiva",
      value: TOTALS_DEFAULTS.italic,
    }),
    underline: new formattingSettings.ToggleSwitch({
      name: "underline",
      displayName: "Subrayado",
      value: TOTALS_DEFAULTS.underline,
    }),
  });

  textColor = new formattingSettings.ColorPicker({
    name: "textColor",
    displayName: "Color del texto",
    value: { value: TOTALS_DEFAULTS.textColor },
  });

  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Color de fondo",
    value: { value: TOTALS_DEFAULTS.backgroundColor },
  });

  slices = [
    this.show,
    this.label,
    this.font,
    this.textColor,
    this.backgroundColor,
  ];

  getStyle(): TotalsStyle {
    return {
      show: this.show.value,
      label: this.label.value,
      fontFamily: this.font.fontFamily.value as string,
      fontSize: this.font.fontSize.value,
      bold: this.font.bold.value,
      italic: this.font.italic.value,
      underline: this.font.underline.value,
      textColor: this.textColor.value.value,
      backgroundColor: this.backgroundColor.value.value,
    };
  }
}
