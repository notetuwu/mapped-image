import { useEffect, useState } from "react";
import { CRS, type LatLngBoundsExpression, type LatLngTuple } from "leaflet";
import { MapContainer, ImageOverlay } from "react-leaflet";
import type { ImageLayerProps } from "../types";
import { Grid } from "./Grid";
import { ZoomController } from "./ZoomController";
import { imageBounds } from "../helpers/imageBounds";
import { colNames } from "../helpers/colNames";
import { resolveWeights } from "../helpers/weights";

export const ImageLayer = ({
    image,
    colOffset,
    rowOffset,
    width,
    height,
    alt,
    selectedCells,
    maxBoundsPadding = 100,
    zoomMultiplier = 1,
    weightsEditable,
    onColumnWeightsChange,
    onRowWeightsChange,
    onColumnWeightsDrag,
    onRowWeightsDrag,
    onCellClick,
}: ImageLayerProps) => {
    const [imgBounds, setImgBounds] = useState<LatLngTuple | null>(null);
    const [loadError, setLoadError] = useState<Error | null>(null);

    useEffect(() => {
        imageBounds(image.src, width, height).then(setImgBounds).catch(setLoadError);
    }, [image.src, width, height]);

    if (loadError) {
        throw loadError;
    }

    if (!imgBounds) {
        return null;
    }

    const [imgHeight, imgWidth] = imgBounds;
    const bounds: LatLngBoundsExpression = [[0, 0], imgBounds];
    const maxBounds: LatLngBoundsExpression = [
        [-maxBoundsPadding , -maxBoundsPadding],
        [imgHeight + maxBoundsPadding, imgWidth + maxBoundsPadding],
    ];
    const columnLabels = colNames(colOffset, image.columns);
    const columnWeights = resolveWeights(image.columns, image.columnWeights);
    const rowWeights = resolveWeights(image.rows, image.rowWeights);

    return (
        <MapContainer
            crs={CRS.Simple}
            bounds={bounds}
            boundsOptions={{ padding: [50, 50] }}
            maxBounds={maxBounds}
            maxBoundsViscosity={0.5}
            style={{ width, height }}
            minZoom={-2}
            maxZoom={2}
        >
            <ZoomController zoomMultiplier={zoomMultiplier} />
            <Grid
                rows={image.rows}
                rowOffset={rowOffset}
                rowWeights={rowWeights}
                columnLabels={columnLabels}
                columnWeights={columnWeights}
                imgBounds={imgBounds}
                selectedCells={selectedCells}
                weightsEditable={weightsEditable}
                onColumnWeightsChange={onColumnWeightsChange}
                onRowWeightsChange={onRowWeightsChange}
                onColumnWeightsDrag={onColumnWeightsDrag}
                onRowWeightsDrag={onRowWeightsDrag}
                onCellClick={onCellClick}
            />
            <ImageOverlay url={image.src} bounds={bounds} alt={alt} />
        </MapContainer>
    );
};
