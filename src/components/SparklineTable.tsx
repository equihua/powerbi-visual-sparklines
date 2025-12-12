import React, { useMemo } from 'react';
import powerbi from 'powerbi-visuals-api';
import { TableViewModel } from '../visualViewModel';
import { SparklineColumnSettings } from '../settings';
import { SparklineHeader } from './SparklineHeader';
import { SparklineRow } from './SparklineRow';
import { FiltersBar } from './FiltersBar';
import { Pagination } from './Pagination';
import { useTableSort } from '../hooks/useTableSort';
import { useTableFilter } from '../hooks/useTableFilter';
import { useTablePagination } from '../hooks/useTablePagination';
import { useColumnResize } from '../hooks/useColumnResize';
import { useColumnReorder } from '../hooks/useColumnReorder';

interface SparklineTableProps {
    viewModel: TableViewModel;
    textSize: number;
    alternateRowColor: boolean;
    sparklineSettings: Map<string, SparklineColumnSettings>;
    width: number;
    selectionManager?: powerbi.extensibility.ISelectionManager;
    enableFilters?: boolean;
    enablePagination?: boolean;
    enableSorting?: boolean;
    enableColumnResize?: boolean;
    enableColumnReorder?: boolean;
    initialPageSize?: number;
}

export const SparklineTable: React.FC<SparklineTableProps> = ({
    viewModel,
    textSize,
    alternateRowColor,
    sparklineSettings,
    width,
    selectionManager,
    enableFilters = true,
    enablePagination = true,
    enableSorting = true,
    enableColumnResize = true,
    enableColumnReorder = true,
    initialPageSize = 25
}) => {
    const totalColumns = viewModel.columns.length + viewModel.sparklineColumns.length;

    const { columnWidths, handleResizeStart } = useColumnResize({
        columnCount: totalColumns,
        containerWidth: width,
        minWidth: 80
    });

    const {
        columnOrder,
        draggedColumn,
        dropTargetColumn,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    } = useColumnReorder(totalColumns);
    const { sortedRows, sortState, handleSort } = useTableSort(viewModel.rows);
    const { filteredRows, filterState, setSearchText, clearFilters } = useTableFilter(sortedRows);
    const {
        paginatedItems,
        currentPage,
        pageSize,
        totalPages,
        totalItems,
        goToPage,
        setPageSize
    } = useTablePagination(filteredRows, initialPageSize);

    const [selectedRowIndex, setSelectedRowIndex] = React.useState<number | null>(null);

    const displayRows = enablePagination ? paginatedItems : filteredRows;

    const hasActiveFilters = filterState.searchText.length > 0 || filterState.columnFilters.size > 0;

    const handleRowClick = (rowIndex: number, rowData: any) => {
        setSelectedRowIndex(rowIndex);

        if (selectionManager && rowData.selectionId) {
            selectionManager.select(rowData.selectionId, false);
        }
    };

    return (
        <div style={{ width: `${width}px`, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {enableFilters && (
                <FiltersBar
                    searchText={filterState.searchText}
                    onSearchChange={setSearchText}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />
            )}

            <div style={{ flex: 1, overflow: 'auto' }}>
                <table
                    className="pbi-custom-table"
                    style={{
                        fontSize: `${textSize}px`,
                        width: '100%',
                        borderCollapse: 'collapse',
                        tableLayout: 'fixed'
                    }}
                >
                    <SparklineHeader
                        columns={viewModel.columns}
                        sparklineColumns={viewModel.sparklineColumns}
                        columnWidths={columnWidths}
                        columnOrder={columnOrder}
                        sortState={enableSorting ? sortState : { columnIndex: null, direction: null }}
                        onSort={enableSorting ? handleSort : () => {}}
                        onResizeStart={enableColumnResize ? handleResizeStart : () => {}}
                        onDragStart={enableColumnReorder ? handleDragStart : () => {}}
                        onDragOver={enableColumnReorder ? handleDragOver : () => {}}
                        onDragEnd={enableColumnReorder ? handleDragEnd : () => {}}
                        draggedColumn={draggedColumn}
                        dropTargetColumn={dropTargetColumn}
                        enableReorder={enableColumnReorder}
                    />
                    <tbody>
                        {displayRows.map((rowData, index) => (
                            <SparklineRow
                                key={index}
                                rowData={rowData}
                                index={index}
                                columnOrder={columnOrder}
                                columnWidths={columnWidths}
                                alternateRowColor={alternateRowColor}
                                sparklineSettings={sparklineSettings}
                                isSelected={selectedRowIndex === index}
                                onRowClick={selectionManager ? () => handleRowClick(index, rowData) : undefined}
                                regularColumnsCount={viewModel.columns.length}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {enablePagination && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={goToPage}
                    onPageSizeChange={setPageSize}
                />
            )}
        </div>
    );
};
