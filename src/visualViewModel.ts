import powerbi from "powerbi-visuals-api";
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

export interface TableCellData {
    value: any;
    column: DataViewMetadataColumn;
}

export interface SparklineDataPoint {
    x: any;
    y: number;
}

export interface SparklineColumnData {
    column: DataViewMetadataColumn;
    values: number[];
    dataPoints: SparklineDataPoint[];
}

export interface TableRowData {
    cells: TableCellData[];
    sparklineColumns: SparklineColumnData[];
}

export interface TableViewModel {
    columns: DataViewMetadataColumn[];
    sparklineColumns: DataViewMetadataColumn[];
    xAxisColumns: DataViewMetadataColumn[];
    rows: TableRowData[];
}
