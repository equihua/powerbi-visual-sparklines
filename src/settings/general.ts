import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import { TABLE_STYLE_OPTIONS } from "../constants/visualDefaults";

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

  name: string = "styleSection";
  displayName: string = "Estilo";
  slices: formattingSettings.Slice[] = [this.tableStyle];
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
 * Contiene cuatro secciones expandibles: Estilo, Selección, Navegación y Funcionalidades
 *
 * NOTA: La tipografía ha sido movida a una tarjeta separada (TypographyCard)
 * para mejorar la organización y usar FontControl de manera moderna.
 */
export class GeneralCompositeCard extends formattingSettings.CompositeCard {
  styleGroup = new StyleGroup();
  selectionGroup = new SelectionGroup();
  navigationGroup = new NavigationGroup();
  featuresGroup = new FeaturesGroup();

  name: string = "general";
  displayName: string = "General";
  groups: formattingSettings.Group[] = [
    this.styleGroup,
    this.selectionGroup,
    this.navigationGroup,
    this.featuresGroup,
  ];
}
