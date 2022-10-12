import {expect} from "chai";
import {act, renderHook} from "@testing-library/react-hooks";
import usePaginator from "./react-paginator-hook";
import {useRef} from "react";

const renderHookWithCount = function <T>(hook: () => T) {
    return renderHook<unknown, T & { renderCount: number }>(() => {
        const countRef = useRef(0)
        countRef.current++
        return {renderCount: countRef.current, ...hook()}
    })
}

describe("Testing react-paginator-hook", function () {

    it('Check constructor arguments', function () {
        let hook = renderHook(() => usePaginator({totalItems: 200, itemPerPage: 10, currentPage: 1}));

        let hookResult = () => hook.result.current;

        expect(hookResult().currentPage).to.be.eq(1);
        expect(hookResult().totalItems).to.be.eq(200);
        expect(hookResult().itemPerPage).to.be.eq(10);
    });

    it('Check side effect', function () {
        let props = {totalItems: 100, itemPerPage: 10, currentPage: 1};

        let hook = renderHookWithCount(() => usePaginator(props));

        let hookResult = () => hook.result.current;

        expect(hookResult().currentPage).to.be.eq(1);
        expect(hookResult().renderCount).to.be.eq(1);

        props.currentPage = 2;
        hook.rerender();

        expect(hookResult().renderCount).to.be.eq(3);
        expect(hookResult().currentPage).to.be.eq(2);

        props.totalItems = 200;
        hook.rerender();

        expect(hookResult().renderCount).to.be.eq(5);
        expect(hookResult().currentPage).to.be.eq(2);
        expect(hookResult().totalPages).to.be.eq(20);
        expect(hookResult().totalItems).to.be.eq(200);


        props.currentPage = 2;
        props.totalItems = 2;
        props.itemPerPage = 2;
        hook.rerender();

        expect(hookResult().totalPages).to.be.eq(1);
        expect(hookResult().totalItems).to.be.eq(2);
        expect(hookResult().totalPages).to.be.eq(1);
    });

    it('Check go pages methods', function () {
        const {result} = renderHookWithCount(() => usePaginator({totalItems: 200, itemPerPage: 10, currentPage: 1}));

        const hookResult = () => result.current;

        expect(hookResult().currentPage).to.be.eq(1)
        expect(hookResult().renderCount).to.be.eq(1);

        act(() => hookResult().goNextPage());

        expect(hookResult().renderCount).to.be.eq(2);
        expect(hookResult().currentPage).to.be.eq(2)

        act(() => hookResult().goNextPage());

        expect(hookResult().renderCount).to.be.eq(3);
        expect(hookResult().currentPage).to.be.eq(3)

        act(() => hookResult().goPreviousPage());

        expect(hookResult().renderCount).to.be.eq(4);
        expect(hookResult().currentPage).to.be.eq(2)

        act(() => hookResult().goLastPage());

        expect(hookResult().renderCount).to.be.eq(5);
        expect(hookResult().currentPage).to.be.eq(20)

        act(() => hookResult().goFirstPage());

        expect(hookResult().renderCount).to.be.eq(6);
        expect(hookResult().currentPage).to.be.eq(1)

        //case not existing page, the page has not to change
        act(() => hookResult().goPage(21));

        expect(hookResult().renderCount).to.be.eq(7);
        expect(hookResult().currentPage).to.be.eq(1)


        act(() => hookResult().goPage(15));

        expect(hookResult().renderCount).to.be.eq(8);
        expect(hookResult().currentPage).to.be.eq(15)
    })

    it('Change total items method', function () {
        const {result} = renderHookWithCount(() => usePaginator({totalItems: 200}));

        const hookResult = () => result.current;

        expect(hookResult().renderCount).to.be.eq(1);
        expect(hookResult().totalPages).to.be.eq(20)

        act(() => hookResult().changeTotalItems(500));

        expect(hookResult().renderCount).to.be.eq(2);
        expect(hookResult().totalPages).to.be.eq(50)
    });

    it('Change items per page method', function () {
        const {result} = renderHookWithCount(() => usePaginator({totalItems: 200, itemPerPage: 20}));

        const hookResult = () => result.current;

        expect(hookResult().renderCount).to.be.eq(1);
        expect(hookResult().totalPages).to.be.eq(10)
        expect(hookResult().itemPerPage).to.be.eq(20)

        act(() => hookResult().changeItemPerPage(10));
        act(() => hookResult().goPage(5));

        expect(hookResult().renderCount).to.be.eq(3);
        expect(hookResult().itemPerPage).to.be.eq(10)
        expect(hookResult().totalPages).to.be.eq(20)
        expect(hookResult().currentPage).to.be.eq(5)

        act(() => hookResult().goPage(20));
        act(() => hookResult().changeItemPerPage(20));

        expect(hookResult().renderCount).to.be.eq(5);
        expect(hookResult().totalPages).to.be.eq(10)
        expect(hookResult().currentPage).to.be.eq(10)


        act(() => hookResult().goPage(5));
        act(() => hookResult().changeItemPerPage(10, true));

        expect(hookResult().renderCount).to.be.eq(7);
        expect(hookResult().totalPages).to.be.eq(20)
        expect(hookResult().currentPage).to.be.eq(1)

    });


    it("Get paginator range", function () {
        const {result} = renderHookWithCount(() => usePaginator({totalItems: 200}));

        const hookResult = () => result.current;

        expect(hookResult().renderCount).to.be.eq(1);
        expect(hookResult().paginatorRange(5)).to.be.eql([1, 2, 3, 4, 5]);

        act(() => hookResult().goNextPage());

        expect(hookResult().renderCount).to.be.eq(2);
        expect(hookResult().paginatorRange(5)).to.be.eql([1, 2, 3, 4, 5]);

        act(() => hookResult().goNextPage());

        expect(hookResult().renderCount).to.be.eq(3);
        expect(hookResult().paginatorRange(5)).to.be.eql([1, 2, 3, 4, 5]);

        act(() => hookResult().goNextPage());

        expect(hookResult().renderCount).to.be.eq(4);
        expect(hookResult().paginatorRange(5)).to.be.eql([2, 3, 4, 5, 6]);

        act(() => hookResult().goLastPage());

        expect(hookResult().renderCount).to.be.eq(5);
        expect(hookResult().paginatorRange(5)).to.be.eql([16, 17, 18, 19, 20]);

    })
})
