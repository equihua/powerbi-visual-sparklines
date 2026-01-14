import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";
import { COLUMN_HEADERS_DEFAULTS } from "../constants/visualDefaults";

export interface ColumnHeadersStyle {
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textColor: string;
  backgroundColor: string;
  alignment: "left" | "center" | "right";
  wrapText: boolean;
  autoSizeWidth: boolean;
  resizeBehavior: "fitToContent" | "growToFit";
}

class TextGroup extends formattingSettings.SimpleCard {
  name = "textGroup";
  displayName = "Texto";

  font = new formattingSettings.FontControl({
    name: "font",
    displayName: "Fuente",
    fontFamily: new formattingSettings.FontPicker({
      name: "fontFamily",
      displayName: "Familia",
      value: COLUMN_HEADERS_DEFAULTS.fontFamily,
    }),
    fontSize: new formattingSettings.NumUpDown({
      name: "fontSize",
      displayName: "Tamaño",
      value: COLUMN_HEADERS_DEFAULTS.fontSize,
      options: {
        minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
        maxValue: { value: 72, type: powerbi.visuals.ValidatorType.Max },
      },
    }),
    bold: new formattingSettings.ToggleSwitch({
      name: "bold",
      displayName: "Negrita",
      value: COLUMN_HEADERS_DEFAULTS.bold,
    }),
    italic: new formattingSettings.ToggleSwitch({
      name: "italic",
      displayName: "Cursiva",
      value: COLUMN_HEADERS_DEFAULTS.italic,
    }),
    underline: new formattingSettings.ToggleSwitch({
      name: "underline",
      displayName: "Subrayado",
      value: COLUMN_HEADERS_DEFAULTS.underline,
    }),
  });

  textColor = new formattingSettings.ColorPicker({
    name: "textColor",
    displayName: "Color del texto",
    value: { value: COLUMN_HEADERS_DEFAULTS.textColor },
  });

  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Color de fondo",
    value: { value: COLUMN_HEADERS_DEFAULTS.backgroundColor },
  });

  alignment = new formattingSettings.AlignmentGroup({
    name: "alignment",
    displayName: "Alineación del encabezado",
    mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
    value: COLUMN_HEADERS_DEFAULTS.alignment,
  });

  wrapText = new formattingSettings.ToggleSwitch({
    name: "wrapText",
    displayName: "Ajuste de texto",
    value: COLUMN_HEADERS_DEFAULTS.wrapText,
  });

  slices = [this.font, this.textColor, this.backgroundColor, this.alignment, this.wrapText];
}

class OptionsGroup extends formattingSettings.SimpleCard {
  name = "optionsGroup";
  displayName = "Opciones";

  autoSizeWidth = new formattingSettings.ToggleSwitch({
    name: "autoSizeWidth",
    displayName: "Auto-size width",
    value: COLUMN_HEADERS_DEFAULTS.autoSizeWidth,
  });

  resizeBehavior = new formattingSettings.ItemDropdown({
    name: "resizeBehavior",
    displayName: "Comportamiento de cambio de tamaño",
    items: [
      { value: "fitToContent", displayName: "Ajustar al contenido" },
      { value: "growToFit", displayName: "Aumentar para ajustar" },
    ],
    value: { value: COLUMN_HEADERS_DEFAULTS.resizeBehavior, displayName: "Ajustar al contenido" },
  });

  slices = [this.autoSizeWidth, this.resizeBehavior];
}

export class ColumnHeadersSettings extends formattingSettings.CompositeCard {
  name = "columnHeaders";
  displayName = "Encabezados de columna";

  textGroup = new TextGroup();
  optionsGroup = new OptionsGroup();

  groups: formattingSettings.Group[] = [this.textGroup, this.optionsGroup];

  getStyle(): ColumnHeadersStyle {
    return {
      fontFamily: this.textGroup.font.fontFamily.value as string,
      fontSize: this.textGroup.font.fontSize.value,
      bold: this.textGroup.font.bold.value,
      italic: this.textGroup.font.italic.value,
      underline: this.textGroup.font.underline.value,
      textColor: this.textGroup.textColor.value.value,
      backgroundColor: this.textGroup.backgroundColor.value.value,
      alignment: this.textGroup.alignment.value as "left" | "center" | "right",
      wrapText: this.textGroup.wrapText.value,
      autoSizeWidth: this.optionsGroup.autoSizeWidth.value,
      resizeBehavior: this.optionsGroup.resizeBehavior.value.value as "fitToContent" | "growToFit",
    };
  }
}
