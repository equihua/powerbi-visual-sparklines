import React from 'react';
import powerbi from 'powerbi-visuals-api';
import { TableViewModel } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

interface SparklineTableProps {
    viewModel: TableViewModel;
    textSize: number;
    alternateRowColor: boolean;
    sparklineSettings: Map<string, SparklineColumnSettings>;
    width: number;
}

export const SparklineTable: React.FC<SparklineTableProps> = ({
    viewModel,
    textSize,
    alternateRowColor,
    sparklineSettings,
    width
}) => {
    return (
        <table 
            className="pbi-custom-table" 
            style={{ fontSize: `${textSize}px`, width: `${width}px` }}
        >
            <TableHeader 
                columns={viewModel.columns}
                sparklineColumns={viewModel.sparklineColumns}
            />
            <tbody>
                {viewModel.rows.map((rowData, index) => (
                    <TableRow
                        key={index}
                        rowData={rowData}
                        index={index}
                        alternateRowColor={alternateRowColor}
                        sparklineSettings={sparklineSettings}
                    />
                ))}
            </tbody>
        </table>
    );
};
