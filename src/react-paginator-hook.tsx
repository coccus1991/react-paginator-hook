import React, {useState, useEffect, useMemo, useCallback} from "react";

const usePaginator = (totalItems = 0, itemPerPage = 10, currentPage = 1) => {
    const [query, setQuery] = useState<{currentPage: number, itemPerPage: number, totalItems: number}>({currentPage: currentPage, itemPerPage: itemPerPage, totalItems: totalItems});
    const [paginatorRange, setPaginatorRange] = useState<number[]>([])
    const calcTotalPages = (totalItems: number, perPage: number) => Math.ceil(totalItems / perPage);

    const totalPages = useMemo(() => calcTotalPages(query.totalItems, query.itemPerPage), [query.totalItems, query.itemPerPage]);

    useEffect(() => {
        let range: number[] = [];

        for (let i = query.currentPage; i < (query.currentPage + 10); i++) {
            range.push(i);
        }

        setPaginatorRange(range)
    }, [query.currentPage])

    const goNextPage: () => void = useCallback(() => setQuery(q => {
        return (q.currentPage >= totalPages) ? q : {...q, currentPage: (q.currentPage + 1)};
    }), [totalPages]);

    const goPreviousPage = useCallback(() => setQuery(q => {
        return (q.currentPage <= 1) ? q : {...q, currentPage: (q.currentPage - 1)};
    }), []);

    const goLastPage: () => void = useCallback(() => setQuery(q => ({...q, currentPage: totalPages})), [totalPages]);

    const goFirstPage: () => void = useCallback(() => setQuery(q => ({...q, currentPage: 1})), []);

    /**
     * Jump to specified page
     */
    const goPage: (page: number) => void = useCallback((page: number) => {
        if (page > 0 && page <= totalPages)
            setQuery(q => ({...q, currentPage: page}))
    }, [totalPages]);



    /**
     * Change item showed per page
     */
    const changeItemPerPage: (perPage: number, startFromFirstPage?: boolean) => void = useCallback((perPage: number, startFromFirstPage = false) => {
        setQuery(q => {
            const newTotalPages = calcTotalPages(q.totalItems, perPage);
            let newQuery = {currentPage: q.currentPage, itemPerPage: perPage};

            if (startFromFirstPage)
                newQuery.currentPage = 1;
            else if (newTotalPages < newQuery.currentPage)
                newQuery.currentPage = newTotalPages;

            return {...q, ...newQuery}
        });
    }, [])

    /**
     * Change total items to paginate
     */
    const changeTotalItems: (totalItems: number) => void = useCallback((totalItems: number) => setQuery(q => ({...q, totalItems})), []);

    return {
        totalPages: totalPages,
        paginatorRange,
        totalItems: query.totalItems,
        currentPage: query.currentPage,
        itemPerPage: query.itemPerPage,
        changeItemPerPage,
        changeTotalItems,
        goPage,
        goLastPage,
        goFirstPage,
        goNextPage,
        goPreviousPage
    };
};


export default usePaginator;