import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

/**
 * Configuraciones de interactividad.
 * Controla selección, paginación, búsqueda y ordenamiento de datos.
 */
export class InteractivitySettings extends formattingSettings.SimpleCard {
  freezeCategories = new formattingSettings.ToggleSwitch({
    name: "freezeCategories",
    displayName: "Congelar columna de categoría",
    value: false,
  });
  rowSelection = new formattingSettings.ToggleSwitch({
    name: "rowSelection",
    displayName: "Selección de fila",
    value: true,
  });
  rowSelectionColor = new formattingSettings.ColorPicker({
    name: "rowSelectionColor",
    displayName: "Color de fila seleccionada",
    value: { value: "#d0e8ff" },
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
  searchable = new formattingSettings.ToggleSwitch({
    name: "searchable",
    displayName: "Búsqueda habilitada",
    value: false,
  });

  sortable = new formattingSettings.ToggleSwitch({
    name: "sortable",
    displayName: "Ordenamiento habilitado",
    value: true,
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

  name: string = "interactivity";
  displayName: string = "Interactividad";
  slices: formattingSettings.Slice[] = [
    this.freezeCategories,
    this.rowSelection,
    this.rowSelectionColor,
    this.pagination,
    this.rowsPerPage,
    this.searchable,
    this.sortable,
    this.scrollBehavior,
  ];
}
