"use strict";

import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import DataViewTableRow = powerbi.DataViewTableRow;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

import { TableViewModel, TableRowData, SparklineColumnData } from "./visualViewModel";

export function visualTransform(dataViews: DataView[]): TableViewModel | null {
    const dataView = dataViews?.[0];
    const table = dataView?.table;

    if (!table?.rows || !table?.columns) {
        return null;
    }

    const categoryColumns = table.columns.filter(col => col.roles?.["category"]);
    const valueColumns = table.columns.filter(col => col.roles?.["values"]);
    const sparklineColumns = table.columns.filter(col => col.roles?.["sparklineValues"]);

    const displayColumns = [...categoryColumns, ...valueColumns];
    const categoryCount = categoryColumns.length;
    const valueCount = valueColumns.length;

    return {
        columns: displayColumns,
        sparklineColumns: sparklineColumns,
        rows: transformRows(table.rows, table.columns, categoryCount, valueCount, sparklineColumns)
    };
}

function transformRows(
    rows: DataViewTableRow[],
    allColumns: DataViewMetadataColumn[],
    categoryCount: number,
    valueCount: number,
    sparklineColumns: DataViewMetadataColumn[]
): TableRowData[] {
    const displayColumnCount = categoryCount + valueCount;
    
    return rows.map(row => {
        const cells = row.slice(0, displayColumnCount).map((value, index) => ({
            value,
            column: allColumns[index]
        }));

        const sparklineData: SparklineColumnData[] = sparklineColumns.map((column, index) => {
            const columnIndex = displayColumnCount + index;
            const value = row[columnIndex];
            
            return {
                column: column,
                values: typeof value === "number" ? [value] : []
            };
        });

        return {
            cells,
            sparklineColumns: sparklineData
        };
    });
}
