import type { Rectangle as LeafletRectangle } from "leaflet";

// Path.getElement() returns the underlying SVG node but isn't declared in @types/leaflet, hence the cast.
const getPathElement = (instance: LeafletRectangle) =>
    (instance as unknown as { getElement(): SVGElement | undefined }).getElement();

export const bindCellAccessibility = (
    instance: LeafletRectangle | null,
    label: string,
    selected: boolean,
    onActivate: () => void,
) => {
    const el = instance && getPathElement(instance);
    if (!el) {
        return;
    }

    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", label);
    el.setAttribute("aria-pressed", String(selected));
    el.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onActivate();
        }
    };
};
