import { describe, expect, it } from "vitest";
import { applyWeightDelta, resolveWeights, toWeightOverrides, weightOffsets } from "./weights";

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

    it("clamps so neither side drops below the minimum weight when there's nowhere to cascade", () => {
        const [a, b] = applyWeightDelta([1, 1], 0, 10);
        expect(a).toBeCloseTo(1.8);
        expect(b).toBeCloseTo(0.2);

        const [c, d] = applyWeightDelta([1, 1], 0, -10);
        expect(c).toBeCloseTo(0.2);
        expect(d).toBeCloseTo(1.8);
    });

    it("cascades the shortfall into further indices once the immediate neighbor hits the minimum", () => {
        const [a, b, c] = applyWeightDelta([1, 1, 1], 0, 1.5);
        expect(a).toBeCloseTo(2.5);
        expect(b).toBeCloseTo(0.2);
        expect(c).toBeCloseTo(0.3);
    });

    it("cascades backwards for a negative delta", () => {
        const [a, b, c] = applyWeightDelta([1, 1, 1], 1, -1.5);
        expect(a).toBeCloseTo(0.3);
        expect(b).toBeCloseTo(0.2);
        expect(c).toBeCloseTo(2.5);
    });

    it("never exceeds the total weight available across the whole array", () => {
        const result = applyWeightDelta([1, 1, 1], 0, 100);
        expect(result.reduce((sum, w) => sum + w, 0)).toBeCloseTo(3);
        expect(result.every((w) => w >= 0.2 - 1e-9)).toBe(true);
    });
});

describe("toWeightOverrides", () => {
    it("omits default-weight (1) entries", () => {
        expect(toWeightOverrides([1, 1, 1])).toEqual({});
    });

    it("includes only the non-default entries, keyed by index", () => {
        expect(toWeightOverrides([1, 3, 1, 0.5])).toEqual({ 1: 3, 3: 0.5 });
    });
});
