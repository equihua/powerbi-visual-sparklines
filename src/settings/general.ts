import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import {
  TABLE_STYLE_OPTIONS,
  GENERAL_DEFAULTS,
  VALIDATORS,
  FONT_FAMILY_OPTIONS,
  TYPOGRAPHY_DEFAULTS,
} from "../constants/visualDefaults";

/**
 * Grupo Estilo - Configuraciones básicas de estilo de tabla
 */
class StyleGroup extends formattingSettings.SimpleCard {
  tableStyle = new formattingSettings.ItemDropdown({
    name: "tableStyle",
    displayName: "Estilo",
    items: [...TABLE_STYLE_OPTIONS],
    value: TABLE_STYLE_OPTIONS[0],
  });

  textSize = new formattingSettings.NumUpDown({
    name: "textSize",
    displayName: "Tamaño de texto",
    value: GENERAL_DEFAULTS.textSize,
    options: {
      minValue: VALIDATORS.textSize.min,
      maxValue: VALIDATORS.textSize.max,
    },
  });

  name: string = "styleSection";
  displayName: string = "Estilo";
  slices: formattingSettings.Slice[] = [this.tableStyle, this.textSize];
}

/**
 * Grupo Tipografía - Configuraciones de tipografía global
 */
class TypographyGroup extends formattingSettings.SimpleCard {
  fontFamily = new formattingSettings.ItemDropdown({
    name: "fontFamily",
    displayName: "Familia de fuente",
    items: [...FONT_FAMILY_OPTIONS],
    value: FONT_FAMILY_OPTIONS[4],
  });

  fontSize = new formattingSettings.NumUpDown({
    name: "fontSize",
    displayName: "Tamaño de fuente base",
    value: TYPOGRAPHY_DEFAULTS.fontSize,
  });

  fontColor = new formattingSettings.ColorPicker({
    name: "fontColor",
    displayName: "Color de fuente base",
    value: { value: TYPOGRAPHY_DEFAULTS.fontColor },
  });

  lineHeight = new formattingSettings.NumUpDown({
    name: "lineHeight",
    displayName: "Alto de línea",
    value: TYPOGRAPHY_DEFAULTS.lineHeight,
  });

  letterSpacing = new formattingSettings.NumUpDown({
    name: "letterSpacing",
    displayName: "Espaciado entre letras",
    value: TYPOGRAPHY_DEFAULTS.letterSpacing,
  });

  bold = new formattingSettings.ToggleSwitch({
    name: "bold",
    displayName: "Negrita",
    value: TYPOGRAPHY_DEFAULTS.bold,
  });

  italic = new formattingSettings.ToggleSwitch({
    name: "italic",
    displayName: "Cursiva",
    value: TYPOGRAPHY_DEFAULTS.italic,
  });

  name: string = "typographySection";
  displayName: string = "Tipografía";
  slices: formattingSettings.Slice[] = [
    this.fontFamily,
    this.fontSize,
    this.fontColor,
    this.lineHeight,
    this.letterSpacing,
    this.bold,
    this.italic,
  ];
}

/**
 * Grupo Selección - Propiedades de interactividad de selección
 */
class SelectionGroup extends formattingSettings.SimpleCard {
  rowSelection = new formattingSettings.ToggleSwitch({
    name: "rowSelection",
    displayName: "Selección de fila",
    value: true,
  });

  rowSelectionColor = new formattingSettings.ColorPicker({
    name: "rowSelectionColor",
    displayName: "Color de selección",
    value: { value: "#d0e8ff" },
  });

  name: string = "selectionSection";
  displayName: string = "Selección";
  slices: formattingSettings.Slice[] = [
    this.rowSelection,
    this.rowSelectionColor,
  ];
}

/**
 * Grupo Navegación - Propiedades de interactividad de navegación
 */
class NavigationGroup extends formattingSettings.SimpleCard {
  freezeCategories = new formattingSettings.ToggleSwitch({
    name: "freezeCategories",
    displayName: "Congelar categorías",
    value: false,
  });

  pagination = new formattingSettings.ToggleSwitch({
    name: "pagination",
    displayName: "Paginación",
    value: false,
  });

  rowsPerPage = new formattingSettings.NumUpDown({
    name: "rowsPerPage",
    displayName: "Filas por página",
    value: 10,
  });

  scrollBehavior = new formattingSettings.ItemDropdown({
    name: "scrollBehavior",
    displayName: "Comportamiento de scroll",
    items: [
      { value: "smooth", displayName: "Suave" },
      { value: "auto", displayName: "Automático" },
    ],
    value: { value: "auto", displayName: "Automático" },
  });

  name: string = "navigationSection";
  displayName: string = "Navegación";
  slices: formattingSettings.Slice[] = [
    this.freezeCategories,
    this.pagination,
    this.rowsPerPage,
    this.scrollBehavior,
  ];
}

/**
 * Grupo Funcionalidades - Propiedades de interactividad de funcionalidades
 */
class FeaturesGroup extends formattingSettings.SimpleCard {
  searchable = new formattingSettings.ToggleSwitch({
    name: "searchable",
    displayName: "Búsqueda",
    value: false,
  });

  sortable = new formattingSettings.ToggleSwitch({
    name: "sortable",
    displayName: "Ordenamiento",
    value: true,
  });

  name: string = "featuresSection";
  displayName: string = "Funcionalidades";
  slices: formattingSettings.Slice[] = [this.searchable, this.sortable];
}

/**
 * GeneralCompositeCard - Tarjeta compuesta principal
 * Contiene cinco secciones expandibles: Estilo, Tipografía, Selección, Navegación y Funcionalidades
 * Todas las propiedades mapean al objeto "general" en capabilities.json
 */
export class GeneralCompositeCard extends formattingSettings.CompositeCard {
  styleGroup = new StyleGroup();
  typographyGroup = new TypographyGroup();
  selectionGroup = new SelectionGroup();
  navigationGroup = new NavigationGroup();
  featuresGroup = new FeaturesGroup();

  name: string = "general";
  displayName: string = "General";
  groups: formattingSettings.Group[] = [
    this.styleGroup,
    this.typographyGroup,
    this.selectionGroup,
    this.navigationGroup,
    this.featuresGroup,
  ];
}
