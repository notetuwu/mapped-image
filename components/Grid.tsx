import { Rectangle, Marker } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { GridProps } from "../types";
import { weightOffsets } from "../helpers/weights";
import { headerIcon } from "../helpers/headerIcon";
import { bindCellAccessibility } from "../helpers/cellAccessibility";

export const Grid = ({
    rows,
    rowOffset,
    rowWeights,
    columnLabels,
    columnWeights,
    imgBounds,
    selectedCells,
    onCellClick,
}: GridProps) => {
    const [height, width] = imgBounds;

    const colOffsets = weightOffsets(columnWeights);
    const pxPerColWeightUnit = width / colOffsets[colOffsets.length - 1];
    const colLeft = (colCount: number) => colOffsets[colCount] * pxPerColWeightUnit;
    const colRight = (colCount: number) => colOffsets[colCount + 1] * pxPerColWeightUnit;

    const rowOffsets = weightOffsets(rowWeights);
    const pxPerRowWeightUnit = height / rowOffsets[rowOffsets.length - 1];
    const rowBottom = (rowCount: number) => rowOffsets[rowCount] * pxPerRowWeightUnit;
    const rowTop = (rowCount: number) => rowOffsets[rowCount + 1] * pxPerRowWeightUnit;

    const cells = Array.from({ length: rows }).map((_, rowCount) =>
        columnLabels.map((columnLabel, colCount) => {
            const bounds: LatLngBoundsExpression = [
                [rowTop(rowCount), colRight(colCount)],
                [rowBottom(rowCount), colLeft(colCount)],
            ];

            const rowLabel = rowOffset + (rows - rowCount);
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
                        weight: 1.5,
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
        const rowLabel = rowOffset + (rows - rowCount);
        return (
            <Marker
                key={`row-${rowLabel}`}
                position={[(rowBottom(rowCount) + rowTop(rowCount)) / 2, -7]}
                icon={headerIcon(String(rowLabel), "grid-header-label--row")}
                interactive={false}
            />
        );
    });

    return [...cells, columnHeaders, rowHeaders];
};
