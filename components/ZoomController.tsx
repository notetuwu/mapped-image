import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";

type ZoomControllerProps = {
    zoomMultiplier: number;
};

export const ZoomController = ({ zoomMultiplier }: ZoomControllerProps) => {
    const map = useMap();
    const baseZoomRef = useRef<number | null>(null);

    useEffect(() => {
        // Capture the zoom react-leaflet's fitBounds already settled on, before any multiplier is applied.
        if (baseZoomRef.current === null) {
            baseZoomRef.current = map.getZoom();
        }

        map.setZoom(baseZoomRef.current + Math.log2(zoomMultiplier));
    }, [map, zoomMultiplier]);

    return null;
};
