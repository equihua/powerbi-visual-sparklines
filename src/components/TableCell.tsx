import React from 'react';

interface TableCellProps {
    value: any;
}

const formatValue = (value: any): string => {
    if (value == null) {
        return '';
    }

    if (typeof value === 'number') {
        return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    if (value instanceof Date) {
        return value.toLocaleDateString();
    }

    return String(value);
};

export const TableCell: React.FC<TableCellProps> = ({ value }) => {
    const formattedValue = formatValue(value);
    return <td>{formattedValue}</td>;
};
