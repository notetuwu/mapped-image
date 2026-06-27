import type { LatLngTuple } from "leaflet";
import type { ReactNode } from "react";

export type ImageConfig = {
    name: string;
    src: string;
    columns: number;
    rows: number;
    /** colIndex -> relative width weight, default weight is 1. Only needs entries for non-uniform columns. */
    columnWeights?: Record<number, number>;
    /** rowIndex -> relative height weight, default weight is 1. Only needs entries for non-uniform rows. */
    rowWeights?: Record<number, number>;
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
};

export type ImageLayerProps = {
    image: ImageConfig;
    colOffset: number;
    width: number;
    height: number;
    alt: string;
    selectedCells: Set<string>;
    maxBoundsPadding?: number;
    onCellClick: GridProps["onCellClick"];
};

export type GridProps = {
    rows: number;
    rowWeights: number[];
    columnLabels: string[];
    columnWeights: number[];
    imgBounds: LatLngTuple;
    selectedCells: Set<string>;
    onCellClick?: (props: ICellClickProps) => void;
};

export interface ICellClickProps {
    col: string;
    row: number;
}
