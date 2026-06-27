import type { LatLngTuple } from "leaflet";

export const imageBounds = (src: string, containerWidth: number, containerHeight: number): Promise<LatLngTuple> =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const scale = Math.min(containerWidth / img.width, containerHeight / img.height);
            resolve([img.height * scale, img.width * scale]);
        };
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });