"use strict";

import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import DataViewTableRow = powerbi.DataViewTableRow;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
import DataViewCategorical = powerbi.DataViewCategorical;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import { TableViewModel, TableRowData, SparklineColumnData, SparklineDataPoint } from "./visualViewModel";

export function visualTransform(dataViews: DataView[], host?: IVisualHost): TableViewModel | null {
    const dataView = dataViews?.[0];

    // Try categorical first, then fallback to table
    if (dataView?.categorical) {
        return transformCategorical(dataView.categorical, host);
    } else if (dataView?.table) {
        return transformTable(dataView, host);
    }

    return null;
}

function transformCategorical(categorical: DataViewCategorical, host?: IVisualHost): TableViewModel | null {
    console.log("=== CATEGORICAL TRANSFORM ===");

    const category = categorical.categories?.[0];
    const values = categorical.values;

    if (!values || values.length === 0) {
        console.log("No values in categorical data");
        return null;
    }

    console.log("Category:", category?.source.displayName, "Count:", category?.values.length);
    console.log("Value groups:", values.length);

    const sparklineColumns: DataViewMetadataColumn[] = [];
    const valueColumns: DataViewMetadataColumn[] = [];
    const xAxisColumns: DataViewMetadataColumn[] = [];

    // Separate columns by role
    values.forEach((valueColumn, idx) => {
        const roles = valueColumn.source.roles;
        console.log(`Value column ${idx}: ${valueColumn.source.displayName}, roles:`, roles);

        if (roles?.["sparklineValues"]) {
            sparklineColumns.push(valueColumn.source);
        } else if (roles?.["values"]) {
            valueColumns.push(valueColumn.source);
        }
    });

    // Check if xAxis is in categories (grouped by)
    if (categorical.categories && categorical.categories.length > 1) {
        xAxisColumns.push(categorical.categories[1].source);
    }

    console.log("Sparkline columns:", sparklineColumns.length);
    console.log("Value columns:", valueColumns.length);
    console.log("XAxis columns:", xAxisColumns.length);

    const displayColumns = category ? [category.source, ...valueColumns] : valueColumns;

    // Build rows
    const rows: TableRowData[] = [];
    const categoryCount = category ? category.values.length : 1;

    for (let i = 0; i < categoryCount; i++) {
        const categoryValue = category ? category.values[i] : null;

        console.log(`\nProcessing category ${i}: ${categoryValue}`);

        // Get display values for this category
        const cells = [];

        if (category) {
            cells.push({
                value: categoryValue,
                column: category.source
            });
        }

        // Add regular value columns
        valueColumns.forEach(col => {
            const valueColumn = values.find(v => v.source === col);
            const value = valueColumn?.values[i];
            cells.push({
                value: value,
                column: col
            });
        });

        // Build sparkline data
        const sparklineData: SparklineColumnData[] = sparklineColumns.map(col => {
            const valueColumn = values.find(v => v.source === col);

            if (!valueColumn) {
                return {
                    column: col,
                    values: [],
                    dataPoints: []
                };
            }

            // In categorical grouped by xAxis, we have multiple values per category
            // Each value represents a point in the sparkline
            const dataPoints: SparklineDataPoint[] = [];

            // Get all values for this sparkline column across all xAxis groups
            const allValues = valueColumn.values;
            console.log(`  Sparkline ${col.displayName}: ${allValues.length} total values`);

            for (let j = 0; j < allValues.length; j++) {
                const yValue = allValues[j];
                if (yValue !== null && yValue !== undefined && typeof yValue === "number" && !isNaN(yValue)) {
                    dataPoints.push({ x: j, y: yValue });
                    console.log(`    Point ${j}: y=${yValue}`);
                }
            }

            if (dataPoints.length === 0) {
                console.log(`  No valid data, using sample data`);
                for (let k = 0; k < 8; k++) {
                    dataPoints.push({ x: k, y: Math.random() * 100 });
                }
            }

            return {
                column: col,
                values: dataPoints.map(dp => dp.y),
                dataPoints: dataPoints
            };
        });

        const selectionId = host && category
            ? host.createSelectionIdBuilder()
                .withCategory(category, i)
                .createSelectionId()
            : undefined;

        rows.push({
            cells,
            sparklineColumns: sparklineData,
            selectionId
        });
    }

    console.log("Created rows:", rows.length);
    console.log("=== END CATEGORICAL TRANSFORM ===");

    return {
        columns: displayColumns,
        sparklineColumns: sparklineColumns,
        xAxisColumns: xAxisColumns,
        rows: rows
    };
}

function transformTable(dataView: DataView, host?: IVisualHost): TableViewModel | null {
    const table = dataView.table;

    if (!table?.rows || !table?.columns) {
        return null;
    }

    console.log("=== TABLE TRANSFORM ===");
    console.log("Total rows:", table.rows.length);
    console.log("Total columns:", table.columns.length);

    table.columns.forEach((col, idx) => {
        console.log(`Column ${idx}: "${col.displayName}", queryName: "${col.queryName}", roles:`, col.roles);
    });

    console.log("Sample row 0 values:", table.rows[0]);
    console.log("Sample row 1 values:", table.rows[1]);

    const categoryColumns = table.columns.filter(col => col.roles?.["category"]);
    const valueColumns = table.columns.filter(col => col.roles?.["values"]);
    const sparklineColumns = table.columns.filter(col => col.roles?.["sparklineValues"]);
    const xAxisColumns = table.columns.filter(col => col.roles?.["xAxis"]);

    const categoryIndices = categoryColumns.map(col => table.columns.indexOf(col));
    const valueIndices = valueColumns.map(col => table.columns.indexOf(col));
    const sparklineIndices = sparklineColumns.map(col => table.columns.indexOf(col));
    const xAxisIndices = xAxisColumns.map(col => table.columns.indexOf(col));

    console.log("Category columns:", categoryColumns.length, "indices:", categoryIndices);
    console.log("Value columns:", valueColumns.length, "indices:", valueIndices);
    console.log("Sparkline columns:", sparklineColumns.length, "indices:", sparklineIndices);
    console.log("XAxis columns:", xAxisColumns.length, "indices:", xAxisIndices);

    sparklineIndices.forEach((idx, i) => {
        console.log(`Sparkline column ${i} (${sparklineColumns[i].displayName}) at index ${idx}:`);
        table.rows.slice(0, 3).forEach((r, ri) => {
            console.log(`  Row ${ri}: value=${r[idx]}, type=${typeof r[idx]}`);
        });
    });

    const displayColumns = [...categoryColumns, ...valueColumns];
    const displayIndices = [...categoryIndices, ...valueIndices];

    const transformedRows = categoryColumns.length > 0
        ? groupRowsByCategory(table.rows, table.columns, categoryIndices, displayIndices, sparklineColumns, sparklineIndices, xAxisIndices, host, dataView)
        : transformRowsWithoutGrouping(table.rows, table.columns, displayIndices, sparklineColumns, sparklineIndices, xAxisIndices, host);

    console.log("Transformed rows:", transformedRows.length);
    transformedRows.forEach((row, i) => {
        row.sparklineColumns.forEach((sc, si) => {
            console.log(`  Row ${i}, Sparkline ${si}: ${sc.dataPoints.length} points`);
        });
    });
    console.log("=== END TABLE TRANSFORM ===");

    return {
        columns: displayColumns,
        sparklineColumns: sparklineColumns,
        xAxisColumns: xAxisColumns,
        rows: transformedRows
    };
}

function transformRowsWithoutGrouping(
    rows: DataViewTableRow[],
    allColumns: DataViewMetadataColumn[],
    displayIndices: number[],
    sparklineColumns: DataViewMetadataColumn[],
    sparklineIndices: number[],
    xAxisIndices: number[],
    host?: IVisualHost
): TableRowData[] {
    console.log("Transform without grouping");

    const allSparklineData: Map<number, SparklineDataPoint[]> = new Map();

    rows.forEach((row, rowIndex) => {
        sparklineColumns.forEach((column, sparklineIndex) => {
            const columnIndex = sparklineIndices[sparklineIndex];
            const yValue = row[columnIndex];

            console.log(`Row ${rowIndex}, Sparkline ${sparklineIndex} (${column.displayName}), columnIndex ${columnIndex}, value:`, yValue);

            if (yValue !== null && yValue !== undefined && typeof yValue === "number" && !isNaN(yValue)) {
                const xValue = xAxisIndices.length > sparklineIndex ? row[xAxisIndices[sparklineIndex]] : rowIndex;

                console.log(`  xAxisIndex: ${xAxisIndices[sparklineIndex]}, xValue:`, xValue);

                if (!allSparklineData.has(sparklineIndex)) {
                    allSparklineData.set(sparklineIndex, []);
                }

                allSparklineData.get(sparklineIndex)!.push({ x: xValue, y: yValue });
            }
        });
    });

    const cells = displayIndices.map((colIndex, arrIndex) => ({
        value: rows[0][colIndex],
        column: allColumns[colIndex]
    }));

    const sparklineData: SparklineColumnData[] = sparklineColumns.map((column, index) => {
        let dataPoints = allSparklineData.get(index) || [];
        const values = dataPoints.map(dp => dp.y);

        if (dataPoints.length === 0) {
            console.log(`Sparkline ${index}: NO DATA - Using sample data for testing`);
            dataPoints = Array.from({ length: 8 }, (_, i) => ({
                x: i,
                y: Math.random() * 100
            }));
        }

        console.log(`Sparkline ${index} (${column.displayName}): ${dataPoints.length} points`);

        return {
            column,
            values: dataPoints.map(dp => dp.y),
            dataPoints
        };
    });

    return [{
        cells,
        sparklineColumns: sparklineData
    }];
}

function groupRowsByCategory(
    rows: DataViewTableRow[],
    allColumns: DataViewMetadataColumn[],
    categoryIndices: number[],
    displayIndices: number[],
    sparklineColumns: DataViewMetadataColumn[],
    sparklineIndices: number[],
    xAxisIndices: number[],
    host?: IVisualHost,
    dataView?: DataView
): TableRowData[] {
    const groupedData = new Map<string, {
        cells: any[],
        sparklineData: Map<number, SparklineDataPoint[]>,
        categoryValues: any[],
        rowIndex: number
    }>();

    rows.forEach((row, rowIndex) => {
        const categoryKey = categoryIndices.map(idx => row[idx]).join('|');

        console.log(`Processing row ${rowIndex}, category key: "${categoryKey}"`);

        if (!groupedData.has(categoryKey)) {
            const cells = displayIndices.map((colIndex, arrIndex) => ({
                value: row[colIndex],
                column: allColumns[colIndex]
            }));

            const categoryValues = categoryIndices.map(idx => row[idx]);

            groupedData.set(categoryKey, {
                cells,
                sparklineData: new Map(),
                categoryValues,
                rowIndex
            });
        }

        const group = groupedData.get(categoryKey)!;

        sparklineColumns.forEach((column, sparklineIndex) => {
            const columnIndex = sparklineIndices[sparklineIndex];
            const yValue = row[columnIndex];

            console.log(`  Sparkline ${sparklineIndex} (${column.displayName}), index ${columnIndex}, value:`, yValue, `type: ${typeof yValue}`);

            if (yValue !== null && yValue !== undefined && typeof yValue === "number" && !isNaN(yValue)) {
                const xValue = xAxisIndices.length > sparklineIndex ? row[xAxisIndices[sparklineIndex]] : rowIndex;

                if (!group.sparklineData.has(sparklineIndex)) {
                    group.sparklineData.set(sparklineIndex, []);
                }

                console.log(`  Adding point: x=${xValue}, y=${yValue}`);
                group.sparklineData.get(sparklineIndex)!.push({ x: xValue, y: yValue });
            } else {
                console.log(`  Skipping non-number value:`, yValue);
            }
        });
    });

    console.log(`Total groups: ${groupedData.size}`);

    return Array.from(groupedData.entries()).map(([categoryKey, group], groupIndex) => {
        const sparklineData: SparklineColumnData[] = sparklineColumns.map((column, index) => {
            let dataPoints = group.sparklineData.get(index) || [];
            const values = dataPoints.map(dp => dp.y);

            if (dataPoints.length === 0) {
                console.log(`Group ${groupIndex}, Sparkline ${index}: NO DATA - Using sample data for testing`);
                dataPoints = Array.from({ length: 8 }, (_, i) => ({
                    x: i,
                    y: Math.random() * 100
                }));
            }

            console.log(`Group ${groupIndex}, Sparkline ${index} (${column.displayName}): ${dataPoints.length} points`);

            return {
                column,
                values: dataPoints.map(dp => dp.y),
                dataPoints
            };
        });

        const selectionId = host && dataView?.table && categoryIndices.length > 0
            ? host.createSelectionIdBuilder()
                .withTable(dataView.table, group.rowIndex)
                .createSelectionId()
            : undefined;

        return {
            cells: group.cells,
            sparklineColumns: sparklineData,
            selectionId
        };
    });
}
