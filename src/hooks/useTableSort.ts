import { useState, useMemo } from 'react';
import { TableRowData } from '../visualViewModel';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
    columnIndex: number | null;
    direction: SortDirection;
}

export const useTableSort = (rows: TableRowData[]) => {
    const [sortState, setSortState] = useState<SortState>({
        columnIndex: null,
        direction: null
    });

    const sortedRows = useMemo(() => {
        if (sortState.columnIndex === null || sortState.direction === null) {
            return rows;
        }

        return [...rows].sort((a, b) => {
            const aValue = a.cells[sortState.columnIndex!]?.value;
            const bValue = b.cells[sortState.columnIndex!]?.value;

            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return 1;
            if (bValue == null) return -1;

            let comparison = 0;
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                comparison = aValue - bValue;
            } else if (aValue instanceof Date && bValue instanceof Date) {
                comparison = aValue.getTime() - bValue.getTime();
            } else {
                comparison = String(aValue).localeCompare(String(bValue));
            }

            return sortState.direction === 'asc' ? comparison : -comparison;
        });
    }, [rows, sortState]);

    const handleSort = (columnIndex: number) => {
        setSortState(prev => {
            if (prev.columnIndex === columnIndex) {
                if (prev.direction === 'asc') {
                    return { columnIndex, direction: 'desc' };
                } else if (prev.direction === 'desc') {
                    return { columnIndex: null, direction: null };
                }
            }
            return { columnIndex, direction: 'asc' };
        });
    };

    return { sortedRows, sortState, handleSort };
};
