import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class SpacingSettings extends formattingSettings.SimpleCard {
  cellMargin = new formattingSettings.NumUpDown({
    name: "cellMargin",
    displayName: "Margen de celda",
    value: 0,
  });
  columnGap = new formattingSettings.NumUpDown({
    name: "columnGap",
    displayName: "Espacio entre columnas",
    value: 0,
  });
  rowGap = new formattingSettings.NumUpDown({
    name: "rowGap",
    displayName: "Espacio entre filas",
    value: 0,
  });
  minColumnWidth = new formattingSettings.NumUpDown({
    name: "minColumnWidth",
    displayName: "Ancho mínimo de columna",
    value: 60,
  });
  maxColumnWidth = new formattingSettings.NumUpDown({
    name: "maxColumnWidth",
    displayName: "Ancho máximo de columna",
    value: 300,
  });
  minRowHeight = new formattingSettings.NumUpDown({
    name: "minRowHeight",
    displayName: "Alto mínimo de fila",
    value: 20,
  });
  maxRowHeight = new formattingSettings.NumUpDown({
    name: "maxRowHeight",
    displayName: "Alto máximo de fila",
    value: 80,
  });
  wordWrap = new formattingSettings.ToggleSwitch({
    name: "wordWrap",
    displayName: "Ajuste de texto",
    value: true,
  });
  textOverflow = new formattingSettings.ItemDropdown({
    name: "textOverflow",
    displayName: "Desbordamiento de texto",
    items: [
      { value: "clip", displayName: "Recortar" },
      { value: "ellipsis", displayName: "Puntos suspensivos" },
      { value: "wrap", displayName: "Envolver" },
    ],
    value: { value: "ellipsis", displayName: "Puntos suspensivos" },
  });

  name: string = "spacing";
  displayName: string = "Espaciado y dimensiones";
  slices: formattingSettings.Slice[] = [
    this.cellMargin,
    this.columnGap,
    this.rowGap,
    this.minColumnWidth,
    this.maxColumnWidth,
    this.minRowHeight,
    this.maxRowHeight,
    this.wordWrap,
    this.textOverflow,
  ];
}
