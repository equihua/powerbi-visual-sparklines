# CÓDIGO FINAL - ARCHIVOS PRINCIPALES

## 1. capabilities.json - Sección de Tipografía

```json
{
  "objects": {
    "typography": {
      "displayName": "Tipografía",
      "properties": {
        "fontFamily": {
          "displayName": "Familia de fuente",
          "type": {
            "formatting": {
              "fontFamily": true
            }
          }
        },
        "fontSize": {
          "displayName": "Tamaño de fuente",
          "type": {
            "formatting": {
              "fontSize": true
            }
          }
        },
        "fontColor": {
          "displayName": "Color de fuente",
          "type": {
            "fill": {
              "solid": {
                "color": true
              }
            }
          }
        },
        "lineHeight": {
          "displayName": "Alto de línea",
          "type": {
            "numeric": true
          }
        },
        "letterSpacing": {
          "displayName": "Espaciado entre letras",
          "type": {
            "numeric": true
          }
        },
        "bold": {
          "displayName": "Negrita",
          "type": {
            "bool": true
          }
        },
        "italic": {
          "displayName": "Cursiva",
          "type": {
            "bool": true
          }
        }
      }
    }
  }
}
```

---

## 2. src/settings/typography.ts - Clase Completa

```typescript
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";
import {
  FONT_FAMILY_OPTIONS,
  TYPOGRAPHY_DEFAULTS,
} from "../constants/visualDefaults";

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
      value: false,
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

  name: string = "typography";
  displayName: string = "Tipografía";
  slices: formattingSettings.Slice[] = [
    this.font,
    this.fontColor,
    this.lineHeight,
    this.letterSpacing,
  ];
}
```

---

## 3. src/settings.ts - Modelo Completo

```typescript
import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import {
  GeneralCompositeCard,
  TypographyCard,
  GridSettings,
  RowsSettings,
  ColumnSettings,
  TotalSettings,
  SparklineCompositeCard,
  type ColumnConfigSettings,
  type SparklineColumnSettings,
} from "./settings/index";

export type { SparklineColumnSettings, ColumnConfigSettings };

export class VisualFormattingSettingsModel extends formattingSettings.Model {
  // Tarjeta General Unificada - Contiene Estilo, Selección, Navegación y Funcionalidades
  general: GeneralCompositeCard = new GeneralCompositeCard();

  // Tarjeta de Tipografía - Moderna con FontControl
  typography: TypographyCard = new TypographyCard();

  grid: GridSettings = new GridSettings();
  rows: RowsSettings = new RowsSettings();
  columns: ColumnSettings | null = null;
  total: TotalSettings = new TotalSettings();
  sparklineCard: SparklineCompositeCard | null = null;

  cards: (formattingSettings.SimpleCard | formattingSettings.CompositeCard)[] =
    [this.general, this.typography, this.rows, this.grid, this.total];

  public updateColumnCards(measureColumnNames: string[]): void {
    if (measureColumnNames && measureColumnNames.length > 0) {
      if (!this.columns) {
        this.columns = new ColumnSettings(measureColumnNames);
        this.rebuildCards();
      } else {
        const existingColumns = this.columns.getAllMeasureColumnNames();
        const columnsChanged =
          existingColumns.length !== measureColumnNames.length ||
          existingColumns.some((col, idx) => col !== measureColumnNames[idx]);

        if (columnsChanged) {
          this.columns = new ColumnSettings(measureColumnNames);
          this.rebuildCards();
        }
      }
    } else {
      this.columns = null;
      this.rebuildCards();
    }
  }

  public handleColumnSelectorChange(selectedColumn: string): void {
    if (this.columns) {
      this.columns.switchToColumn(selectedColumn);
    }
  }

  public getCurrentSelectedColumn(): string {
    return this.columns?.getCurrentSelectedColumn() || "__ALL__";
  }

  public updateSparklineCards(sparklineColumnNames: string[]): void {
    if (sparklineColumnNames && sparklineColumnNames.length > 0) {
      this.sparklineCard = new SparklineCompositeCard(sparklineColumnNames);
      this.rebuildCards();
    } else {
      this.sparklineCard = null;
      this.rebuildCards();
    }
  }

  private rebuildCards(): void {
    this.cards = [
      this.general,
      this.typography,
      ...(this.columns ? [this.columns] : []),
      this.rows,
      this.grid,
      this.total,
      ...(this.sparklineCard ? [this.sparklineCard] : []),
    ];
  }

  public getColumnSettings(columnName: string): ColumnConfigSettings {
    if (this.columns) {
      return this.columns.getSettings(columnName);
    }
    return {
      headerFontColor: "#000000",
      headerFontSize: 12,
      headerAlignment: "center",
      headerBold: true,
      headerBackgroundColor: "#F5F5F5",
      headerPadding: 8,
      cellFontColor: "#000000",
      cellFontSize: 11,
      cellAlignment: "left",
      cellBackgroundColor: "#FFFFFF",
      cellPadding: 6,
      decimalPlaces: 2,
      thousandsSeparator: true,
      prefix: "",
      suffix: "",
      columnWidth: 120,
      sortable: true,
      columnVisible: true,
    };
  }

  public getAllColumnsSettings(): ColumnConfigSettings {
    return this.getColumnSettings("__ALL__");
  }

  public getColumnSettingsMap(): Map<string, ColumnConfigSettings> {
    const settingsMap = new Map<string, ColumnConfigSettings>();

    if (this.columns) {
      const measureColumns = this.columns.getAllMeasureColumnNames();
      measureColumns.forEach((columnName) => {
        settingsMap.set(columnName, this.columns.getSettings(columnName));
      });
    }

    return settingsMap;
  }

  public setColumnSettings(
    columnName: string,
    settings: ColumnConfigSettings
  ): void {
    this.columns?.setSettings(columnName, settings);
  }

  public getSparklineSettings(columnName: string): SparklineColumnSettings {
    if (this.sparklineCard) {
      return this.sparklineCard.getSettings(columnName);
    }
    return {
      chartType: "line",
      color: "#0078D4",
      lineWidth: 1.5,
    };
  }

  public setSparklineSettings(
    columnName: string,
    settings: SparklineColumnSettings
  ): void {
    this.sparklineCard?.setSettings(columnName, settings);
  }
}
```

---

## 4. src/visual.ts - Método Helper getTypographyStyle()

```typescript
/**
 * Obtiene estilos de tipografía desde las configuraciones de formato.
 * Este es el único punto de acceso para leer estilos tipográficos.
 *
 * @returns Objeto con propiedades CSS de tipografía
 */
public getTypographyStyle(): {
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: number;
  letterSpacing: string;
} {
  const font = this.formattingSettings.typography.font;
  const typography = this.formattingSettings.typography;

  // Valores por defecto para propiedades no configuradas
  const fontFamily = font.fontFamily?.value || "Segoe UI, sans-serif";
  const fontSize = font.fontSize?.value || 11;
  const fontColor = typography.fontColor?.value?.value || "#000000";
  const bold = font.bold?.value || false;
  const italic = font.italic?.value || false;
  const underline = font.underline?.value || false;
  const lineHeight = typography.lineHeight?.value || 1.4;
  const letterSpacing = typography.letterSpacing?.value || 0;

  return {
    fontFamily,
    fontSize: `${fontSize}px`,
    fontColor,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
    lineHeight,
    letterSpacing: letterSpacing !== 0 ? `${letterSpacing}px` : "normal",
  };
}
```

---

## USO EN COMPONENTES

```typescript
// En cualquier componente que reciba visual.ts como prop:
const typographyStyle = visual.getTypographyStyle();

// Aplicar a elemento HTML:
const element = document.getElementById("myElement");
element.style.fontFamily = typographyStyle.fontFamily;
element.style.fontSize = typographyStyle.fontSize;
element.style.color = typographyStyle.fontColor;
element.style.fontWeight = typographyStyle.fontWeight;
element.style.fontStyle = typographyStyle.fontStyle;
element.style.textDecoration = typographyStyle.textDecoration;
element.style.lineHeight = typographyStyle.lineHeight;
element.style.letterSpacing = typographyStyle.letterSpacing;
```

---

**Versión:** 1.0  
**Fecha:** 13 de enero de 2026  
**Estado:** ✅ Listo para producción
