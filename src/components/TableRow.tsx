import React from 'react';
import { TableRowData, SparklineData } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';
import { TableCell } from './TableCell';
import { Sparkline } from './Sparkline';

interface TableRowProps {
    rowData: TableRowData;
    columnNames: string[];
    sparklineColumnNames: string[];
    index: number;
    alternateRowColor: boolean;
    sparklineSettings: Map<string, SparklineColumnSettings>;
}

export const TableRow: React.FC<TableRowProps> = ({
    rowData,
    columnNames,
    sparklineColumnNames,
    index,
    alternateRowColor,
    sparklineSettings
}) => {
    const backgroundColor = alternateRowColor && index % 2 === 1 ? '#f0f0f0' : undefined;

    return (
        <tr style={{ backgroundColor }}>
            {columnNames.map((columnName, cellIndex) => (
                <TableCell key={cellIndex} value={rowData[columnName]} />
            ))}
            {sparklineColumnNames.map((columnName, sparklineIndex) => {
                const sparklineData = rowData[columnName] as SparklineData;
                const settings = sparklineSettings.get(columnName) || {
                    chartType: 'line',
                    color: '#0078D4',
                    lineWidth: 1.5
                };

                return (
                    <td key={`sparkline-${sparklineIndex}`}>
                        {sparklineData && sparklineData.Values && sparklineData.Values.length > 0 && (
                            <Sparkline
                                sparklineData={sparklineData}
                                settings={settings}
                            />
                        )}
                    </td>
                );
            })}
        </tr>
    );
};
