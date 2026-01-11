import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

export class NumberFormattingSettings extends formattingSettings.SimpleCard {
  currencySymbol = new formattingSettings.ItemDropdown({
    name: "currencySymbol",
    displayName: "Símbolo de moneda",
    items: [
      { value: "none", displayName: "Ninguno" },
      { value: "$", displayName: "$ (Dólar)" },
      { value: "€", displayName: "€ (Euro)" },
      { value: "£", displayName: "£ (Libra)" },
      { value: "¥", displayName: "¥ (Yen)" },
      { value: "¢", displayName: "¢ (Centavo)" },
    ],
    value: { value: "none", displayName: "Ninguno" },
  });
  currencyPosition = new formattingSettings.ItemDropdown({
    name: "currencyPosition",
    displayName: "Posición de moneda",
    items: [
      { value: "before", displayName: "Antes del número" },
      { value: "after", displayName: "Después del número" },
    ],
    value: { value: "before", displayName: "Antes del número" },
  });
  percentageFormat = new formattingSettings.ToggleSwitch({
    name: "percentageFormat",
    displayName: "Formato de porcentaje",
    value: false,
  });
  scientificNotation = new formattingSettings.ToggleSwitch({
    name: "scientificNotation",
    displayName: "Notación científica",
    value: false,
  });
  negativeNumberFormat = new formattingSettings.ItemDropdown({
    name: "negativeNumberFormat",
    displayName: "Formato negativos",
    items: [
      { value: "minus", displayName: "-1234" },
      { value: "parentheses", displayName: "(1234)" },
      { value: "minusred", displayName: "-1234 (Rojo)" },
      { value: "parenthesesred", displayName: "(1234) (Rojo)" },
    ],
    value: { value: "minus", displayName: "-1234" },
  });
  customNegativeColor = new formattingSettings.ColorPicker({
    name: "customNegativeColor",
    displayName: "Color negativos",
    value: { value: "#ff0000" },
  });

  name: string = "numberFormatting";
  displayName: string = "Formato numérico avanzado";
  slices: formattingSettings.Slice[] = [
    this.currencySymbol,
    this.currencyPosition,
    this.percentageFormat,
    this.scientificNotation,
    this.negativeNumberFormat,
    this.customNegativeColor,
  ];
}
