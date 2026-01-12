import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import {
  TABLE_STYLE_OPTIONS,
  GENERAL_DEFAULTS,
  VALIDATORS,
} from "../constants/visualDefaults";

/**
 * Configuraciones generales del visual.
 * Controla el estilo de tabla y tamaño de texto global.
 */
export class GeneralSettings extends formattingSettings.SimpleCard {
  tableStyle = new formattingSettings.ItemDropdown({
    name: "tableStyle",
    displayName: "Estilo",
    items: [...TABLE_STYLE_OPTIONS],
    value: TABLE_STYLE_OPTIONS[0],
  });

  textSize = new formattingSettings.NumUpDown({
    name: "textSize",
    displayName: "Tamaño de texto",
    value: GENERAL_DEFAULTS.textSize,
    options: {
      minValue: VALIDATORS.textSize.min,
      maxValue: VALIDATORS.textSize.max,
    },
  });

  name: string = "general";
  displayName: string = "General";
  slices: formattingSettings.Slice[] = [this.tableStyle, this.textSize];
}
