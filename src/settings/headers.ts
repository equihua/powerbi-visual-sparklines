import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class HeaderFormattingSettings extends formattingSettings.SimpleCard {
  headerAlignment = new formattingSettings.ItemDropdown({
    name: "headerAlignment",
    displayName: "Alineación",
    items: [
      { value: "left", displayName: "Izquierda" },
      { value: "center", displayName: "Centro" },
      { value: "right", displayName: "Derecha" },
    ],
    value: { value: "left", displayName: "Izquierda" },
  });
  headerPadding = new formattingSettings.NumUpDown({
    name: "headerPadding",
    displayName: "Espaciado interno",
    value: 6,
  });
  headerBold = new formattingSettings.ToggleSwitch({
    name: "headerBold",
    displayName: "Negrita",
    value: true,
  });

  name: string = "headerFormatting";
  displayName: string = "Formato de encabezado";
  slices: formattingSettings.Slice[] = [
    this.headerAlignment,
    this.headerPadding,
    this.headerBold,
  ];
}

export class HeaderAdvancedSettings extends formattingSettings.SimpleCard {
  headerHeight = new formattingSettings.NumUpDown({
    name: "headerHeight",
    displayName: "Altura de encabezado",
    value: 28,
  });
  stickyHeader = new formattingSettings.ToggleSwitch({
    name: "stickyHeader",
    displayName: "Encabezado fijo",
    value: false,
  });
  multilineHeader = new formattingSettings.ToggleSwitch({
    name: "multilineHeader",
    displayName: "Encabezado en múltiples líneas",
    value: false,
  });
  alternatingHeaderColor = new formattingSettings.ColorPicker({
    name: "alternatingHeaderColor",
    displayName: "Color de encabezado alternado",
    value: { value: "#ffffff" },
  });
  headerBorderColor = new formattingSettings.ColorPicker({
    name: "headerBorderColor",
    displayName: "Color de borde de encabezado",
    value: { value: "#E0E0E0" },
  });
  headerSeparator = new formattingSettings.ToggleSwitch({
    name: "headerSeparator",
    displayName: "Separador de encabezado",
    value: true,
  });

  name: string = "headerAdvanced";
  displayName: string = "Encabezado avanzado";
  slices: formattingSettings.Slice[] = [
    this.headerHeight,
    this.stickyHeader,
    this.multilineHeader,
    this.alternatingHeaderColor,
    this.headerBorderColor,
    this.headerSeparator,
  ];
}
