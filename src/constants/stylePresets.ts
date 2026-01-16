import { COLORS_DEFAULT, BorderSection, TableStyle } from "./visualDefaults";

export interface TableStylePreset {
  general?: {
    selection?: {
      rowSelection?: boolean;
      rowSelectionColor?: string;
    };
    navigation?: {
      pagination?: boolean;
      rowsPerPage?: number;
      scrollBehavior?: "smooth" | "auto";
    };
    features?: {
      searchable?: boolean;
      sortable?: boolean;
      columnReorder?: boolean;
      columnResize?: boolean;
    };
  };

  grid?: {
    gridlinesCard?: {
      showHorizontal?: boolean;
      gridHorizontalColor?: string;
      gridHorizontalWeight?: number;
      showVertical?: boolean;
      gridVerticalColor?: string;
      gridVerticalWeight?: number;
    };
    borderCard?: {
      borderSection?:
        | BorderSection
        | "all"
        | "columnHeader"
        | "valuesSection"
        | "totalsSection";
      borderTop?: boolean;
      borderBottom?: boolean;
      borderLeft?: boolean;
      borderRight?: boolean;
      borderColor?: string;
      borderWeight?: number;
    };
    optionsCard?: {
      rowPadding?: number;
      globalFontSize?: number;
    };
  };

  columnHeaders?: {
    fontFamily?: string;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    textColor?: string;
    backgroundColor?: string;
    alignment?: "left" | "center" | "right";
    wrapText?: boolean;
    autoSizeWidth?: boolean;
    resizeBehavior?: "fitToContent" | "growToFit";
  };

  values?: {
    fontFamily?: string;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    textColor?: string;
    backgroundColor?: string;
    alternateTextColor?: string;
    alternateBackgroundColor?: string;
    alignment?: "left" | "center" | "right";
    wrapText?: boolean;
  };

  totals?: {
    show?: boolean;
    label?: string;
    fontFamily?: string;
    fontSize?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    textColor?: string;
    backgroundColor?: string;
  };
}

export const STYLE_PRESETS: Record<TableStyle, TableStylePreset> = {
  [TableStyle.Default]: {
    grid: {
      gridlinesCard: {
        showHorizontal: true,
        gridHorizontalColor: COLORS_DEFAULT.lineGray,
        gridHorizontalWeight: 1,
        showVertical: false,
        gridVerticalColor: COLORS_DEFAULT.lineGray,
        gridVerticalWeight: 1,
      },
      borderCard: {
        borderSection: BorderSection.All,
        borderTop: false,
        borderBottom: true,
        borderLeft: false,
        borderRight: false,
        borderColor: COLORS_DEFAULT.borderGray,
        borderWeight: 1,
      },
      optionsCard: {
        rowPadding: 6,
        globalFontSize: 11,
      },
    },
    columnHeaders: {
      fontFamily: "Segoe UI, sans-serif",
      fontSize: 12,
      bold: true,
      italic: false,
      underline: false,
      textColor: COLORS_DEFAULT.primaryText,
      backgroundColor: "#f3f2f1",
      alignment: "left",
      wrapText: false,
      autoSizeWidth: false,
      resizeBehavior: "fitToContent",
    },
    values: {
      fontFamily: "Arial, sans-serif",
      fontSize: 11,
      bold: false,
      italic: false,
      underline: false,
      textColor: COLORS_DEFAULT.primaryText,
      backgroundColor: COLORS_DEFAULT.white,
      alternateTextColor: COLORS_DEFAULT.primaryText,
      alternateBackgroundColor: "#faf9f8",
      alignment: "left",
      wrapText: false,
    },
  },

  [TableStyle.None]: {
    grid: {
      gridlinesCard: {
        showHorizontal: false,
        showVertical: false,
        gridHorizontalWeight: 0,
        gridVerticalWeight: 0,
      },
      borderCard: {
        borderSection: BorderSection.All,
        borderTop: false,
        borderBottom: false,
        borderLeft: false,
        borderRight: false,
        borderColor: COLORS_DEFAULT.white,
        borderWeight: 0,
      },
    },
    columnHeaders: {
      backgroundColor: COLORS_DEFAULT.white,
      textColor: COLORS_DEFAULT.primaryText,
      bold: false,
    },
    values: {
      alternateBackgroundColor: COLORS_DEFAULT.white,
    },
  },

  [TableStyle.Minimal]: {
    grid: {
      gridlinesCard: {
        showHorizontal: true,
        gridHorizontalColor: "#eeeeee",
        gridHorizontalWeight: 1,
        showVertical: false,
      },
      borderCard: {
        borderSection: BorderSection.ColumnHeader,
        borderTop: false,
        borderBottom: true,
        borderLeft: false,
        borderRight: false,
        borderColor: "#eeeeee",
        borderWeight: 1,
      },
      optionsCard: {
        rowPadding: 3,
      },
    },
    columnHeaders: {
      backgroundColor: COLORS_DEFAULT.white,
      fontSize: 12,
    },
    values: {
      backgroundColor: COLORS_DEFAULT.white,
      alternateBackgroundColor: COLORS_DEFAULT.white,
      fontSize: 11,
    },
  },

  [TableStyle.BoldHeader]: {
    columnHeaders: {
      bold: true,
      fontSize: 13,
    },
  },

  [TableStyle.AlternatingRows]: {
    values: {
      alternateBackgroundColor: "#faf9f8",
    },
  },

  [TableStyle.HighlightRows]: {
    // CSS controla hover; aquí mantenemos colores base
    grid: {
      optionsCard: {
        rowPadding: 6,
      },
    },
  },

  [TableStyle.HighlightRowsBoldHeader]: {
    columnHeaders: {
      bold: true,
    },
    values: {
      alternateBackgroundColor: "#faf9f8",
    },
  },

  [TableStyle.Dispersed]: {
    grid: {
      optionsCard: {
        rowPadding: 12,
        globalFontSize: 12,
      },
    },
    columnHeaders: {
      fontSize: 13,
    },
    values: {
      fontSize: 12,
    },
  },

  [TableStyle.Compressed]: {
    grid: {
      optionsCard: {
        rowPadding: 2,
        globalFontSize: 10,
      },
    },
    columnHeaders: {
      fontSize: 11,
    },
    values: {
      fontSize: 10,
    },
  },
};

export function getPresetForStyle(
  style: string | TableStyle,
): TableStylePreset | undefined {
  const key = String(style) as TableStyle;
  return STYLE_PRESETS[key];
}
