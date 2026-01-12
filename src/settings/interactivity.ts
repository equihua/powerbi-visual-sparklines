import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

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

  name: string = "selection";
  displayName: string = "Selección";
  slices: formattingSettings.Slice[] = [
    this.rowSelection,
    this.rowSelectionColor,
  ];
}

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

  name: string = "navigation";
  displayName: string = "Navegación";
  slices: formattingSettings.Slice[] = [
    this.freezeCategories,
    this.pagination,
    this.rowsPerPage,
    this.scrollBehavior,
  ];
}

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

  name: string = "features";
  displayName: string = "Funcionalidades";
  slices: formattingSettings.Slice[] = [
    this.searchable,
    this.sortable,
  ];
}

export class InteractivitySettings extends formattingSettings.CompositeCard {
  selectionGroup = new SelectionGroup();
  navigationGroup = new NavigationGroup();
  featuresGroup = new FeaturesGroup();

  name: string = "interactivity";
  displayName: string = "Interactividad";
  groups: formattingSettings.Group[] = [
    this.selectionGroup,
    this.navigationGroup,
    this.featuresGroup,
  ];
}
