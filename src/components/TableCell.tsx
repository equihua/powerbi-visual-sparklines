import React from 'react';
import powerbi from 'powerbi-visuals-api';

interface CellData {
    value: any;
    column: powerbi.DataViewMetadataColumn;
}

interface TableCellProps {
    cell: CellData;
}

const formatValue = (value: any, column: powerbi.DataViewMetadataColumn): string => {
    if (value == null) {
        return '';
    }

    if (typeof value === 'number') {
        return formatNumericValue(value, column.format);
    }

    if (value instanceof Date) {
        return value.toLocaleDateString();
    }

    return String(value);
};

const formatNumericValue = (value: number, format?: string): string => {
    if (format?.includes('%')) {
        return `${(value * 100).toFixed(2)}%`;
    }

    return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

export const TableCell: React.FC<TableCellProps> = ({ cell }) => {
    const formattedValue = formatValue(cell.value, cell.column);
    return <td>{formattedValue}</td>;
};
