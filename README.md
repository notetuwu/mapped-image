# mapped-image

A React component that overlays a clickable row/column grid on top of one or more images, built on [react-leaflet](https://react-leaflet.js.org/). Useful for marking specific regions of a part photographed from multiple angles, where rows and columns continue numbering across angles since they represent the same physical surface.

## Install

```bash
npm install mapped-image
```

`leaflet` and `react-leaflet` are declared as dependencies and installed automatically. `react` and `react-dom` are peer dependencies, resolved from your app.

The package ships compiled ESM + type declarations (built with `tsup`), so it works like any normal npm package — no extra bundler configuration needed.

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

Clicking a cell toggles its selection (filled red) and reports the cell's row number / column letter. Both axes are numbered continuously across `images` — e.g. the "Side" image above picks up at column `F` (since "Front" used `A`-`E`) and would pick up at row `6` if "Front" had 5 rows. The same letter+number pair always identifies the same physical location, regardless of which image happens to be selected — useful since all images represent different angles of the same physical part.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `images` | `ImageConfig[]` | Required. The set of selectable angle images — see below. |
| `alt` | `string` | Alt text for the currently displayed image. |
| `width` / `height` | `number` | Pixel size of the rendered component. The image is scaled to fit without distortion (letterboxed if its aspect ratio doesn't match). |
| `selectedCells` | `Set<string>` | Selection, as `"<row>,<colLetter>"` ids (e.g. `"3,F"`). If provided, the component is **fully controlled**: it's your responsibility to update it (typically in `onSelectedCellsChange`) for clicks to visibly toggle. Omit it to let the component manage selection internally instead. |
| `selectedImageIndex` | `number` | Optional initial selected image index. Uncontrolled after mount. |
| `onCellClick` | `({ row, col }) => void` | Fires on every cell click, `row` is a 1-based number from the top, `col` is the letter label. |
| `onSelectedCellsChange` | `(cells: Set<string>) => void` | Fires whenever a cell is toggled, with the resulting selection. Required if `selectedCells` is controlled — also useful for persisting/exporting the selection (e.g. from an external editor). |
| `onSelectedImageIndexChange` | `(index: number) => void` | Fires whenever the active image changes. |
| `renderImageSelector` | `(props: ImageSelectorProps) => ReactNode` | Optional override for the image-switcher UI rendered over the map. Defaults to a row of buttons; pass your own to fully customize it, or build your own selector entirely outside this component using the controlled `selectedImageIndex`/`onSelectedImageIndexChange` props instead. |
| `maxBoundsPadding` | `number` | Extra pannable margin, in pixels, beyond the image edges. Defaults to `50`. |
| `zoomMultiplier` | `number` | Scales the default fit-to-container zoom. `<1` zooms out, `>1` zooms in. Defaults to `1`. |
| `weightsEditable` | `boolean` | When `true`, draggable handles appear on every internal row/column boundary, letting the user resize relative weights with the mouse. Dragging one boundary past its neighbor's minimum width cascades the remaining resize into the next column/row, and so on. Defaults to `false`. |
| `onColumnWeightsChange` | `(weights: WeightOverrides) => void` | Fires once a column-weight drag is released, in the same shape as `ImageConfig.columnWeights` — ready to spread directly back into your config. |
| `onRowWeightsChange` | `(weights: WeightOverrides) => void` | Same as `onColumnWeightsChange`, for row-weight drags. |
| `onColumnWeightsDrag` | `(weights: WeightOverrides) => void` | Fires continuously while a column-weight handle is being dragged (every `mousemove`), with the live preview. Use `onColumnWeightsChange` instead unless you need to mirror the value while dragging. |
| `onRowWeightsDrag` | `(weights: WeightOverrides) => void` | Same as `onColumnWeightsDrag`, for row-weight drags. |

### `ImageConfig`

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Label shown in the default image selector. |
| `src` | `string` | Image URL. |
| `columns` | `number` | Number of columns in this image's grid. |
| `rows` | `number` | Number of rows in this image's grid. |
| `columnWeights` | `Record<number, number>` | Optional relative width overrides, keyed by 0-based column index (default weight is `1`). Only needs entries for the columns that aren't uniform width — e.g. `{ 2: 3 }` makes column index 2 three times as wide as the others. |
| `rowWeights` | `Record<number, number>` | Same as `columnWeights`, but for row heights. |

> Both `rows`/`columns` must be greater than `0`.
> `columnWeights`/`rowWeights` indices follow the array order used internally (column index `0` = leftmost; row index `0` = the row nearest the *bottom* of the image, not the top, since that's the underlying coordinate system's origin) — keep this in mind if you see row weights affecting the opposite row from what you expected.

## Building an editor

This package intentionally exposes `selectedImageIndex`/`onSelectedImageIndexChange` and a controllable `selectedCells`/`onSelectedCellsChange` so a separate editor app (outside this package) can drive the grid entirely from its own state — e.g. to add/remove rows and columns, persist the resulting `ImageConfig[]` plus selection as a JSON config to reload later, and build its own row/column-count controls. For weight editing specifically, set `weightsEditable` and read the result from `onColumnWeightsChange`/`onRowWeightsChange` to update your own copy of `ImageConfig.columnWeights`/`rowWeights` (drags are previewed locally for responsiveness and only reported once released). There's no other editor UI in this package itself.

## Development

```bash
npm install
npm run dev    # demo app in src/App.tsx
npm test       # unit tests
npm run lint
npm run build  # typecheck + build the demo app
```
