import powerbi from "powerbi-visuals-api";
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
import DataViewTableRow = powerbi.DataViewTableRow;

export interface TableCellData {
    value: any;
    column: DataViewMetadataColumn;
}

export interface TableRowData {
    cells: TableCellData[];
    numericValues: number[];
}

export interface TableViewModel {
    columns: DataViewMetadataColumn[];
    rows: TableRowData[];
}
