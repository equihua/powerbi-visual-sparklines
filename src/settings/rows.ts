import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

class RowDimensionsGroup extends formattingSettings.SimpleCard {
  rowHeight = new formattingSettings.NumUpDown({
    name: "rowHeight",
    displayName: "Alto de fila",
    value: 28,
  });

  rowPadding = new formattingSettings.NumUpDown({
    name: "rowPadding",
    displayName: "Espaciado interno",
    value: 6,
  });

  name: string = "rowDimensions";
  displayName: string = "Dimensiones";
  slices: formattingSettings.Slice[] = [
    this.rowHeight,
    this.rowPadding,
  ];
}

class RowColorsGroup extends formattingSettings.SimpleCard {
  alternatingRowColor = new formattingSettings.ColorPicker({
    name: "alternatingRowColor",
    displayName: "Color alternado",
    value: { value: "#f9f9f9" },
  });

  name: string = "rowColors";
  displayName: string = "Colores";
  slices: formattingSettings.Slice[] = [
    this.alternatingRowColor,
  ];
}

class RowEffectsGroup extends formattingSettings.SimpleCard {
  hoverBackgroundColor = new formattingSettings.ColorPicker({
    name: "hoverBackgroundColor",
    displayName: "Color hover",
    value: { value: "#f0f7ff" },
  });

  name: string = "rowEffects";
  displayName: string = "Efectos";
  slices: formattingSettings.Slice[] = [
    this.hoverBackgroundColor,
  ];
}

export class RowsSettings extends formattingSettings.CompositeCard {
  rowDimensionsGroup = new RowDimensionsGroup();
  rowColorsGroup = new RowColorsGroup();
  rowEffectsGroup = new RowEffectsGroup();

  name: string = "rows";
  displayName: string = "Filas";
  groups: formattingSettings.Group[] = [
    this.rowDimensionsGroup,
    this.rowColorsGroup,
    this.rowEffectsGroup,
  ];
}
