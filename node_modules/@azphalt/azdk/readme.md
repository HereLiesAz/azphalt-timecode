# @azphalt/azdk

The typed surface an azphalt **extension** is written against. It turns the strings in the spec — capabilities, contributions, params, the UI schema — into a typed TypeScript API, so authors get types and autocomplete for the whole contract.

This package is **types plus thin author helpers only**. It has no runtime and reaches nothing on its own: the real [`Host`](../../spec/capability-model.md) is provided by a conforming runtime (see [`@azphalt/runtime-reference`](../runtime-reference) and [`@azphalt/runtime-wasm`](../runtime-wasm)), which injects it and enforces the capability grants. Nothing here can touch a host engine, camera, sensors, the filesystem, or the network — see the never-list in [`spec/capability-model.md`](../../spec/capability-model.md).

## Writing an extension

Author a contribution with one of the `define*` helpers and export it under the name your manifest's `contributes` entry points at. The helper brands the function so a runtime can resolve it by kind.

~~~ts
import { defineFilter } from "@azphalt/azdk";

// manifest: contributes.filters = [{ id: "invert", name: "Invert", entry: "invert" }]
export const invert = defineFilter((ctx) => {
  const bmp = ctx.bitmap.read(ctx.target);      // ctx is capability-gated
  for (let i = 0; i < bmp.data.length; i += 4) {
    bmp.data[i] = 255 - bmp.data[i];
    bmp.data[i + 1] = 255 - bmp.data[i + 1];
    bmp.data[i + 2] = 255 - bmp.data[i + 2];
  }
  ctx.bitmap.write(ctx.target, bmp);
  ctx.canvas.requestRedraw();
});
~~~

`defineFilter`, `defineTool`, and `defineCommand` cover the three contribution kinds. The `ctx` a runtime passes in exposes **only** the sub-APIs whose capability the manifest declared and the host granted — an ungranted capability is *absent*, not an erroring stub.

## What's in the box

- **Manifest & contributions** — `Manifest`, `Kind`, `Runtime`, `Capability`, `AssetType`, `AssetContribution`, `Contributes`, and the `Filter`/`Tool`/`Command` contribution shapes.
- **The host surface** — `Host` and its sub-APIs (`CanvasApi`, `LayersApi`, `BitmapApi`, `SelectionApi`, `ColorApi`, `ParamsApi`, `AssetsApi`), plus `LayerRef`.
- **Pixels** — `Bitmap` (opt-in `depth`: 8-bit `Uint8ClampedArray` by default, 16-bit `Uint16Array`), `RGBA`, `BitDepth`, and the helpers `bitDepth` / `bytesPerChannel` / `maxChannelValue`.
- **UI schema** — `Panel` and the control types (`slider`, `number`, `toggle`, `select`, `color`, `text`, `button`, `group`) hosts render natively (see [`spec/ui-schema.md`](../../spec/ui-schema.md)).
- **Repository API types** — `RepositoryIndex`, `PackageSummary`, `PackageSearchResponse` (see [`spec/repository-api.md`](../../spec/repository-api.md)).
- **Author helpers** — `defineFilter`, `defineTool`, `defineCommand`, and `FORMAT_VERSION`.

## Related

- [`@azphalt/azp`](../azp) — build, verify, and sign the `.azp` your extension ships in.
- [`@azphalt/runtime-reference`](../runtime-reference) / [`@azphalt/runtime-wasm`](../runtime-wasm) — run one against the contract.
- [`examples/invert`](../../examples/invert) — a complete, runnable extension.
