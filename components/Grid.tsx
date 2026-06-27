import { Rectangle, Marker } from "react-leaflet";
import { divIcon } from "leaflet";
import type { GridProps } from "../types";
import type { LatLngBoundsExpression } from "leaflet";

const headerIcon = (label: string, className: string) =>
    divIcon({
        html: `<span class="grid-header-label ${className}">${label}</span>`,
        className: "grid-header-label-icon",
        iconSize: [0, 0],
    });

export const Grid = ({
    rows,
    columnLabels,
    imgBounds,
    selectedCells,
    onCellClick,
}: GridProps) => {
    const [height, width] = imgBounds;
    const [rectHeight, rectWidth] = [height / rows, width / columnLabels.length];

    const cells = Array.from({ length: rows }).map((_, rowCount) =>
        columnLabels.map((columnLabel, colCount) => {
            const bounds: LatLngBoundsExpression = [
                [rectHeight * (rowCount + 1), rectWidth * (colCount + 1)],
                [rectHeight * rowCount, rectWidth * colCount],
            ];

            const rowLabel = rows - rowCount;
            const cellId = `${rowLabel},${columnLabel}`;

            return (
                <Rectangle
                    key={cellId}
                    bounds={bounds}
                    pathOptions={{
                        fillColor: selectedCells.has(cellId)
                            ? "red"
                            : "transparent",
                        fillOpacity: selectedCells.has(cellId) ? 0.5 : 0,
                    }}
                    eventHandlers={{
                        click: () =>
                            onCellClick?.({ col: columnLabel, row: rowLabel }),
                    }}
                />
            );
        }),
    );

    const columnHeaders = columnLabels.map((columnLabel, colCount) => (
        <Marker
            key={`col-${columnLabel}`}
            position={[height, rectWidth * (colCount + 0.5)]}
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
