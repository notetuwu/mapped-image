# mapped-image

A React component that overlays a clickable row/column grid on top of one or more images, built on [react-leaflet](https://react-leaflet.js.org/). Useful for marking specific regions of a part photographed from multiple angles, where columns continue numbering across angles since they represent the same physical surface.

## Install

```bash
npm install github:lukaskopp390/mapped-image
```

`leaflet` and `react-leaflet` are declared as dependencies and installed automatically. `react` and `react-dom` are peer dependencies, resolved from your app.

> **Note:** this package currently ships untranspiled `.tsx` source (no build step) and is intended to be installed straight from this repository's source. Your app's own bundler is expected to compile it. If you instead need a pre-built `dist` (ESM/CJS + type declarations) for non-TS-aware consumers, that's not set up yet.

## Usage

```tsx
import { MappedImage } from "mapped-image/MappedImage";

<MappedImage
  images={[
    { name: "Front", src: "/front.png", columns: 5, rows: 5 },
    { name: "Side", src: "/side.png", columns: 3, rows: 5 },
  ]}
  alt="Engine block"
  width={800}
  height={800}
  onCellClick={({ row, col }) => console.log(row, col)}
  onSelectedCellsChange={(cells) => console.log(cells)}
/>
```

Clicking a cell toggles its selection (filled red) and reports the cell's row number / column letter. Because columns are numbered continuously across `images` (the "Side" image above picks up at column `F`, since "Front" used `A`-`E`), the same letter+number pair always identifies the same row, regardless of which image happens to be selected — useful since all images represent different angles of the same physical part.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `images` | `ImageConfig[]` | Required. The set of selectable angle images — see below. |
| `alt` | `string` | Alt text for the currently displayed image. |
| `width` / `height` | `number` | Pixel size of the rendered component. The image is scaled to fit without distortion (letterboxed if its aspect ratio doesn't match). |
| `selectedCells` | `Set<string>` | Optional initial selection, as `"<row>,<colLetter>"` ids (e.g. `"3,F"`). Uncontrolled after mount — see `onSelectedCellsChange` to read updates. |
| `selectedImageIndex` | `number` | Optional initial selected image index. |
| `onCellClick` | `({ row, col }) => void` | Fires on every cell click, `row` is a 1-based number from the top, `col` is the letter label. |
| `onSelectedCellsChange` | `(cells: Set<string>) => void` | Fires whenever the selection changes — use this to persist/export the current selection. |
| `onSelectedImageIndexChange` | `(index: number) => void` | Fires whenever the active image changes. |
| `renderImageSelector` | `(props: ImageSelectorProps) => ReactNode` | Optional override for the image-switcher UI rendered over the map. Defaults to a row of buttons; pass your own to fully customize it, or build your own selector entirely outside this component using the controlled `selectedImageIndex`/`onSelectedImageIndexChange` props instead. |

### `ImageConfig`

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Label shown in the default image selector. |
| `src` | `string` | Image URL. |
| `columns` | `number` | Number of columns in this image's grid. |
| `rows` | `number` | Number of rows in this image's grid. |
| `columnWeights` | `Record<number, number>` | Optional relative width overrides, keyed by 0-based column index (default weight is `1`). Only needs entries for the columns that aren't uniform width — e.g. `{ 2: 3 }` makes column index 2 three times as wide as the others. |

## Development

```bash
npm install
npm run dev    # demo app in src/App.tsx
npm test       # unit tests
npm run lint
npm run build  # typecheck + build the demo app
```
