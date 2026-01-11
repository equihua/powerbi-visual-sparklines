import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

/**
 * Configuraciones de filas.
 * Define altura, colores alternados y efectos hover para las filas.
 */
export class RowsSettings extends formattingSettings.SimpleCard {
  rowHeight = new formattingSettings.NumUpDown({
    name: "rowHeight",
    displayName: "Alto de fila",
    value: 28,
  });
  alternatingRowColor = new formattingSettings.ColorPicker({
    name: "alternatingRowColor",
    displayName: "Color de fila alternada",
    value: { value: "#f9f9f9" },
  });
  hoverBackgroundColor = new formattingSettings.ColorPicker({
    name: "hoverBackgroundColor",
    displayName: "Color de fondo hover",
    value: { value: "#f0f7ff" },
  });
  rowPadding = new formattingSettings.NumUpDown({
    name: "rowPadding",
    displayName: "Espaciado interno de filas",
    value: 6,
  });

  name: string = "rows";
  displayName: string = "Filas";
  slices: formattingSettings.Slice[] = [
    this.rowHeight,
    this.alternatingRowColor,
    this.hoverBackgroundColor,
    this.rowPadding,
  ];
}
