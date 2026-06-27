import { useEffect, useState } from "react";
import { CRS, type LatLngBoundsExpression, type LatLngTuple } from "leaflet";
import { MapContainer, ImageOverlay } from "react-leaflet";
import type { ImageLayerProps } from "../types";
import { Grid } from "./Grid";
import { imageBounds } from "../helpers/imageBounds";
import { colNames } from "../helpers/colNames";
import { resolveColumnWeights } from "../helpers/columnWeights";

export const ImageLayer = ({ image, colOffset, width, height, alt, selectedCells, onCellClick }: ImageLayerProps) => {
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

    const bounds: LatLngBoundsExpression = [[0, 0], imgBounds];
    const columnLabels = colNames(colOffset, image.columns);
    const columnWeights = resolveColumnWeights(image.columns, image.columnWeights);

    return (
        <MapContainer
            crs={CRS.Simple}
            bounds={bounds}
            boundsOptions={{ padding: [50, 50] }}
            style={{ width, height }}
            maxZoom={2}
        >
            <Grid
                rows={image.rows}
                columnLabels={columnLabels}
                columnWeights={columnWeights}
                imgBounds={imgBounds}
                selectedCells={selectedCells}
                onCellClick={onCellClick}
            />
            <ImageOverlay url={image.src} bounds={bounds} alt={alt} />
        </MapContainer>
    );
};
