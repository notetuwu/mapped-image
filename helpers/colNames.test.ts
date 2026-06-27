import { describe, expect, it } from "vitest";
import { colNames } from "./colNames";

describe("colNames", () => {
    it("generates the first 26 letters starting from offset 0", () => {
        expect(colNames(0, 3)).toEqual(["A", "B", "C"]);
    });

    it("wraps into double letters after Z", () => {
        expect(colNames(24, 4)).toEqual(["Y", "Z", "AA", "AB"]);
    });

    it("continues from a non-zero offset, as used for multi-image column continuity", () => {
        expect(colNames(5, 3)).toEqual(["F", "G", "H"]);
    });

    it("returns an empty array for a zero count", () => {
        expect(colNames(0, 0)).toEqual([]);
    });
});
