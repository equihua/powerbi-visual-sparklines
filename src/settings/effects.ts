import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class VisualEffectsSettings extends formattingSettings.SimpleCard {
  cellShadow = new formattingSettings.ToggleSwitch({
    name: "cellShadow",
    displayName: "Sombra de celda",
    value: false,
  });
  shadowOpacity = new formattingSettings.NumUpDown({
    name: "shadowOpacity",
    displayName: "Opacidad de sombra",
    value: 0.2,
  });
  rowOpacity = new formattingSettings.NumUpDown({
    name: "rowOpacity",
    displayName: "Opacidad de fila",
    value: 1,
  });
  hoverTransition = new formattingSettings.NumUpDown({
    name: "hoverTransition",
    displayName: "Transición hover (ms)",
    value: 150,
  });
  hoverEffect = new formattingSettings.ItemDropdown({
    name: "hoverEffect",
    displayName: "Efecto de hover",
    items: [
      { value: "none", displayName: "Ninguno" },
      { value: "highlight", displayName: "Resaltar" },
      { value: "shadow", displayName: "Sombra" },
      { value: "scale", displayName: "Escala" },
    ],
    value: { value: "highlight", displayName: "Resaltar" },
  });
  rowHighlight = new formattingSettings.ToggleSwitch({
    name: "rowHighlight",
    displayName: "Resaltar fila completa",
    value: true,
  });

  name: string = "visualEffects";
  displayName: string = "Efectos visuales";
  slices: formattingSettings.Slice[] = [
    this.cellShadow,
    this.shadowOpacity,
    this.rowOpacity,
    this.hoverTransition,
    this.hoverEffect,
    this.rowHighlight,
  ];
}
