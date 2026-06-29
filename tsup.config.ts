import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["MappedImage.tsx"],
    format: ["esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    injectStyle: true,
    external: ["react", "react-dom", "leaflet", "react-leaflet"],
});
