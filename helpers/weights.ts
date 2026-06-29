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

/**
 * Shifts weight from index+1 into index (or back, for a negative delta). If the immediate
 * neighbor would drop below MIN_WEIGHT, the remaining shortfall cascades into the next index
 * beyond it (and so on), rather than hard-stopping the drag. Total weight is always preserved.
 */
export const applyWeightDelta = (weights: number[], index: number, delta: number): number[] => {
    const next = [...weights];
    if (delta === 0) {
        return next;
    }

    const growIndex = delta > 0 ? index : index + 1;
    const direction = delta > 0 ? 1 : -1;
    let shrinkIndex = delta > 0 ? index + 1 : index;
    let remaining = Math.abs(delta);
    let absorbed = 0;

    while (remaining > 0 && shrinkIndex >= 0 && shrinkIndex < next.length) {
        const available = Math.max(0, next[shrinkIndex] - MIN_WEIGHT);
        const take = Math.min(available, remaining);
        next[shrinkIndex] -= take;
        remaining -= take;
        absorbed += take;
        shrinkIndex += direction;
    }

    next[growIndex] += absorbed;
    return next;
};

/** Inverse of resolveWeights: collapses a dense weight array into a sparse override map, keyed by index, omitting default (1) entries. */
export const toWeightOverrides = (weights: number[]): Record<number, number> =>
    Object.fromEntries(weights.map((weight, index) => [index, weight]).filter(([, weight]) => weight !== 1));
