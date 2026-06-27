import { describe, expect, it } from "vitest";
import { columnOffsets, resolveColumnWeights } from "./columnWeights";

describe("resolveColumnWeights", () => {
    it("defaults every column to weight 1 with no overrides", () => {
        expect(resolveColumnWeights(4)).toEqual([1, 1, 1, 1]);
    });

    it("applies overrides only to the specified column indices", () => {
        expect(resolveColumnWeights(4, { 2: 3 })).toEqual([1, 1, 3, 1]);
    });
});

describe("columnOffsets", () => {
    it("returns cumulative offsets starting at 0, ending at the total weight", () => {
        expect(columnOffsets([1, 1, 3, 1])).toEqual([0, 1, 2, 5, 6]);
    });

    it("returns [0] for an empty weight list", () => {
        expect(columnOffsets([])).toEqual([0]);
    });
});
