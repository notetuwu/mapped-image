import { describe, expect, it } from "vitest";
import { applyWeightDelta, resolveWeights, weightOffsets } from "./weights";

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

describe("applyWeightDelta", () => {
    it("shifts weight from the next index into the dragged index, preserving the total", () => {
        expect(applyWeightDelta([1, 1, 1], 0, 0.5)).toEqual([1.5, 0.5, 1]);
    });

    it("shifts the other direction for a negative delta", () => {
        expect(applyWeightDelta([1, 1, 1], 0, -0.5)).toEqual([0.5, 1.5, 1]);
    });

    it("clamps so neither side drops below the minimum weight", () => {
        const [a, b] = applyWeightDelta([1, 1], 0, 10);
        expect(a).toBeCloseTo(1.8);
        expect(b).toBeCloseTo(0.2);

        const [c, d] = applyWeightDelta([1, 1], 0, -10);
        expect(c).toBeCloseTo(0.2);
        expect(d).toBeCloseTo(1.8);
    });
});
