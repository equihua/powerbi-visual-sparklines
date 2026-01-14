import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

export class GridSettings extends formattingSettings.SimpleCard {
  name = "grid";
  displayName = "Grid";

  showHorizontal = new formattingSettings.ToggleSwitch({
    name: "showHorizontal",
    displayName: "Horizontal gridlines",
    value: true,
  });

  showVertical = new formattingSettings.ToggleSwitch({
    name: "showVertical",
    displayName: "Vertical gridlines",
    value: false,
  });

  gridHorizontalColor = new formattingSettings.ColorPicker({
    name: "gridHorizontalColor",
    displayName: "Horizontal gridlines color",
    value: { value: "#E0E0E0" },
  });

  gridVerticalColor = new formattingSettings.ColorPicker({
    name: "gridVerticalColor",
    displayName: "Vertical gridlines color",
    value: { value: "#E0E0E0" },
  });

  borderColor = new formattingSettings.ColorPicker({
    name: "borderColor",
    displayName: "Outline color",
    value: { value: "#CCCCCC" },
  });

  borderWeight = new formattingSettings.NumUpDown({
    name: "borderWeight",
    displayName: "Outline weight",
    value: 1,
    options: {
      minValue: { value: 0, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 10, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  slices = [
    this.showHorizontal,
    this.showVertical,
    this.gridHorizontalColor,
    this.gridVerticalColor,
    this.borderColor,
    this.borderWeight,
  ];
}
