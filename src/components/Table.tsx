import React from 'react';
import powerbi from 'powerbi-visuals-api';
import { TableViewModel, SparklineData } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

interface TableProps {
    viewModel: TableViewModel;
    textSize: number;
    alternateRowColor: boolean;
    sparklineSettings: Map<string, SparklineColumnSettings>;
    width: number;
}

export const Table: React.FC<TableProps> = ({
    viewModel,
    textSize,
    alternateRowColor,
    sparklineSettings,
    width
}) => {
    if (!viewModel || !viewModel.rows || viewModel.rows.length === 0) {
        return <div>No data available</div>;
    }

    const firstRow = viewModel.rows[0];
    const columnNames: string[] = [];
    const sparklineColumnNames: string[] = [];

    Object.keys(firstRow).forEach(key => {
        const value = firstRow[key];
        if (value && typeof value === 'object' && 'Nombre' in value && 'Axis' in value && 'Values' in value) {
            sparklineColumnNames.push(key);
        } else {
            columnNames.push(key);
        }
    });

    return (
        <table
            className="sparkline-table"
            style={{ fontSize: `${textSize}px`, width: `${width}px` }}
        >
            <TableHeader
                columnNames={columnNames}
                sparklineColumnNames={sparklineColumnNames}
            />
            <tbody>
                {viewModel.rows.map((rowData, index) => (
                    <TableRow
                        key={index}
                        rowData={rowData}
                        columnNames={columnNames}
                        sparklineColumnNames={sparklineColumnNames}
                        index={index}
                        alternateRowColor={alternateRowColor}
                        sparklineSettings={sparklineSettings}
                    />
                ))}
            </tbody>
        </table>
    );
};
