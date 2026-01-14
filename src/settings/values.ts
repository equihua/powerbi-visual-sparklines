import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

export class ValuesSettings extends formattingSettings.SimpleCard {
  name = "values";
  displayName = "Values";

  fontFamily = new formattingSettings.FontPicker({
    name: "fontFamily",
    displayName: "Font family",
    value: "Segoe UI, wf_segoe-ui_normal, helvetica, arial, sans-serif",
  });

  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Text size",
    value: 11,
    options: {
      minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 40, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  bold = new formattingSettings.ToggleSwitch({
    name: "bold",
    displayName: "Bold",
    value: false,
  });

  italic = new formattingSettings.ToggleSwitch({
    name: "italic",
    displayName: "Italic",
    value: false,
  });

  underline = new formattingSettings.ToggleSwitch({
    name: "underline",
    displayName: "Underline",
    value: false,
  });

  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Font color",
    value: { value: "#000000" },
  });

  backgroundColor = new formattingSettings.ColorPicker({
    name: "backgroundColor",
    displayName: "Background color",
    value: { value: "#FFFFFF" },
  });

  alignment = new formattingSettings.ItemDropdown({
    name: "alignment",
    displayName: "Alignment",
    items: [
      { displayName: "Left", value: "left" },
      { displayName: "Center", value: "center" },
      { displayName: "Right", value: "right" },
    ],
    value: { displayName: "Left", value: "left" },
  });

  altBackgroundColor = new formattingSettings.ColorPicker({
    name: "altBackgroundColor",
    displayName: "Alternate background color",
    value: { value: "#F9F9F9" },
  });

  wrapText = new formattingSettings.ToggleSwitch({
    name: "wrapText",
    displayName: "Wrap text",
    value: false,
  });

  slices = [
    this.fontFamily,
    this.fontSize,
    this.bold,
    this.italic,
    this.underline,
    this.fontColor,
    this.backgroundColor,
    this.alignment,
    this.altBackgroundColor,
    this.wrapText,
  ];
}
