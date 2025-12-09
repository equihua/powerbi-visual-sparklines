import powerbi from "powerbi-visuals-api";
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

export interface TableCellData {
    value: any;
    column: DataViewMetadataColumn;
}

export interface SparklineColumnData {
    column: DataViewMetadataColumn;
    values: number[];
}

export interface TableRowData {
    cells: TableCellData[];
    sparklineColumns: SparklineColumnData[];
}

export interface TableViewModel {
    columns: DataViewMetadataColumn[];
    sparklineColumns: DataViewMetadataColumn[];
    rows: TableRowData[];
}
