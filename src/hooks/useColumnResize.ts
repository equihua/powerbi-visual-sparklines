import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

export interface UseColumnResizeProps {
    columnCount: number;
    containerWidth: number;
    minWidth?: number;
}

export const useColumnResize = ({ columnCount, containerWidth, minWidth = 80 }: UseColumnResizeProps) => {
    const defaultWidth = useMemo(() =>
        Math.max(minWidth, containerWidth / columnCount),
        [columnCount, containerWidth, minWidth]
    );

    const [columnWidths, setColumnWidths] = useState<number[]>(() =>
        Array(columnCount).fill(defaultWidth)
    );

    const resizingRef = useRef<{
        columnIndex: number;
        startX: number;
        startWidth: number;
    } | null>(null);

    useEffect(() => {
        if (columnWidths.length !== columnCount) {
            const newDefaultWidth = Math.max(minWidth, containerWidth / columnCount);
            setColumnWidths(Array(columnCount).fill(newDefaultWidth));
        }
    }, [columnCount, containerWidth, minWidth]);

    const handleResizeStart = useCallback((columnIndex: number, startX: number) => {
        resizingRef.current = {
            columnIndex,
            startX,
            startWidth: columnWidths[columnIndex]
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizingRef.current) return;

            const diff = e.clientX - resizingRef.current.startX;
            const newWidth = Math.max(minWidth, resizingRef.current.startWidth + diff);

            setColumnWidths(prev => {
                const newWidths = [...prev];
                newWidths[resizingRef.current!.columnIndex] = newWidth;
                return newWidths;
            });
        };

        const handleMouseUp = () => {
            resizingRef.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    }, [columnWidths, minWidth]);

    const resetWidths = useCallback(() => {
        const newDefaultWidth = Math.max(minWidth, containerWidth / columnCount);
        setColumnWidths(Array(columnCount).fill(newDefaultWidth));
    }, [columnCount, containerWidth, minWidth]);

    return {
        columnWidths,
        handleResizeStart,
        resetWidths,
        setColumnWidths
    };
};