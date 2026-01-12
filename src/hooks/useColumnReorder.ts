import { useState, useCallback, useEffect } from 'react';

export interface UseColumnReorderResult {
    columnOrder: number[];
    draggedColumn: number | null;
    dropTargetColumn: number | null;
    handleDragStart: (columnIndex: number) => void;
    handleDragOver: (columnIndex: number) => void;
    handleDragEnd: () => void;
    resetOrder: () => void;
}

export const useColumnReorder = (columnCount: number): UseColumnReorderResult => {
    const [columnOrder, setColumnOrder] = useState<number[]>(() => 
        Array.from({ length: columnCount }, (_, i) => i)
    );
    const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
    const [dropTargetColumn, setDropTargetColumn] = useState<number | null>(null);

    useEffect(() => {
        if (columnOrder.length !== columnCount) {
            setColumnOrder(Array.from({ length: columnCount }, (_, i) => i));
        }
    }, [columnCount]);

    const handleDragStart = useCallback((columnIndex: number) => {
        setDraggedColumn(columnIndex);
    }, []);

    const handleDragOver = useCallback((columnIndex: number) => {
        if (draggedColumn === null || draggedColumn === columnIndex) return;
        setDropTargetColumn(columnIndex);
    }, [draggedColumn]);

    const handleDragEnd = useCallback(() => {
        if (draggedColumn !== null && dropTargetColumn !== null && draggedColumn !== dropTargetColumn) {
            setColumnOrder(prev => {
                const newOrder = [...prev];
                const draggedIdx = prev.indexOf(draggedColumn);
                const dropIdx = prev.indexOf(dropTargetColumn);

                if (draggedIdx !== -1 && dropIdx !== -1) {
                    newOrder.splice(draggedIdx, 1);
                    newOrder.splice(dropIdx, 0, draggedColumn);
                }

                return newOrder;
            });
        }
        setDraggedColumn(null);
        setDropTargetColumn(null);
    }, [draggedColumn, dropTargetColumn]);

    const resetOrder = useCallback(() => {
        setColumnOrder(Array.from({ length: columnCount }, (_, i) => i));
    }, [columnCount]);

    return {
        columnOrder,
        draggedColumn,
        dropTargetColumn,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        resetOrder
    };
};
