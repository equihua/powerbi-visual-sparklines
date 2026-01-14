import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

export class CellElementsSettings extends formattingSettings.SimpleCard {
  name = "cellElements";
  displayName = "Cell elements";

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

  alignment = new formattingSettings.AlignmentGroup({
    name: "alignment",
    displayName: "Alignment",
    mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
    value: "left",
  });

  slices = [
    this.fontColor,
    this.backgroundColor,
    this.alignment,
  ];
}
