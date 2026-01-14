import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

export class ColumnHeadersSettings extends formattingSettings.SimpleCard {
  name = "columnHeaders";
  displayName = "Column headers";

  fontFamily = new formattingSettings.FontPicker({
    name: "fontFamily",
    displayName: "Font family",
    value: "Segoe UI, wf_segoe-ui_normal, helvetica, arial, sans-serif",
  });

  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Text size",
    value: 12,
    options: {
      minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 40, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  bold = new formattingSettings.ToggleSwitch({
    name: "bold",
    displayName: "Bold",
    value: true,
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
    value: { value: "#F2F2F2" },
  });

  alignment = new formattingSettings.AlignmentGroup({
    name: "alignment",
    displayName: "Alignment",
    mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
    value: "center",
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
    this.wrapText,
  ];
}
