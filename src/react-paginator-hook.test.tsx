import {expect} from "chai";
import {act, renderHook} from "@testing-library/react-hooks";
import usePaginator from "./react-paginator-hook";

describe("Testing react-paginator-hook", function () {
    it('Check go pages methods', function () {
        const {result} = renderHook(usePaginator.bind(null, 200, 10, 1));

        const hookResult = () => result.current as ReturnType<typeof usePaginator>;

        expect(hookResult().currentPage).to.be.eq(1)

        act(() => hookResult().goNextPage());

        expect(hookResult().currentPage).to.be.eq(2)

        act(() => hookResult().goNextPage());

        expect(hookResult().currentPage).to.be.eq(3)

        act(() => hookResult().goPreviousPage());

        expect(hookResult().currentPage).to.be.eq(2)

        act(() => hookResult().goLastPage());

        expect(hookResult().currentPage).to.be.eq(20)

        act(() => hookResult().goFirstPage());

        expect(hookResult().currentPage).to.be.eq(1)

        //case not existing page, the page has not to change
        act(() => hookResult().goPage(21));

        expect(hookResult().currentPage).to.be.eq(1)


        act(() => hookResult().goPage(15));

        expect(hookResult().currentPage).to.be.eq(15)
    })

    it('Change total items method', function () {
        const {result} = renderHook(usePaginator.bind(null, 200));

        const hookResult = () => result.current as ReturnType<typeof usePaginator>;

        expect(hookResult().totalPages).to.be.eq(20)

        act(() => hookResult().changeTotalItems(500));

        expect(hookResult().totalPages).to.be.eq(50)
    });

    it('Change items per page method', function () {
        const {result} = renderHook(usePaginator.bind(null, 200, 20));

        const hookResult = () => result.current as ReturnType<typeof usePaginator>;

        expect(hookResult().totalPages).to.be.eq(10)
        expect(hookResult().itemPerPage).to.be.eq(20)

        act(() => hookResult().changeItemPerPage(10));
        act(() => hookResult().goPage(5));

        expect(hookResult().itemPerPage).to.be.eq(10)
        expect(hookResult().totalPages).to.be.eq(20)
        expect(hookResult().currentPage).to.be.eq(5)

        act(() => hookResult().goPage(20));
        act(() => hookResult().changeItemPerPage(20));

        expect(hookResult().totalPages).to.be.eq(10)
        expect(hookResult().currentPage).to.be.eq(10)


        act(() => hookResult().goPage(5));
        act(() => hookResult().changeItemPerPage(10, true));

        expect(hookResult().totalPages).to.be.eq(20)
        expect(hookResult().currentPage).to.be.eq(1)

    });


    it("Get paginator range", function () {
        const {result} = renderHook(usePaginator.bind(null, 200));

        const hookResult = () => result.current as ReturnType<typeof usePaginator>;


        expect(hookResult().paginatorRange(5)).to.be.eql([1, 2, 3, 4, 5]);

        act(() => hookResult().goNextPage());

        expect(hookResult().paginatorRange(5)).to.be.eql([1, 2, 3, 4, 5]);

        act(() => hookResult().goNextPage());

        expect(hookResult().paginatorRange(5)).to.be.eql([1, 2, 3, 4, 5]);

        act(() => hookResult().goNextPage());

        expect(hookResult().paginatorRange(5)).to.be.eql([2, 3, 4, 5, 6]);

        act(() => hookResult().goLastPage());

        expect(hookResult().paginatorRange(5)).to.be.eql([16, 17, 18, 19, 20]);

    })
})
