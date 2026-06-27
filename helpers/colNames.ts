const toColumnLetter = (n: number): string => {
    let result = "";
    let remaining = n;

    while (remaining > 0) {
        const remainder = (remaining - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        remaining = Math.floor((remaining - 1) / 26);
    }

    return result;
};

export const colNames = (startIndex: number, count: number): string[] =>
    Array.from({ length: count }, (_, i) => toColumnLetter(startIndex + i + 1));
