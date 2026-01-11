import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class CategoryColumnSettings extends formattingSettings.SimpleCard {
  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Color de fuente",
    value: { value: "#000000" },
  });
  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Tamaño de fuente",
    value: 12,
  });
  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Color de fondo",
    value: { value: "#FFFFFF" },
  });
  alignment = new formattingSettings.ItemDropdown({
    name: "alignment",
    displayName: "Alineación",
    items: [
      { value: "left", displayName: "Izquierda" },
      { value: "center", displayName: "Centro" },
      { value: "right", displayName: "Derecha" },
    ],
    value: { value: "left", displayName: "Izquierda" },
  });

  name: string = "categoryColumn";
  displayName: string = "Columna de categoría";
  slices: formattingSettings.Slice[] = [
    this.fontColor,
    this.fontSize,
    this.backgroundColor,
    this.alignment,
  ];
}

export class CategoryCellSettings extends formattingSettings.SimpleCard {
  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Color de fuente",
    value: { value: "#000000" },
  });
  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Tamaño de fuente",
    value: 12,
  });
  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Color de fondo",
    value: { value: "#FFFFFF" },
  });
  padding = new formattingSettings.NumUpDown({
    name: "padding",
    displayName: "Espaciado interno",
    value: 6,
  });
  alignment = new formattingSettings.ItemDropdown({
    name: "alignment",
    displayName: "Alineación",
    items: [
      { value: "left", displayName: "Izquierda" },
      { value: "center", displayName: "Centro" },
      { value: "right", displayName: "Derecha" },
    ],
    value: { value: "left", displayName: "Izquierda" },
  });

  name: string = "categoryCell";
  displayName: string = "Celda de categoría";
  slices: formattingSettings.Slice[] = [
    this.fontColor,
    this.fontSize,
    this.backgroundColor,
    this.padding,
    this.alignment,
  ];
}

export class ColumnHeaderSettings extends formattingSettings.SimpleCard {
  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Color de fuente",
    value: { value: "#000000" },
  });
  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Tamaño de fuente",
    value: 12,
  });
  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Color de fondo",
    value: { value: "#FFFFFF" },
  });
  alignment = new formattingSettings.ItemDropdown({
    name: "alignment",
    displayName: "Alineación",
    items: [
      { value: "left", displayName: "Izquierda" },
      { value: "center", displayName: "Centro" },
      { value: "right", displayName: "Derecha" },
    ],
    value: { value: "left", displayName: "Izquierda" },
  });
  padding = new formattingSettings.NumUpDown({
    name: "padding",
    displayName: "Espaciado interno",
    value: 6,
  });
  bold = new formattingSettings.ToggleSwitch({
    name: "bold",
    displayName: "Negrita",
    value: true,
  });

  name: string = "columnHeader";
  displayName: string = "Encabezado de columna";
  slices: formattingSettings.Slice[] = [
    this.fontColor,
    this.fontSize,
    this.backgroundColor,
    this.alignment,
    this.padding,
    this.bold,
  ];
}

export class MeasureColumnSettings extends formattingSettings.SimpleCard {
  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Color de fuente",
    value: { value: "#000000" },
  });
  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Tamaño de fuente",
    value: 12,
  });
  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Color de fondo",
    value: { value: "#FFFFFF" },
  });
  alignment = new formattingSettings.ItemDropdown({
    name: "alignment",
    displayName: "Alineación",
    items: [
      { value: "left", displayName: "Izquierda" },
      { value: "center", displayName: "Centro" },
      { value: "right", displayName: "Derecha" },
    ],
    value: { value: "right", displayName: "Derecha" },
  });
  columnWidth = new formattingSettings.NumUpDown({
    name: "columnWidth",
    displayName: "Ancho de columna",
    value: 120,
  });

  name: string = "measureColumn";
  displayName: string = "Columna de medida";
  slices: formattingSettings.Slice[] = [
    this.fontColor,
    this.fontSize,
    this.backgroundColor,
    this.alignment,
    this.columnWidth,
  ];
}
