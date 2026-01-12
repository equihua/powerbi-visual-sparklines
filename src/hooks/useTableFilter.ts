import { useState, useMemo } from 'react';
import { TableRowData } from '../visualViewModel';

export interface FilterState {
    searchText: string;
    columnFilters: Map<number, string>;
}

export const useTableFilter = (rows: TableRowData[]) => {
    const [filterState, setFilterState] = useState<FilterState>({
        searchText: '',
        columnFilters: new Map()
    });

    const filteredRows = useMemo(() => {
        let result = rows;

        if (filterState.searchText) {
            const searchLower = filterState.searchText.toLowerCase();
            result = result.filter(row =>
                row.cells.some(cell =>
                    String(cell.value).toLowerCase().includes(searchLower)
                )
            );
        }

        filterState.columnFilters.forEach((filterValue, columnIndex) => {
            if (filterValue) {
                const filterLower = filterValue.toLowerCase();
                result = result.filter(row => {
                    const cellValue = row.cells[columnIndex]?.value;
                    return String(cellValue).toLowerCase().includes(filterLower);
                });
            }
        });

        return result;
    }, [rows, filterState]);

    const setSearchText = (text: string) => {
        setFilterState(prev => ({ ...prev, searchText: text }));
    };

    const setColumnFilter = (columnIndex: number, value: string) => {
        setFilterState(prev => {
            const newFilters = new Map(prev.columnFilters);
            if (value) {
                newFilters.set(columnIndex, value);
            } else {
                newFilters.delete(columnIndex);
            }
            return { ...prev, columnFilters: newFilters };
        });
    };

    const clearFilters = () => {
        setFilterState({ searchText: '', columnFilters: new Map() });
    };

    return {
        filteredRows,
        filterState,
        setSearchText,
        setColumnFilter,
        clearFilters
    };
};
