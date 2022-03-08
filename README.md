## Description
A simple react use which simplify the pagination status.

## Examples
### With http api
```tsx
import React, {useState, useEffect, useMemo, useCallback, useRef} from "react";

import usePaginator from "react-paginator-hook";

export interface IPokemonListItem {
    name: string;
    url: string;
}

export interface IPokemonList {
    next: string;
    previous: any;
    count: number;
    results: Array<IPokemonListItem>;
}


const useFetch = function <T>(defaultValue: T | null) {
    const [requestUrl, setRequestUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<T | null>(defaultValue);

    useEffect(() => {
        if (!isLoading && requestUrl) {
            setIsLoading(true);
            fetch(requestUrl)
                .then(res => res.json())
                .then((res: T) => setData(res))
                .finally(() => setIsLoading(false));
        }
    }, [requestUrl])

    return {data, setRequestUrl, isLoading}
}



const App = () => {
    const {data, setRequestUrl, isLoading} = useFetch<IPokemonList>(null);

    const {
        goNextPage,
        goPreviousPage,
        goLastPage,
        goFirstPage,
        currentPage,
        itemPerPage,
        totalPages,
        totalItems,
        paginatorRange,
        changeItemPerPage,
        changeTotalItems,
        goPage,
    } = usePaginator()

    useEffect(() => {
        changeTotalItems((data?.count || 0))
    }, [data?.count])

    useEffect(() => {
        const baseUrl = `https://pokeapi.co/api/v2/pokemon`;

        setRequestUrl(`${baseUrl}?limit=${itemPerPage}&offset=${((currentPage - 1) * itemPerPage)}`);
    }, [currentPage, itemPerPage])


    return (
        <div>
            <p>Page: {currentPage}</p>
            <p>Items Per Page: {itemPerPage}</p>
            <p>Total Pokemon: {totalItems}</p>
            <p>Total Pages: {totalPages}</p>
            <h4>Per Page</h4>
            <p>
                <button onClick={() => changeItemPerPage(10, true)}>10</button>
                <button onClick={() => changeItemPerPage(20, true)}>20</button>
            </p>
            <p>
                <button disabled={isLoading} onClick={goFirstPage}>Go First Page</button>
                <button disabled={isLoading} onClick={goPreviousPage}>Previous Page</button>
                <button disabled={isLoading} onClick={goNextPage}>Next Page</button>
                <button disabled={isLoading} onClick={goLastPage}>Go Last Page</button>
            </p>
            <ul>
                {
                    isLoading ? <p>Is Loading...</p> : data?.results.map((item: IPokemonListItem, i) => {
                        return (
                            <div key={i}>
                                <li>
                                    <a href={item.url}>{item.name}</a>
                                </li>
                            </div>
                        )
                    })
                }
            </ul>

            <ul>
                <li style={{display: "inline-block", marginRight: 10, cursor: "pointer"}}
                    onClick={() => goPage(1)}> First Page
                </li>
                {paginatorRange.map((x: number, i: number) =>
                    <li key={i} style={{display: "inline-block", marginRight: 10, cursor: "pointer"}}
                        onClick={() => goPage(x)}>{x}</li>
                )}
                <li style={{display: "inline-block", marginRight: 10, cursor: "pointer"}}
                    onClick={() => goPage(totalPages)}> Last Page
                </li>
            </ul>
        </div>
    );
}


export default App;
```
