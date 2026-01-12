import React from 'react';
import powerbi from 'powerbi-visuals-api';
import { SortDirection } from '../hooks/useTableSort';

interface SparklineHeaderProps {
    columns: powerbi.DataViewMetadataColumn[];
    sparklineColumns: powerbi.DataViewMetadataColumn[];
    columnWidths: number[];
    columnOrder: number[];
    sortState: { columnIndex: number | null; direction: SortDirection };
    onSort: (columnIndex: number) => void;
    onResizeStart: (columnIndex: number, startX: number) => void;
    onDragStart: (columnIndex: number) => void;
    onDragOver: (columnIndex: number) => void;
    onDragEnd: () => void;
    draggedColumn: number | null;
    dropTargetColumn: number | null;
    enableReorder?: boolean;
}

export const SparklineHeader: React.FC<SparklineHeaderProps> = ({
    columns,
    sparklineColumns,
    columnWidths,
    columnOrder,
    sortState,
    onSort,
    onResizeStart,
    onDragStart,
    onDragOver,
    onDragEnd,
    draggedColumn,
    dropTargetColumn,
    enableReorder = true
}) => {
    const allColumns = [...columns, ...sparklineColumns];
    const totalColumns = allColumns.length;

    const effectiveOrder = columnOrder.length === totalColumns
        ? columnOrder
        : Array.from({ length: totalColumns }, (_, i) => i);

    const orderedColumns = effectiveOrder.map(idx => ({
        column: allColumns[idx],
        originalIndex: idx
    })).filter(item => item.column);

    const renderSortIcon = (columnIndex: number) => {
        if (sortState.columnIndex !== columnIndex) {
            return <span style={{ opacity: 0.3, marginLeft: '4px' }}>⇅</span>;
        }
        return (
            <span style={{ marginLeft: '4px' }}>
                {sortState.direction === 'asc' ? '↑' : '↓'}
            </span>
        );
    };

    const isRegularColumn = (originalIndex: number) => originalIndex < columns.length;

    return (
        <thead>
            <tr>
                {orderedColumns.map(({ column, originalIndex }, visualIndex) => {
                    const isDragging = draggedColumn === originalIndex;
                    const isDropTarget = dropTargetColumn === originalIndex;
                    const width = columnWidths[originalIndex];
                    const isRegular = isRegularColumn(originalIndex);

                    return (
                        <th
                            key={originalIndex}
                            draggable={enableReorder}
                            onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData('text/plain', String(originalIndex));
                                onDragStart(originalIndex);
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                onDragOver(originalIndex);
                            }}
                            onDragEnd={onDragEnd}
                            onDrop={(e) => {
                                e.preventDefault();
                                onDragEnd();
                            }}
                            style={{
                                position: 'relative',
                                width: width ? `${width}px` : 'auto',
                                minWidth: '80px',
                                padding: '8px 16px 8px 12px',
                                textAlign: 'left',
                                fontWeight: 600,
                                borderBottom: '2px solid #e0e0e0',
                                cursor: enableReorder ? 'grab' : (isRegular ? 'pointer' : 'default'),
                                userSelect: 'none',
                                backgroundColor: isDragging
                                    ? '#e3f2fd'
                                    : isDropTarget
                                        ? '#bbdefb'
                                        : '#fafafa',
                                opacity: isDragging ? 0.7 : 1,
                                borderLeft: isDropTarget ? '3px solid #1976d2' : 'none',
                                transition: 'background-color 0.15s ease'
                            }}
                            onClick={() => {
                                if (isRegular && draggedColumn === null) {
                                    onSort(originalIndex);
                                }
                            }}
                            aria-sort={
                                sortState.columnIndex === originalIndex
                                    ? sortState.direction === 'asc'
                                        ? 'ascending'
                                        : 'descending'
                                    : 'none'
                            }
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                pointerEvents: 'none'
                            }}>
                                <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {column.displayName}
                                </span>
                                {isRegular && renderSortIcon(originalIndex)}
                            </div>
                            <div
                                className="resize-handle"
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '6px',
                                    cursor: 'col-resize',
                                    backgroundColor: 'transparent',
                                    zIndex: 10
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onResizeStart(originalIndex, e.clientX);
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = '#0078D4';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                                }}
                                onClick={(e) => e.stopPropagation()}
                                draggable={false}
                            />
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
};