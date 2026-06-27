import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "./MappedImage.css";
import type { ICellClickProps, ImageSelectorProps, MappedImageProps } from "./types";
import { DefaultImageSelector } from "./components/DefaultImageSelector";
import { ImageLayer } from "./components/ImageLayer";

export const MappedImage = (props: MappedImageProps) => {
    if (props.images.length === 0) {
        throw new Error("MappedImage requires at least one entry in `images`.");
    }

    const [selectedCells, setSelectedCells] = useState<Set<string>>(
        props.selectedCells ?? new Set(),
    );
    const [selectedImageIndex, setSelectedImageIndex] = useState(
        props.selectedImageIndex ?? 0,
    );

    const selectedImage = props.images[selectedImageIndex];
    const colOffset = props.images
        .slice(0, selectedImageIndex)
        .reduce((sum, image) => sum + image.columns, 0);

    const handleSelectImage = (index: number) => {
        setSelectedImageIndex(index);
        props.onSelectedImageIndexChange?.(index);
    };

    const handleCellClick = ({ row, col }: ICellClickProps) => {
        const cellId = `${row},${col}`;
        const next = new Set(selectedCells);
        if (next.has(cellId)) {
            next.delete(cellId);
        } else {
            next.add(cellId);
        }

        setSelectedCells(next);
        props.onSelectedCellsChange?.(next);
        props.onCellClick?.({ row, col });
    };

    const renderSelector = props.renderImageSelector ?? (
        (selectorProps: ImageSelectorProps) => <DefaultImageSelector {...selectorProps} />
    );

    return (
        <div style={{ position: "relative", width: props.width, height: props.height }}>
            <ImageLayer
                key={selectedImage.src}
                image={selectedImage}
                colOffset={colOffset}
                width={props.width}
                height={props.height}
                alt={props.alt}
                selectedCells={selectedCells}
                onCellClick={handleCellClick}
            />
            {renderSelector({
                images: props.images,
                selectedIndex: selectedImageIndex,
                onSelect: handleSelectImage,
            })}
        </div>
    );
};
