import { useEffect, useRef } from "react";
import { Polyline, useMap } from "react-leaflet";
import type { LatLngExpression, LeafletMouseEvent } from "leaflet";

type WeightHandleProps = {
    axis: "column" | "row";
    /** Position along the cross-axis: lng for a column boundary, lat for a row boundary. */
    boundary: number;
    /** Full span of the line: image height for column boundaries, image width for row boundaries. */
    length: number;
    onDrag: (deltaUnits: number) => void;
    onDragEnd: (deltaUnits: number) => void;
};

export const WeightHandle = ({ axis, boundary, length, onDrag, onDragEnd }: WeightHandleProps) => {
    const map = useMap();
    const dragStartRef = useRef<number | null>(null);
    const lastDeltaRef = useRef(0);
    const activeListenersRef = useRef<{ move: (e: MouseEvent) => void; up: () => void } | null>(null);

    useEffect(() => {
        return () => {
            if (!activeListenersRef.current) {
                return;
            }
            window.removeEventListener("mousemove", activeListenersRef.current.move);
            window.removeEventListener("mouseup", activeListenersRef.current.up);
            map.dragging.enable();
        };
    }, [map]);

    const positions: LatLngExpression[] =
        axis === "column" ? [[0, boundary], [length, boundary]] : [[boundary, 0], [boundary, length]];

    const handleMouseDown = (event: LeafletMouseEvent) => {
        event.originalEvent.preventDefault();
        map.dragging.disable();
        dragStartRef.current = axis === "column" ? event.latlng.lng : event.latlng.lat;
        lastDeltaRef.current = 0;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (dragStartRef.current === null) {
                return;
            }
            const latlng = map.mouseEventToLatLng(moveEvent);
            const current = axis === "column" ? latlng.lng : latlng.lat;
            lastDeltaRef.current = current - dragStartRef.current;
            onDrag(lastDeltaRef.current);
        };

        const handleMouseUp = () => {
            dragStartRef.current = null;
            activeListenersRef.current = null;
            map.dragging.enable();
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            onDragEnd(lastDeltaRef.current);
        };

        activeListenersRef.current = { move: handleMouseMove, up: handleMouseUp };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <Polyline
            positions={positions}
            pathOptions={{
                color: "#3388ff",
                weight: 6,
                opacity: 0.15,
                className: `grid-weight-handle grid-weight-handle--${axis}`,
            }}
            eventHandlers={{ mousedown: handleMouseDown }}
        />
    );
};
