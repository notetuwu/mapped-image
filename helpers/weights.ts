export const resolveWeights = (
    count: number,
    overrides: Record<number, number> = {},
): number[] => Array.from({ length: count }, (_, i) => overrides[i] ?? 1);

/** Cumulative leading edge (in weight units) of each index, plus the total at the end. */
export const weightOffsets = (weights: number[]): number[] => {
    const offsets = [0];
    weights.forEach((weight) => offsets.push(offsets[offsets.length - 1] + weight));
    return offsets;
};

const MIN_WEIGHT = 0.2;

/** Shifts weight from index+1 into index (or back, for a negative delta), clamped so neither drops below MIN_WEIGHT. Total weight is preserved. */
export const applyWeightDelta = (weights: number[], index: number, delta: number): number[] => {
    const a = weights[index];
    const b = weights[index + 1];
    const clampedDelta = Math.max(-(a - MIN_WEIGHT), Math.min(b - MIN_WEIGHT, delta));

    const next = [...weights];
    next[index] = a + clampedDelta;
    next[index + 1] = b - clampedDelta;
    return next;
};
