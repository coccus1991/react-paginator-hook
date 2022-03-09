import React, {useState, useEffect, useMemo, useCallback} from "react";

interface IUsePaginatorState {
    currentPage: number,
    itemPerPage: number,
    totalItems: number,
    totalPages: number,
    paginatedArray: Array<any> | null
}

const calcTotalPages = (totalItems: number, perPage: number) => Math.ceil(totalItems / perPage) || 1;

const paginateArrayHelper = function <T>(array: T[], page_size: number, page_number: number): T[] {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

const usePaginator = (totalItems = 0, itemPerPage = 10, currentPage = 1) => {
    /**
     * Initial state
     */
    const [paginatorState, setPaginatorState] = useState<IUsePaginatorState>({
        currentPage: currentPage,
        itemPerPage: itemPerPage,
        totalItems: totalItems,
        totalPages: calcTotalPages(totalItems, itemPerPage),
        paginatedArray: null
    });

    const setPaginatedArray: <T>(arr: T[]) => void = useCallback(function <T>(arr: T[]) {
        setPaginatorState(q => {
            return {
                ...q,
                currentPage: 1,
                paginatedArray: arr,
                totalItems: arr.length,
                totalPages: calcTotalPages(arr.length, itemPerPage)
            }
        });
    }, [])

    /**
     * Go to next page
     */
    const goNextPage: () => void = useCallback(() => setPaginatorState(q => {
        return (q.currentPage >= q.totalPages) ? q : {...q, currentPage: (q.currentPage + 1)};
    }), []);

    /**
     * Go to previous page
     */
    const goPreviousPage: () => void = useCallback(() => setPaginatorState(q => {
        return (q.currentPage <= 1) ? q : {...q, currentPage: (q.currentPage - 1)};
    }), []);

    /**
     * Go to last page
     */
    const goLastPage: () => void = useCallback(() => setPaginatorState(q => ({...q, currentPage: q.totalPages})), []);

    /**
     * Jump to first page
     */
    const goFirstPage: () => void = useCallback(() => setPaginatorState(q => ({...q, currentPage: 1})), []);

    /**
     * Jump to specified page
     */
    const goPage: (page: number) => void = useCallback((page: number) => {
        setPaginatorState(q => (page > 0 && page <= q.totalPages) ? ({...q, currentPage: page}) : q)
    }, []);

    /**
     * Change item showed per page
     */
    const changeItemPerPage: (perPage: number, startFromFirstPage?: boolean) => void = useCallback((perPage: number, startFromFirstPage = false) => {
        setPaginatorState(q => {
            if (perPage === q.itemPerPage || perPage > q.totalItems) return q;

            const newTotalPages = calcTotalPages(q.totalItems, perPage);

            let newPaginatorState = {currentPage: q.currentPage, itemPerPage: perPage, totalPages: newTotalPages};

            if (startFromFirstPage) {
                newPaginatorState.currentPage = 1;
            } else if (newTotalPages < newPaginatorState.currentPage)
                newPaginatorState.currentPage = newTotalPages;

            return {...q, ...newPaginatorState}
        });
    }, [])

    /**
     * Change total items to paginate
     */
    const changeTotalItems: (totalItems: number) => void = useCallback((totalItems: number) => setPaginatorState(q => {
        const newTotalPages = calcTotalPages(totalItems, q.itemPerPage);

        return {
            ...q,
            totalPages: newTotalPages,
            currentPage: ((q.currentPage > newTotalPages) ? newTotalPages : q.currentPage),
            totalItems
        }
    }), []);

    const paginatorRange: (span: number) => number[] = useCallback((span: number) => {
        let start = ((paginatorState.currentPage - 2) < 1) ? 1 : (paginatorState.currentPage - 2)

        let middle = [...Array(span)].map<number>((x, i) => (start + i)).filter((x, i) => x <= paginatorState.totalPages);

        if (span > middle.length) {
            const middleLength = middle.length;

            for (let i = 0; i < (span - middleLength); i++) {
                if (middle[0] < 2)
                    break

                middle = [(middle[0] - 1), ...middle];
            }
        }

        return middle;
    }, [paginatorState.currentPage, paginatorState.totalPages]);

    return {
        totalPages: paginatorState.totalPages,
        totalItems: paginatorState.totalItems,
        currentPage: paginatorState.currentPage,
        itemPerPage: paginatorState.itemPerPage,
        paginatedArray: ((Array.isArray(paginatorState.paginatedArray)) ? paginateArrayHelper(paginatorState.paginatedArray, paginatorState.itemPerPage, paginatorState.currentPage) : null),
        setPaginatedArray,
        changeItemPerPage,
        changeTotalItems,
        goPage,
        goLastPage,
        goFirstPage,
        goNextPage,
        goPreviousPage,
        paginatorRange,
    };
};


export default usePaginator;