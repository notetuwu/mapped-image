import { Rectangle, Marker } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { GridProps } from "../types";
import { columnOffsets } from "../helpers/columnWeights";
import { headerIcon } from "../helpers/headerIcon";
import { bindCellAccessibility } from "../helpers/cellAccessibility";

export const Grid = ({
    rows,
    columnLabels,
    columnWeights,
    imgBounds,
    selectedCells,
    onCellClick,
}: GridProps) => {
    const [height, width] = imgBounds;
    const rectHeight = height / rows;

    const offsets = columnOffsets(columnWeights);
    const totalWeight = offsets[offsets.length - 1];
    const pxPerWeightUnit = width / totalWeight;
    const colLeft = (colCount: number) => offsets[colCount] * pxPerWeightUnit;
    const colRight = (colCount: number) => offsets[colCount + 1] * pxPerWeightUnit;

    const cells = Array.from({ length: rows }).map((_, rowCount) =>
        columnLabels.map((columnLabel, colCount) => {
            const bounds: LatLngBoundsExpression = [
                [rectHeight * (rowCount + 1), colRight(colCount)],
                [rectHeight * rowCount, colLeft(colCount)],
            ];

            const rowLabel = rows - rowCount;
            const cellId = `${rowLabel},${columnLabel}`;
            const selected = selectedCells.has(cellId);
            const activate = () => onCellClick?.({ col: columnLabel, row: rowLabel });

            return (
                <Rectangle
                    key={cellId}
                    ref={(instance) =>
                        bindCellAccessibility(instance, `${columnLabel}${rowLabel}`, selected, activate)
                    }
                    bounds={bounds}
                    pathOptions={{
                        fillColor: selected ? "red" : "transparent",
                        fillOpacity: selected ? 0.5 : 0,
                        weight: 1.5
                    }}
                    eventHandlers={{
                        click: activate,
                    }}
                />
            );
        }),
    );

    const columnHeaders = columnLabels.map((columnLabel, colCount) => (
        <Marker
            key={`col-${columnLabel}`}
            position={[height, (colLeft(colCount) + colRight(colCount)) / 2]}
            icon={headerIcon(columnLabel, "grid-header-label--column")}
            interactive={false}
        />
    ));

    const rowHeaders = Array.from({ length: rows }).map((_, rowCount) => {
        const rowLabel = rows - rowCount;
        return (
            <Marker
                key={`row-${rowLabel}`}
                position={[rectHeight * (rowCount + 0.5), -7]}
                icon={headerIcon(String(rowLabel), "grid-header-label--row")}
                interactive={false}
            />
        );
    });

    return [...cells, columnHeaders, rowHeaders];
};
