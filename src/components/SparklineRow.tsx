import React, { memo, useMemo } from 'react';
import { SparklineDataPoint } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';
import { TableCell } from './TableCell';
import { SparklineCell } from './SparklineCell';

interface SparklineRowProps {
    rowData: any;
    index: number;
    columnOrder?: number[];
    columnWidths?: number[];
    alternateRowColor: boolean;
    sparklineSettings: Map<string, SparklineColumnSettings>;
    isSelected?: boolean;
    onRowClick?: () => void;
    regularColumnsCount: number;
}

export const SparklineRow = memo<SparklineRowProps>(({
    rowData,
    index,
    columnOrder,
    columnWidths,
    alternateRowColor,
    sparklineSettings,
    isSelected = false,
    onRowClick,
    regularColumnsCount
}) => {
    const backgroundColor = isSelected
        ? '#e3f2fd'
        : alternateRowColor && index % 2 === 1
        ? '#f9f9f9'
        : '#ffffff';

    const totalColumns = rowData.cells.length + rowData.sparklineColumns.length;
    const effectiveOrder = columnOrder && columnOrder.length === totalColumns
        ? columnOrder
        : Array.from({ length: totalColumns }, (_, i) => i);

    const renderCell = (originalIndex: number) => {
        const width = columnWidths?.[originalIndex];

        if (originalIndex < rowData.cells.length) {
            const cell = rowData.cells[originalIndex];
            return (
                <TableCell
                    key={`cell-${originalIndex}`}
                    cell={cell}
                    width={width}
                />
            );
        } else {
            const sparklineIndex = originalIndex - rowData.cells.length;
            const sparklineData = rowData.sparklineColumns[sparklineIndex];

            if (!sparklineData) return null;

            const seriesKey = sparklineData.column?.queryName ||
                             sparklineData.column?.displayName ||
                             `column${sparklineIndex}`;
            const settings = sparklineSettings.get(seriesKey) || {
                chartType: 'line',
                color: '#0078D4',
                lineWidth: 1.5
            };

            return (
                <td
                    key={`sparkline-${originalIndex}`}
                    style={{
                        width: width ? `${width}px` : 'auto',
                        padding: '4px 8px'
                    }}
                >
                    {sparklineData.dataPoints && sparklineData.dataPoints.length > 0 && (
                        <SparklineCell
                            dataPoints={sparklineData.dataPoints}
                            settings={settings}
                        />
                    )}
                </td>
            );
        }
    };

    return (
        <tr
            style={{
                backgroundColor,
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background-color 0.15s ease'
            }}
            onClick={onRowClick}
            onMouseEnter={(e) => {
                if (onRowClick) {
                    (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f0f0';
                }
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = backgroundColor;
            }}
        >
            {effectiveOrder.map(originalIndex => renderCell(originalIndex))}
        </tr>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.index === nextProps.index &&
        prevProps.alternateRowColor === nextProps.alternateRowColor &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.rowData === nextProps.rowData &&
        prevProps.sparklineSettings === nextProps.sparklineSettings &&
        prevProps.columnOrder === nextProps.columnOrder &&
        prevProps.columnWidths === nextProps.columnWidths &&
        prevProps.regularColumnsCount === nextProps.regularColumnsCount
    );
});

SparklineRow.displayName = 'SparklineRow';
