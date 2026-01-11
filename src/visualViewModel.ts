import powerbi from "powerbi-visuals-api";
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

export interface SparklineDataPoint {
  x: any;
  y: number;
}

export interface SparklineData {
  Nombre: string;
  Axis: string[];
  Values: number[];
}

export interface TableRowData {
  [key: string]: any;
}

export interface TableViewModel {
  columns: DataViewMetadataColumn[];
  sparklineColumns: DataViewMetadataColumn[];
  xAxisColumns: DataViewMetadataColumn[];
  rows: TableRowData[];
}
