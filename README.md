# mapped-image

A React component that overlays a clickable row/column grid on top of an image, built on [react-leaflet](https://react-leaflet.js.org/).

## Install

```bash
npm install github:lukaskopp390/mapped-image
```

`leaflet` and `react-leaflet` are declared as dependencies and will be installed automatically. `react` and `react-dom` are peer dependencies, so they're resolved from your app.

## Usage

```tsx
import { MappedImage } from "mapped-image";

<MappedImage
  src="/my-image.png"
  width={800}
  height={600}
  rows={5}
  columns={5}
  alt="my image"
/>
```