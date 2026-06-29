import type { LatLngTuple } from "leaflet";
import type { ReactNode } from "react";

/** index -> relative weight. Only needs entries for non-default (non-1) indices. */
export type WeightOverrides = Record<number, number>;

export type ImageConfig = {
    name: string;
    src: string;
    columns: number;
    rows: number;
    /** colIndex -> relative width weight, default weight is 1. Only needs entries for non-uniform columns. */
    columnWeights?: WeightOverrides;
    /** rowIndex -> relative height weight, default weight is 1. Only needs entries for non-uniform rows. */
    rowWeights?: WeightOverrides;
};

export type ImageSelectorProps = {
    images: ImageConfig[];
    selectedIndex: number;
    onSelect: (index: number) => void;
};

export type MappedImageProps = {
    images: ImageConfig[];
    alt: string;
    width: number;
    height: number;
    selectedCells?: Set<string>;
    selectedImageIndex?: number;
    onCellClick?: (props: ICellClickProps) => void;
    onSelectedCellsChange?: (selectedCells: Set<string>) => void;
    onSelectedImageIndexChange?: (index: number) => void;
    renderImageSelector?: (props: ImageSelectorProps) => ReactNode;
    /** Extra pannable margin (in pixels) beyond the image edges. Defaults to 50. */
    maxBoundsPadding?: number;
    /** Scales the default fit-to-container zoom. <1 zooms out, >1 zooms in. Defaults to 1. */
    zoomMultiplier?: number;
    /** When true, draggable handles appear between rows/columns to resize their relative weights via mouse. Defaults to false. */
    weightsEditable?: boolean;
    /** Fires once a column-weight drag is released, in the same shape as `ImageConfig.columnWeights`. */
    onColumnWeightsChange?: (weights: WeightOverrides) => void;
    /** Fires once a row-weight drag is released, in the same shape as `ImageConfig.rowWeights`. */
    onRowWeightsChange?: (weights: WeightOverrides) => void;
    /** Fires continuously while a column-weight handle is being dragged, with the live preview overrides. */
    onColumnWeightsDrag?: (weights: WeightOverrides) => void;
    /** Fires continuously while a row-weight handle is being dragged, with the live preview overrides. */
    onRowWeightsDrag?: (weights: WeightOverrides) => void;
};

export type ImageLayerProps = {
    image: ImageConfig;
    colOffset: number;
    rowOffset: number;
    width: number;
    height: number;
    alt: string;
    selectedCells: Set<string>;
    maxBoundsPadding?: number;
    zoomMultiplier?: number;
    weightsEditable?: boolean;
    onColumnWeightsChange?: (weights: WeightOverrides) => void;
    onRowWeightsChange?: (weights: WeightOverrides) => void;
    onColumnWeightsDrag?: (weights: WeightOverrides) => void;
    onRowWeightsDrag?: (weights: WeightOverrides) => void;
    onCellClick: GridProps["onCellClick"];
};

export type GridProps = {
    rows: number;
    rowOffset: number;
    rowWeights: number[];
    columnLabels: string[];
    columnWeights: number[];
    imgBounds: LatLngTuple;
    selectedCells: Set<string>;
    weightsEditable?: boolean;
    onColumnWeightsChange?: (weights: WeightOverrides) => void;
    onRowWeightsChange?: (weights: WeightOverrides) => void;
    onColumnWeightsDrag?: (weights: WeightOverrides) => void;
    onRowWeightsDrag?: (weights: WeightOverrides) => void;
    onCellClick?: (props: ICellClickProps) => void;
};

export interface ICellClickProps {
    col: string;
    row: number;
}
