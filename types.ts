import type { LatLngTuple } from "leaflet";
import type { ReactNode } from "react";

export type ImageConfig = {
    name: string;
    src: string;
    columns: number;
    rows: number;
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
};

export type GridProps = {
    rows: number;
    columnLabels: string[];
    imgBounds: LatLngTuple;
    selectedCells: Set<string>;
    onCellClick?: (props: ICellClickProps) => void;
};

export interface ICellClickProps {
    col: string;
    row: number;
}
