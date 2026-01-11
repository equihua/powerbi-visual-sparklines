"use strict";

import powerbi from "powerbi-visuals-api";
import DataView = powerbi.DataView;
import DataViewTableRow = powerbi.DataViewTableRow;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
import DataViewCategorical = powerbi.DataViewCategorical;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

import {
  TableViewModel,
  TableRowData,
  SparklineData,
  SparklineDataPoint,
} from "./visualViewModel";

export function visualTransform(
  dataViews: DataView[],
  host?: IVisualHost
): TableViewModel | null {
  const dataView = dataViews?.[0];

  // Try categorical first, then fallback to table
  if (dataView?.categorical) {
    return transformCategorical(dataView.categorical);
  }

  return null;
}

function transformCategorical(
  categorical: DataViewCategorical,
  host?: IVisualHost
): TableViewModel | null {
  console.log("=== CATEGORICAL TRANSFORM ===");

  const categories = categorical.categories?.[0];
  const values = categorical.values;

  if (!categories || !values || values.length === 0) {
    console.log("No categories or values in categorical data");
    return null;
  }

  const categoryValues = categories.values;
  const categoryCount = categoryValues.length;

  console.log(
    "Category:",
    categories.source.displayName,
    "Count:",
    categoryCount
  );
  console.log("Value groups:", values.length);

  const groupedByMonth: Map<string, any[]> = new Map();
  const mainValueColumns: Set<string> = new Set();
  const sparklineColumns: Set<string> = new Set();

  values.forEach((valueColumn, idx) => {
    const roles = valueColumn.source.roles;
    const displayName = valueColumn.source.displayName;
    const groupName = (valueColumn.source as any).groupName;

    console.log(
      `Value column ${idx}: ${displayName}, groupName: ${groupName}, roles:`,
      roles
    );

    if (groupName) {
      if (!groupedByMonth.has(groupName)) {
        groupedByMonth.set(groupName, []);
      }
      groupedByMonth.get(groupName)!.push(valueColumn);
    }

    if (roles?.["MainValues"] || roles?.["measure"]) {
      const rootSource = (valueColumn.source as any).rootSource;
      if (
        rootSource &&
        !roles?.["sparkline"] &&
        !roles?.["sparklines"] &&
        !roles?.["MiniValues"]
      ) {
        mainValueColumns.add(rootSource.displayName);
      }
    }

    if (
      roles?.["sparkline"] ||
      roles?.["sparklines"] ||
      roles?.["MiniValues"]
    ) {
      const rootSource = (valueColumn.source as any).rootSource;
      if (rootSource) {
        sparklineColumns.add(rootSource.displayName);
      }
    }
  });

  console.log("Grouped months:", Array.from(groupedByMonth.keys()));
  console.log("Main value columns:", Array.from(mainValueColumns));
  console.log("Sparkline columns:", Array.from(sparklineColumns));

  const rows: TableRowData[] = [];

  for (let i = 0; i < categoryCount; i++) {
    const categoryValue = categoryValues[i];
    const row: TableRowData = {
      [categories.source.displayName]: categoryValue,
    };

    console.log(`\nProcessing category ${i}: ${categoryValue}`);

    const mainValuesForCategory: Map<string, number> = new Map();
    const sparklineDataForCategory: Map<
      string,
      { axis: string[]; values: number[] }
    > = new Map();

    groupedByMonth.forEach((monthColumns, monthName) => {
      monthColumns.forEach((valueColumn) => {
        const roles = valueColumn.source.roles;
        const displayName = valueColumn.source.displayName;
        const value = valueColumn.values[i];
        const rootSource = (valueColumn.source as any).rootSource;
        const rootDisplayName = rootSource
          ? rootSource.displayName
          : displayName;

        if (
          (roles?.["MainValues"] || roles?.["measure"]) &&
          !roles?.["sparkline"] &&
          !roles?.["sparklines"] &&
          !roles?.["MiniValues"]
        ) {
          if (!mainValuesForCategory.has(rootDisplayName)) {
            mainValuesForCategory.set(rootDisplayName, value);
          }
        }

        if (
          roles?.["sparkline"] ||
          roles?.["sparklines"] ||
          roles?.["MiniValues"]
        ) {
          if (!sparklineDataForCategory.has(rootDisplayName)) {
            sparklineDataForCategory.set(rootDisplayName, {
              axis: [],
              values: [],
            });
          }
          const sparklineData = sparklineDataForCategory.get(rootDisplayName)!;
          sparklineData.axis.push(monthName);
          sparklineData.values.push(value);
        }
      });
    });

    mainValuesForCategory.forEach((value, columnName) => {
      row[columnName] = value;
      console.log(`  ${columnName}: ${value}`);
    });

    sparklineDataForCategory.forEach((data, columnName) => {
      row[columnName] = {
        Nombre: columnName,
        Axis: data.axis,
        Values: data.values,
      };
      console.log(`  ${columnName} sparkline: ${data.values.length} points`);
    });

    rows.push(row);
  }

  console.log("Created rows:", rows.length);
  console.log("=== END CATEGORICAL TRANSFORM ===");

  return {
    columns: [],
    sparklineColumns: [],
    xAxisColumns: [],
    rows: rows,
  };
}
