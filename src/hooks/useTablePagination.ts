import { useState, useMemo } from 'react';

export interface PaginationState {
    currentPage: number;
    pageSize: number;
}

export const useTablePagination = <T,>(items: T[], initialPageSize: number = 10) => {
    const [paginationState, setPaginationState] = useState<PaginationState>({
        currentPage: 1,
        pageSize: initialPageSize
    });

    const totalPages = Math.ceil(items.length / paginationState.pageSize);

    const paginatedItems = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.pageSize;
        const endIndex = startIndex + paginationState.pageSize;
        return items.slice(startIndex, endIndex);
    }, [items, paginationState]);

    const goToPage = (page: number) => {
        const validPage = Math.max(1, Math.min(page, totalPages));
        setPaginationState(prev => ({ ...prev, currentPage: validPage }));
    };

    const nextPage = () => {
        goToPage(paginationState.currentPage + 1);
    };

    const prevPage = () => {
        goToPage(paginationState.currentPage - 1);
    };

    const setPageSize = (size: number) => {
        setPaginationState({ currentPage: 1, pageSize: size });
    };

    return {
        paginatedItems,
        currentPage: paginationState.currentPage,
        pageSize: paginationState.pageSize,
        totalPages,
        totalItems: items.length,
        goToPage,
        nextPage,
        prevPage,
        setPageSize
    };
};
