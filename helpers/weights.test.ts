import { describe, expect, it } from "vitest";
import { resolveWeights, weightOffsets } from "./weights";

describe("resolveWeights", () => {
    it("defaults every index to weight 1 with no overrides", () => {
        expect(resolveWeights(4)).toEqual([1, 1, 1, 1]);
    });

    it("applies overrides only to the specified indices", () => {
        expect(resolveWeights(4, { 2: 3 })).toEqual([1, 1, 3, 1]);
    });
});

describe("weightOffsets", () => {
    it("returns cumulative offsets starting at 0, ending at the total weight", () => {
        expect(weightOffsets([1, 1, 3, 1])).toEqual([0, 1, 2, 5, 6]);
    });

    it("returns [0] for an empty weight list", () => {
        expect(weightOffsets([])).toEqual([0]);
    });
});
