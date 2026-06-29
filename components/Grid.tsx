import { useState } from "react";
import { Rectangle, Marker } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { GridProps } from "../types";
import { applyWeightDelta, toWeightOverrides, weightOffsets } from "../helpers/weights";
import { headerIcon } from "../helpers/headerIcon";
import { bindCellAccessibility } from "../helpers/cellAccessibility";
import { WeightHandle } from "./WeightHandle";

type DragState = { axis: "column" | "row"; index: number; deltaWeight: number };

export const Grid = ({
    rows,
    rowOffset,
    rowWeights,
    columnLabels,
    columnWeights,
    imgBounds,
    selectedCells,
    weightsEditable,
    onColumnWeightsChange,
    onRowWeightsChange,
    onColumnWeightsDrag,
    onRowWeightsDrag,
    onCellClick,
}: GridProps) => {
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [height, width] = imgBounds;

    const displayColumnWeights =
        dragState?.axis === "column"
            ? applyWeightDelta(columnWeights, dragState.index, dragState.deltaWeight)
            : columnWeights;
    const displayRowWeights =
        dragState?.axis === "row"
            ? applyWeightDelta(rowWeights, dragState.index, dragState.deltaWeight)
            : rowWeights;

    const colOffsets = weightOffsets(displayColumnWeights);
    const pxPerColWeightUnit = width / colOffsets[colOffsets.length - 1];
    const colLeft = (colCount: number) => colOffsets[colCount] * pxPerColWeightUnit;
    const colRight = (colCount: number) => colOffsets[colCount + 1] * pxPerColWeightUnit;

    const rowOffsets = weightOffsets(displayRowWeights);
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

    const columnHandles = weightsEditable
        ? columnLabels.slice(0, -1).map((_, index) => (
              <WeightHandle
                  key={`col-handle-${index}`}
                  axis="column"
                  boundary={colRight(index)}
                  length={height}
                  onDrag={(deltaUnits) => {
                      const deltaWeight = deltaUnits / pxPerColWeightUnit;
                      setDragState({ axis: "column", index, deltaWeight });
                      onColumnWeightsDrag?.(toWeightOverrides(applyWeightDelta(columnWeights, index, deltaWeight)));
                  }}
                  onDragEnd={(deltaUnits) => {
                      const deltaWeight = deltaUnits / pxPerColWeightUnit;
                      onColumnWeightsChange?.(toWeightOverrides(applyWeightDelta(columnWeights, index, deltaWeight)));
                      setDragState(null);
                  }}
              />
          ))
        : [];

    const rowHandles = weightsEditable
        ? Array.from({ length: rows - 1 }).map((_, index) => (
              <WeightHandle
                  key={`row-handle-${index}`}
                  axis="row"
                  boundary={rowTop(index)}
                  length={width}
                  onDrag={(deltaUnits) => {
                      const deltaWeight = deltaUnits / pxPerRowWeightUnit;
                      setDragState({ axis: "row", index, deltaWeight });
                      onRowWeightsDrag?.(toWeightOverrides(applyWeightDelta(rowWeights, index, deltaWeight)));
                  }}
                  onDragEnd={(deltaUnits) => {
                      const deltaWeight = deltaUnits / pxPerRowWeightUnit;
                      onRowWeightsChange?.(toWeightOverrides(applyWeightDelta(rowWeights, index, deltaWeight)));
                      setDragState(null);
                  }}
              />
          ))
        : [];

    return [...cells, columnHeaders, rowHeaders, columnHandles, rowHandles];
};
