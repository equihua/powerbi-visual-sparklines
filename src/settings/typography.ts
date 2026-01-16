import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";
import {
  FONT_FAMILY_OPTIONS,
  TYPOGRAPHY_DEFAULTS,
  TextAlignment,
} from "../constants/visualDefaults";

export type TypographyApplyTo = "all" | "column";

export interface TypographyStyle {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline";
  lineHeight: number;
  letterSpacing: number;
  alignment: "left" | "center" | "right";
  applyTo: TypographyApplyTo;
  targetColumn: string;
}

/**
 * TypographyCard - Tarjeta de tipografía moderna usando FontControl
 *
 * Estructura:
 * - FontControl (nombre: "font", displayName: "Fuente")
 *   - FontPicker para fontFamily
 *   - NumUpDown para fontSize
 *   - ToggleSwitch para bold, italic
 * - ColorPicker para fontColor (adicional, fuera del FontControl)
 * - NumUpDown para lineHeight, letterSpacing (adicionales)
 *
 * Nota: En Power BI, FontControl es un control compuesto que agrupa
 * familia, tamaño y propiedades básicas (B/I/U).
 */
export class TypographyCard extends formattingSettings.SimpleCard {
  applyTo = new formattingSettings.ItemDropdown({
    name: "applyTo",
    displayName: "Aplicar a",
    items: [
      { value: "all", displayName: "Toda la tabla" },
      { value: "column", displayName: "Columna específica" },
    ],
    value: { value: TYPOGRAPHY_DEFAULTS.applyTo, displayName: "Toda la tabla" },
  });

  targetColumn = new formattingSettings.ItemDropdown({
    name: "targetColumn",
    displayName: "Columna objetivo",
    items: [],
    value: { value: TYPOGRAPHY_DEFAULTS.targetColumn, displayName: "" },
  });

  // FontControl - Control compuesto de fuente moderna
  font = new formattingSettings.FontControl({
    name: "font",
    displayName: "Fuente",
    fontFamily: new formattingSettings.FontPicker({
      name: "fontFamily",
      displayName: "Familia",
      value: TYPOGRAPHY_DEFAULTS.fontFamily,
    }),
    fontSize: new formattingSettings.NumUpDown({
      name: "fontSize",
      displayName: "Tamaño",
      value: TYPOGRAPHY_DEFAULTS.fontSize,
      options: {
        minValue: { value: 8, type: powerbi.visuals.ValidatorType.Min },
        maxValue: { value: 72, type: powerbi.visuals.ValidatorType.Max },
      },
    }),
    bold: new formattingSettings.ToggleSwitch({
      name: "bold",
      displayName: "Negrita",
      value: TYPOGRAPHY_DEFAULTS.bold,
    }),
    italic: new formattingSettings.ToggleSwitch({
      name: "italic",
      displayName: "Cursiva",
      value: TYPOGRAPHY_DEFAULTS.italic,
    }),
    underline: new formattingSettings.ToggleSwitch({
      name: "underline",
      displayName: "Subrayado",
      value: TYPOGRAPHY_DEFAULTS.underline,
    }),
  });

  // Propiedades adicionales de tipografía no cubiertas por FontControl
  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Color de fuente",
    value: { value: TYPOGRAPHY_DEFAULTS.fontColor },
  });

  lineHeight = new formattingSettings.NumUpDown({
    name: "lineHeight",
    displayName: "Alto de línea",
    value: TYPOGRAPHY_DEFAULTS.lineHeight,
    options: {
      minValue: { value: 0.8, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 3, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  letterSpacing = new formattingSettings.NumUpDown({
    name: "letterSpacing",
    displayName: "Espaciado entre letras",
    value: TYPOGRAPHY_DEFAULTS.letterSpacing,
    options: {
      minValue: { value: -5, type: powerbi.visuals.ValidatorType.Min },
      maxValue: { value: 5, type: powerbi.visuals.ValidatorType.Max },
    },
  });

  alignment = new formattingSettings.AlignmentGroup({
    name: "alignment",
    displayName: "Alineación",
    mode: powerbi.visuals.AlignmentGroupMode.Horizonal,
    value: TextAlignment.Left,
  });

  name: string = "typography";
  displayName: string = "Tipografía";
  slices: formattingSettings.Slice[] = [
    this.applyTo,
    this.targetColumn,
    this.font,
    this.fontColor,
    this.alignment,
    this.lineHeight,
    this.letterSpacing,
  ];

  public setTargetColumns(columnNames: string[]): void {
    const items = columnNames.map((name) => ({
      value: name,
      displayName: name,
    }));

    this.targetColumn.items = items;

    const current = this.targetColumn.value?.value;
    const fallback = items[0]?.value ?? "";
    const nextValue = items.find((i) => i.value === current)?.value ?? fallback;

    this.targetColumn.value = { value: nextValue, displayName: nextValue };
  }
}
