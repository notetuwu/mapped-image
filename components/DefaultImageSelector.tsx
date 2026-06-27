import type { ImageSelectorProps } from "../types";

export const DefaultImageSelector = ({ images, selectedIndex, onSelect }: ImageSelectorProps) => (
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
