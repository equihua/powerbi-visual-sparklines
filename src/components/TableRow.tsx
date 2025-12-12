import React from 'react';
import { TableRowData } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';
import { TableCell } from './TableCell';
import { Sparkline } from './Sparkline';

interface TableRowProps {
    rowData: TableRowData;
    index: number;
    alternateRowColor: boolean;
    sparklineSettings: Map<string, SparklineColumnSettings>;
}

export const TableRow: React.FC<TableRowProps> = ({
    rowData,
    index,
    alternateRowColor,
    sparklineSettings
}) => {
    const backgroundColor = alternateRowColor && index % 2 === 1 ? '#f0f0f0' : undefined;

    return (
        <tr style={{ backgroundColor }}>
            {rowData.cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex} cell={cell} />
            ))}
            {rowData.sparklineColumns.map((sparklineData, sparklineIndex) => {
                const seriesKey = sparklineData.column.queryName || 
                                 sparklineData.column.displayName || 
                                 `column${sparklineIndex}`;
                const settings = sparklineSettings.get(seriesKey) || {
                    chartType: 'line',
                    color: '#0078D4',
                    lineWidth: 1.5
                };

                return (
                    <td key={`sparkline-${sparklineIndex}`}>
                        {sparklineData.dataPoints.length > 0 && (
                            <Sparkline
                                dataPoints={sparklineData.dataPoints}
                                settings={settings}
                            />
                        )}
                    </td>
                );
            })}
        </tr>
    );
};
