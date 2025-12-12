import React from 'react';
import powerbi from 'powerbi-visuals-api';

interface TableHeaderProps {
    columns: powerbi.DataViewMetadataColumn[];
    sparklineColumns: powerbi.DataViewMetadataColumn[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columns, sparklineColumns }) => {
    return (
        <thead>
            <tr>
                {columns.map((column, index) => (
                    <th key={index}>{column.displayName}</th>
                ))}
                {sparklineColumns.map((column, index) => (
                    <th key={`sparkline-${index}`}>{column.displayName}</th>
                ))}
            </tr>
        </thead>
    );
};
