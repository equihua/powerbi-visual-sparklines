import React from 'react';

interface TableHeaderProps {
    columnNames: string[];
    sparklineColumnNames: string[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ columnNames, sparklineColumnNames }) => {
    return (
        <thead>
            <tr>
                {columnNames.map((columnName, index) => (
                    <th key={index}>{columnName}</th>
                ))}
                {sparklineColumnNames.map((columnName, index) => (
                    <th key={`sparkline-${index}`}>{columnName}</th>
                ))}
            </tr>
        </thead>
    );
};
