import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class AdvancedBordersSettings extends formattingSettings.SimpleCard {
  borderStyle = new formattingSettings.ItemDropdown({
    name: "borderStyle",
    displayName: "Estilo de borde",
    items: [
      { value: "solid", displayName: "Sólido" },
      { value: "dashed", displayName: "Guionado" },
      { value: "dotted", displayName: "Punteado" },
      { value: "double", displayName: "Doble" },
    ],
    value: { value: "solid", displayName: "Sólido" },
  });
  internalHorizontalBorder = new formattingSettings.ToggleSwitch({
    name: "internalHorizontalBorder",
    displayName: "Borde interno horizontal",
    value: true,
  });
  internalVerticalBorder = new formattingSettings.ToggleSwitch({
    name: "internalVerticalBorder",
    displayName: "Borde interno vertical",
    value: false,
  });
  borderRadius = new formattingSettings.NumUpDown({
    name: "borderRadius",
    displayName: "Radio de esquina",
    value: 0,
  });
  shadowBorder = new formattingSettings.ToggleSwitch({
    name: "shadowBorder",
    displayName: "Sombra de borde",
    value: false,
  });
  shadowColor = new formattingSettings.ColorPicker({
    name: "shadowColor",
    displayName: "Color de sombra",
    value: { value: "#000000" },
  });

  name: string = "advancedBorders";
  displayName: string = "Bordes avanzados";
  slices: formattingSettings.Slice[] = [
    this.borderStyle,
    this.internalHorizontalBorder,
    this.internalVerticalBorder,
    this.borderRadius,
    this.shadowBorder,
    this.shadowColor,
  ];
}
