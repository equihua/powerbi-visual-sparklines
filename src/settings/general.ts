import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

/**
 * Configuraciones generales del visual.
 * Controla el estilo de tabla y tamaño de texto global.
 */
export class GeneralSettings extends formattingSettings.SimpleCard {
  tableStyle = new formattingSettings.ItemDropdown({
    name: "tableStyle",
    displayName: "Estilo",
    items: [
      { value: "default", displayName: "Predeterminado" },
      { value: "striped", displayName: "A rayas" },
    ],
    value: { value: "default", displayName: "Predeterminado" },
  });

  textSize = new formattingSettings.NumUpDown({
    name: "textSize",
    displayName: "Tamaño de texto",
    value: 12,
    options: {
      minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 40, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  name: string = "general";
  displayName: string = "General";
  slices: formattingSettings.Slice[] = [this.tableStyle, this.textSize];
}
