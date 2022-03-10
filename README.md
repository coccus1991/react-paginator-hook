## Description
A simple react use which simplify the pagination handling.

## install
`npm i --save react-paginator-hook`

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
### with array
```tsx
import React, {useState, useEffect} from "react";

import usePaginator from "react-paginator-hook";

export interface IPokemonListItem {
    name: string;
    url: string;
}

const pokemon = [
    {
        "name": "bulbasaur",
        "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
        "name": "ivysaur",
        "url": "https://pokeapi.co/api/v2/pokemon/2/"
    },
    {
        "name": "venusaur",
        "url": "https://pokeapi.co/api/v2/pokemon/3/"
    },
    {
        "name": "charmander",
        "url": "https://pokeapi.co/api/v2/pokemon/4/"
    },
    {
        "name": "charmeleon",
        "url": "https://pokeapi.co/api/v2/pokemon/5/"
    },
    {
        "name": "charizard",
        "url": "https://pokeapi.co/api/v2/pokemon/6/"
    },
    {
        "name": "squirtle",
        "url": "https://pokeapi.co/api/v2/pokemon/7/"
    },
    {
        "name": "wartortle",
        "url": "https://pokeapi.co/api/v2/pokemon/8/"
    },
    {
        "name": "blastoise",
        "url": "https://pokeapi.co/api/v2/pokemon/9/"
    },
    {
        "name": "caterpie",
        "url": "https://pokeapi.co/api/v2/pokemon/10/"
    }

]

const App = () => {
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
        goPage,
        setPaginatedArray,
        paginatedArray
    } = usePaginator(0, 2);

    useEffect(() => {
        setPaginatedArray(pokemon)
    }, [])

    const liStyle = {display: "inline-block", marginRight: 10, cursor: "pointer"};

    return (
        <div>
            <p>Page: {currentPage}</p>
            <p>Items Per Page: {itemPerPage}</p>
            <p>Total Pokemon: {totalItems}</p>
            <p>Total Pages: {totalPages}</p>
            <h4>Per Page</h4>
            <p>
                <button onClick={() => changeItemPerPage(2, true)}>2</button>
                <button onClick={() => changeItemPerPage(5, true)}>5</button>
            </p>
            <p>
                <button onClick={goFirstPage}>Go First Page</button>
                <button onClick={goPreviousPage}>Previous Page</button>
                <button onClick={goNextPage}>Next Page</button>
                <button onClick={goLastPage}>Go Last Page</button>
            </p>
            <ul>
                {
                     paginatedArray?.map((item: IPokemonListItem, i: number) => {
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
                <li style={liStyle}
                    onClick={goFirstPage}> First Page
                </li>
                {
                    paginatorRange(5).map((x: number, i: number) =>
                        <li key={i} style={liStyle}
                            onClick={() => goPage(x)}>{x}</li>
                    )
                }
                <li style={liStyle}
                    onClick={goLastPage}> Last Page
                </li>
            </ul>
        </div>
    );
};

export default App;
```