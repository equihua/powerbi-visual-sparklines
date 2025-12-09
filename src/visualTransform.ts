"use strict";

import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import DataViewTable = powerbi.DataViewTable;
import DataViewTableRow = powerbi.DataViewTableRow;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

import { TableViewModel, TableRowData } from "./visualViewModel";

export function visualTransform(dataViews: DataView[]): TableViewModel | null {
    const dataView = dataViews?.[0];
    const table = dataView?.table;

    if (!table?.rows || !table?.columns) {
        return null;
    }

    return {
        columns: table.columns,
        rows: transformRows(table.rows, table.columns)
    };
}

function transformRows(
    rows: DataViewTableRow[],
    columns: DataViewMetadataColumn[]
): TableRowData[] {
    return rows.map(row => ({
        cells: row.map((value, index) => ({
            value,
            column: columns[index]
        })),
        numericValues: extractNumericValues(row)
    }));
}

function extractNumericValues(row: DataViewTableRow): number[] {
    return row.filter(value => typeof value === "number") as number[];
}
