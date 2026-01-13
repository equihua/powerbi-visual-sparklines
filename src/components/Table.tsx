import React, { useState, useMemo, memo } from "react";
import { TableViewModel } from "../visualViewModel";
import {
  SparklineColumnSettings,
  ColumnConfigSettings,
  TypographyStyle,
} from "../settings";
import {
  TYPOGRAPHY_DEFAULTS,
  TextAlignment,
} from "../constants/visualDefaults";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { areMapsEqual } from "../utils/memoization";

interface CssTypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  lineHeight: number;
  letterSpacing: string;
  alignment: "left" | "center" | "right";
}

interface TableProps {
  viewModel: TableViewModel;
  textSize: number;
  tableStyle: string;
  showHorizontalLines: boolean;
  horizontalLineColor: string;
  horizontalLineWidth: number;
  showVerticalLines: boolean;
  verticalLineColor: string;
  verticalLineWidth: number;
  borderStyle: string;
  borderColor: string;
  borderWidth: number;
  borderSection: "all" | "header" | "rows";
  rowSelection: boolean;
  rowSelectionColor: string;
  sortable: boolean;
  freezeCategories: boolean;
  searchable: boolean;
  pagination: boolean;
  rowsPerPage: number;
  fontFamily: string;
  wordWrap: boolean;
  textOverflow: "clip" | "ellipsis" | "wrap";
  headerAlignment: "left" | "center" | "right";
  headerPadding: number;
  headerBold: boolean;
  stickyHeader: boolean;
  headerFontColor: string;
  headerFontSize: number;
  headerBackgroundColor: string;
  rowHeight: number;
  alternatingRowColor: string;
  hoverBackgroundColor: string;
  rowPadding: number;
  categoryColumnAlignment: "left" | "center" | "right";
  categoryCellAlignment: "left" | "center" | "right";
  categoryCellPadding: number;
  categoryCellFontColor: string;
  categoryCellFontSize: number;
  categoryCellBackgroundColor: string;
  measureCellAlignment: "left" | "center" | "right";
  measureCellPadding: number;
  measureCellFontColor: string;
  measureCellFontSize: number;
  measureCellBackgroundColor: string;
  decimalPlaces: number;
  thousandsSeparator: boolean;
  currencySymbol: string;
  currencyPosition: "before" | "after";
  negativeNumberFormat: "minus" | "parentheses" | "minusred" | "parenthesesred";
  customNegativeColor: string;
  sparklineSettings: Map<string, SparklineColumnSettings>;
  columnSettings: Map<string, ColumnConfigSettings>;
  width: number;
  typographyStyle: TypographyStyle;
}

/**
 * Función de comparación personalizada para React.memo
 * Evita re-renders innecesarios cuando solo cambian valores de formato menores
 */
function arePropsEqual(prevProps: TableProps, nextProps: TableProps): boolean {
  // Comparar datos principales (crítico)
  if (prevProps.viewModel !== nextProps.viewModel) return false;
  if (prevProps.width !== nextProps.width) return false;

  // Comparar configuraciones funcionales críticas
  if (prevProps.pagination !== nextProps.pagination) return false;
  if (prevProps.rowsPerPage !== nextProps.rowsPerPage) return false;
  if (prevProps.searchable !== nextProps.searchable) return false;
  if (prevProps.sortable !== nextProps.sortable) return false;
  if (prevProps.rowSelection !== nextProps.rowSelection) return false;

  // Comparar Maps (importante para sparklines y configuraciones de columna)
  if (!areMapsEqual(prevProps.sparklineSettings, nextProps.sparklineSettings))
    return false;
  if (!areMapsEqual(prevProps.columnSettings, nextProps.columnSettings))
    return false;

  // Tipografía base (aplicación global/columna)
  if (prevProps.typographyStyle !== nextProps.typographyStyle) return false;

  // Para props de estilo, solo comparar si realmente cambiaron
  // (esto es más rápido que re-renderizar todo el componente)
  const styleProps: (keyof TableProps)[] = [
    "textSize",
    "tableStyle",
    "fontFamily",
    "borderStyle",
    "borderColor",
    "borderWidth",
    "borderSection",
    "rowHeight",
    "alternatingRowColor",
    "hoverBackgroundColor",
    "rowPadding",
    "showHorizontalLines",
    "horizontalLineColor",
    "horizontalLineWidth",
    "showVerticalLines",
    "verticalLineColor",
    "verticalLineWidth",
    "rowSelectionColor",
    "headerAlignment",
    "headerPadding",
    "headerBold",
    "headerFontColor",
    "headerFontSize",
    "headerBackgroundColor",
    "categoryCellAlignment",
    "categoryCellPadding",
    "categoryCellFontColor",
    "categoryCellFontSize",
    "categoryCellBackgroundColor",
    "measureCellAlignment",
    "measureCellPadding",
    "measureCellFontColor",
    "measureCellFontSize",
    "measureCellBackgroundColor",
    "decimalPlaces",
    "thousandsSeparator",
    "currencySymbol",
    "currencyPosition",
    "negativeNumberFormat",
    "customNegativeColor",
    "wordWrap",
    "textOverflow",
    "freezeCategories",
    "stickyHeader",
    "categoryColumnAlignment",
  ];

  for (const prop of styleProps) {
    if (prevProps[prop] !== nextProps[prop]) return false;
  }

  return true;
}

const TableComponent: React.FC<TableProps> = ({
  viewModel,
  textSize,
  tableStyle,
  showHorizontalLines,
  horizontalLineColor,
  horizontalLineWidth,
  showVerticalLines,
  verticalLineColor,
  verticalLineWidth,
  borderStyle,
  borderColor,
  borderWidth,
  borderSection,
  rowSelection,
  rowSelectionColor,
  sortable,
  freezeCategories,
  searchable,
  pagination,
  rowsPerPage,
  fontFamily,
  wordWrap,
  textOverflow,
  headerAlignment,
  headerPadding,
  headerBold,
  stickyHeader,
  headerFontColor,
  headerFontSize,
  headerBackgroundColor,
  rowHeight,
  alternatingRowColor,
  hoverBackgroundColor,
  rowPadding,
  categoryColumnAlignment,
  categoryCellAlignment,
  categoryCellPadding,
  categoryCellFontColor,
  categoryCellFontSize,
  categoryCellBackgroundColor,
  measureCellAlignment,
  measureCellPadding,
  measureCellFontColor,
  measureCellFontSize,
  measureCellBackgroundColor,
  decimalPlaces,
  thousandsSeparator,
  currencySymbol,
  currencyPosition,
  negativeNumberFormat,
  customNegativeColor,
  sparklineSettings,
  columnSettings,
  width,
  typographyStyle,
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  if (!viewModel || !viewModel.rows || viewModel.rows.length === 0) {
    return <div>No data available</div>;
  }

  // Memoizar análisis de columnas (solo recalcular si cambian las filas)
  const columnAnalysis = useMemo(() => {
    const firstRow = viewModel.rows[0];
    const columnNames: string[] = [];
    const sparklineColumnNames: string[] = [];

    Object.keys(firstRow).forEach((key) => {
      const value = firstRow[key];
      if (
        value &&
        typeof value === "object" &&
        "Nombre" in value &&
        "Axis" in value &&
        "Values" in value
      ) {
        sparklineColumnNames.push(key);
      } else {
        columnNames.push(key);
      }
    });

    return { columnNames, sparklineColumnNames };
  }, [viewModel.rows]);

  const { columnNames, sparklineColumnNames } = columnAnalysis;

  const handleSort = (columnName: string) => {
    if (!sortable) return;

    if (sortColumn === columnName) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnName);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (index: number) => {
    if (!rowSelection) return;
    setSelectedRowIndex(selectedRowIndex === index ? null : index);
  };

  // Memoizar filtrado (evitar recálculo en cada render)
  const filteredRows = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return viewModel.rows;
    }

    const q = searchQuery.toLowerCase();
    return viewModel.rows.filter((row) =>
      columnNames.some((cn) => String(row[cn]).toLowerCase().includes(q))
    );
  }, [viewModel.rows, searchable, searchQuery, columnNames]);

  // Memoizar ordenamiento (operación costosa)
  const sortedRows = useMemo(() => {
    if (!sortable || !sortColumn) {
      return filteredRows;
    }

    return [...filteredRows].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredRows, sortable, sortColumn, sortDirection]);

  // Memoizar paginación
  const pageRows = useMemo(() => {
    if (!pagination) {
      return sortedRows;
    }

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedRows.slice(startIndex, endIndex);
  }, [sortedRows, pagination, page, rowsPerPage]);

  const tableClassName = `sparkline-table ${
    tableStyle === "striped" ? "striped" : ""
  }`;

  const neutralTypography: TypographyStyle = {
    fontFamily: TYPOGRAPHY_DEFAULTS.fontFamily,
    fontSize: TYPOGRAPHY_DEFAULTS.fontSize,
    fontColor: TYPOGRAPHY_DEFAULTS.fontColor,
    fontWeight: TYPOGRAPHY_DEFAULTS.bold ? "bold" : "normal",
    fontStyle: TYPOGRAPHY_DEFAULTS.italic ? "italic" : "normal",
    textDecoration: TYPOGRAPHY_DEFAULTS.underline ? "underline" : "none",
    lineHeight: TYPOGRAPHY_DEFAULTS.lineHeight,
    letterSpacing: TYPOGRAPHY_DEFAULTS.letterSpacing,
    alignment: TextAlignment.Left,
    applyTo: "all",
    targetColumn: "",
  };

  const toCssTypography = (style: TypographyStyle): CssTypographyStyle => ({
    fontFamily: style.fontFamily,
    fontSize: `${style.fontSize}px`,
    fontColor: style.fontColor,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    lineHeight: style.lineHeight,
    letterSpacing:
      style.letterSpacing === 0 ? "normal" : `${style.letterSpacing}px`,
    alignment: style.alignment,
  });

  const resolveTypography = (columnName?: string): CssTypographyStyle => {
    if (typographyStyle.applyTo === "column" && columnName) {
      if (columnName === typographyStyle.targetColumn) {
        return toCssTypography(typographyStyle);
      }
      return toCssTypography(neutralTypography);
    }
    return toCssTypography(typographyStyle);
  };

  const typographyByColumn = useMemo(() => {
    const map = new Map<string, CssTypographyStyle>();
    columnNames.forEach((name) => {
      map.set(name, resolveTypography(name));
    });
    sparklineColumnNames.forEach((name) => {
      map.set(name, resolveTypography(name));
    });
    return map;
  }, [columnNames, sparklineColumnNames, typographyStyle]);

  const defaultTypographyCss = resolveTypography();
  const tableFontFamily =
    typographyStyle.applyTo === "column"
      ? defaultTypographyCss.fontFamily
      : typographyStyle.fontFamily;

  const commonBorder = `${borderWidth}px ${borderStyle} ${borderColor}`;
  const tableBorderStyles =
    borderSection === "all"
      ? { border: commonBorder }
      : borderSection === "header"
      ? {}
      : {}; // rows handled in row styles

  return (
    <div style={{ width: `${width}px`, fontFamily }}>
      {searchable && (
        <div style={{ marginBottom: 8 }}>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            style={{ width: "100%", padding: 6 }}
          />
        </div>
      )}
      <table
        className={tableClassName}
        style={{
          fontSize: `${textSize}px`,
          fontFamily: tableFontFamily,
          width: `100%`,
          borderCollapse: "collapse",
          ...tableBorderStyles,
        }}
      >
        <TableHeader
          columnNames={columnNames}
          sparklineColumnNames={sparklineColumnNames}
          sortable={sortable}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          alignment={headerAlignment}
          padding={headerPadding}
          bold={headerBold}
          sticky={stickyHeader}
          showVerticalLines={showVerticalLines}
          verticalLineColor={verticalLineColor}
          verticalLineWidth={verticalLineWidth}
          borderBottom={
            borderSection === "header" || borderSection === "all"
              ? commonBorder
              : undefined
          }
          fontColor={headerFontColor}
          fontSize={headerFontSize}
          backgroundColor={headerBackgroundColor}
          columnSettings={columnSettings}
          typographyByColumn={typographyByColumn}
          defaultTypography={defaultTypographyCss}
        />
        <tbody>
          {pageRows.map((rowData, index) => (
            <TableRow
              key={index}
              rowData={rowData}
              columnNames={columnNames}
              sparklineColumnNames={sparklineColumnNames}
              index={index}
              tableStyle={tableStyle}
              showHorizontalLines={showHorizontalLines}
              horizontalLineColor={horizontalLineColor}
              horizontalLineWidth={horizontalLineWidth}
              showVerticalLines={showVerticalLines}
              verticalLineColor={verticalLineColor}
              verticalLineWidth={verticalLineWidth}
              isSelected={rowSelection && selectedRowIndex === index}
              onRowClick={() => handleRowClick(index)}
              rowSelectionColor={rowSelectionColor}
              freezeCategories={freezeCategories}
              rowHeight={rowHeight}
              alternatingRowColor={alternatingRowColor}
              hoverBackgroundColor={hoverBackgroundColor}
              rowPadding={rowPadding}
              categoryCellAlignment={categoryCellAlignment}
              categoryCellPadding={categoryCellPadding}
              categoryCellFontColor={categoryCellFontColor}
              categoryCellFontSize={categoryCellFontSize}
              categoryCellBackgroundColor={categoryCellBackgroundColor}
              measureCellAlignment={measureCellAlignment}
              measureCellPadding={measureCellPadding}
              measureCellFontColor={measureCellFontColor}
              measureCellFontSize={measureCellFontSize}
              measureCellBackgroundColor={measureCellBackgroundColor}
              wordWrap={wordWrap}
              textOverflow={textOverflow}
              borderForRows={
                borderSection === "rows" || borderSection === "all"
                  ? commonBorder
                  : undefined
              }
              decimalPlaces={decimalPlaces}
              thousandsSeparator={thousandsSeparator}
              currencySymbol={currencySymbol}
              currencyPosition={currencyPosition}
              negativeNumberFormat={negativeNumberFormat}
              customNegativeColor={customNegativeColor}
              sparklineSettings={sparklineSettings}
              columnSettings={columnSettings}
              typographyByColumn={typographyByColumn}
              defaultTypography={defaultTypographyCss}
            />
          ))}
        </tbody>
      </table>
      {pagination && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <span>
            Página {page} de{" "}
            {Math.max(1, Math.ceil(sortedRows.length / rowsPerPage))}
          </span>
          <div>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setPage((p) =>
                  Math.min(Math.ceil(sortedRows.length / rowsPerPage), p + 1)
                )
              }
              disabled={page >= Math.ceil(sortedRows.length / rowsPerPage)}
              style={{ marginLeft: 8 }}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Exportar componente memoizado
export const Table = memo(TableComponent, arePropsEqual);
