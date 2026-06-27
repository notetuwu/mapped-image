import { useEffect, useState } from "react";
import { CRS, type LatLngBoundsExpression, type LatLngTuple } from "leaflet";
import { MapContainer, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MappedImage.css";
import type { ICellClickProps, ImageSelectorProps, MappedImageProps } from "./types";
import { Grid } from "./components/Grid";
import { imageBounds } from "./helpers/imageBounds";
import { colNames } from "./helpers/colNames";

const DefaultImageSelector = ({ images, selectedIndex, onSelect }: ImageSelectorProps) => (
    <div
        style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1000,
            display: "flex",
            gap: 8,
        }}
    >
        {images.map((image, index) => (
            <button
                key={image.name}
                type="button"
                onClick={() => onSelect(index)}
                style={{
                    padding: "12px 20px",
                    fontSize: 16,
                    fontWeight: index === selectedIndex ? "bold" : "normal",
                    background: index === selectedIndex ? "#3388ff" : "white",
                    color: index === selectedIndex ? "white" : "black",
                    border: "1px solid #3388ff",
                    borderRadius: 6,
                }}
            >
                {image.name}
            </button>
        ))}
    </div>
);

export const MappedImage = (props: MappedImageProps) => {
    const [imgBounds, setImgBounds] = useState<LatLngTuple | null>(null);
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

    useEffect(() => {
        imageBounds(selectedImage.src, props.width, props.height).then(setImgBounds);
    }, [selectedImage.src, props.width, props.height]);

    const handleSelectImage = (index: number) => {
        setSelectedImageIndex(index);
        props.onSelectedImageIndexChange?.(index);
    };

    const handleCellClick = ({ row, col }: ICellClickProps) => {
        const cellId = `${row},${col}`;
        const next = new Set(selectedCells);
        next.has(cellId) ? next.delete(cellId) : next.add(cellId);

        setSelectedCells(next);
        props.onSelectedCellsChange?.(next);
        props.onCellClick?.({ row, col });
    };

    if (!imgBounds) {
        return null;
    }

    const bounds: LatLngBoundsExpression = [[0, 0], imgBounds];
    const columnLabels = colNames(colOffset, selectedImage.columns);

    const renderSelector = props.renderImageSelector ?? (
        (selectorProps: ImageSelectorProps) => <DefaultImageSelector {...selectorProps} />
    );

    return (
        <div style={{ position: "relative", width: props.width, height: props.height }}>
            <MapContainer
                crs={CRS.Simple}
                bounds={bounds}
                boundsOptions={{ padding: [50, 50] }}
                style={{ width: props.width, height: props.height }}
                maxZoom={2}
            >
                <Grid
                    rows={selectedImage.rows}
                    columnLabels={columnLabels}
                    imgBounds={imgBounds}
                    selectedCells={selectedCells}
                    onCellClick={handleCellClick}
                />
                <ImageOverlay url={selectedImage.src} bounds={bounds} alt={props.alt} />
            </MapContainer>
            {renderSelector({
                images: props.images,
                selectedIndex: selectedImageIndex,
                onSelect: handleSelectImage,
            })}
        </div>
    );
};
