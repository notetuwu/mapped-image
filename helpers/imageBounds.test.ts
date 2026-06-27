import { afterEach, describe, expect, it, vi } from "vitest";
import { imageBounds } from "./imageBounds";

class FakeImage {
    width: number;
    height: number;
    shouldError: boolean;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;

    constructor(width: number, height: number, shouldError: boolean) {
        this.width = width;
        this.height = height;
        this.shouldError = shouldError;
    }

    set src(_value: string) {
        queueMicrotask(() => {
            if (this.shouldError) {
                this.onerror?.();
            } else {
                this.onload?.();
            }
        });
    }
}

const stubImage = (width: number, height: number, shouldError = false) => {
    vi.stubGlobal(
        "Image",
        class {
            constructor() {
                return new FakeImage(width, height, shouldError);
            }
        },
    );
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("imageBounds", () => {
    it("scales by the limiting dimension, preserving aspect ratio (width-constrained)", async () => {
        stubImage(400, 200);
        const bounds = await imageBounds("img.png", 100, 100);
        expect(bounds).toEqual([50, 100]);
    });

    it("scales by the limiting dimension, preserving aspect ratio (height-constrained)", async () => {
        stubImage(200, 400);
        const bounds = await imageBounds("img.png", 100, 100);
        expect(bounds).toEqual([100, 50]);
    });

    it("rejects when the image fails to load", async () => {
        stubImage(0, 0, true);
        await expect(imageBounds("missing.png", 100, 100)).rejects.toThrow(
            "Failed to load image: missing.png",
        );
    });
});
