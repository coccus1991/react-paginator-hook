import {expect} from "chai";
import {act, renderHook} from "@testing-library/react-hooks";
import usePaginator from "./react-paginator-hook";

describe("Testing react-paginator-hook", function () {
    it('Change total items method', function () {
        const {result} = renderHook(usePaginator.bind(null, 200));

        const hookResult = () => result.current as ReturnType<typeof usePaginator>;

        expect(hookResult().totalPages).to.be.eq(20)

        act(() => {
            hookResult().changeTotalItems(500);
        });


        expect(hookResult().totalPages).to.be.eq(50)
    });
})
