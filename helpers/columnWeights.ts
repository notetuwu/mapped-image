export const resolveColumnWeights = (
    count: number,
    overrides: Record<number, number> = {},
): number[] => Array.from({ length: count }, (_, i) => overrides[i] ?? 1);

/** Cumulative left edge (in weight units) of each column, plus the total at the end. */
export const columnOffsets = (weights: number[]): number[] => {
    const offsets = [0];
    weights.forEach((weight) => offsets.push(offsets[offsets.length - 1] + weight));
    return offsets;
};
