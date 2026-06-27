import { divIcon } from "leaflet";

export const headerIcon = (label: string, className: string) =>
    divIcon({
        html: `<span class="grid-header-label ${className}">${label}</span>`,
        className: "grid-header-label-icon",
        iconSize: [0, 0],
    });
