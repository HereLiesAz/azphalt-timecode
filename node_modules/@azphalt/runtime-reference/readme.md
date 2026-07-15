# @azphalt/runtime-reference

A reference host that loads a `.azp`, verifies it, builds the host-function table from the
*granted* capabilities, and runs a contribution against an in-memory document. It is the
executable form of the contract in [`spec/`](../../spec) — read it alongside
[`docs/ADOPTION.md`](../../docs/ADOPTION.md).

## Honest scope

This runtime proves the **contract**, not the sandbox:

- **Capability gating** — `createHost` builds only the sub-APIs a manifest declared; an ungranted
  capability is **absent** (`undefined`), matching `spec/capability-model.md`'s "absent, not
  merely gated."
- **Image-buffer ABI** — bitmaps are RGBA, straight alpha, mutated in place; 8-bit by default (`Uint8ClampedArray`), 16-bit opt-in via `depth: 16` (`Uint16Array`, channels 0–65535).
- **Contribution dispatch** — `runFilter`/`runTool`/`runCommand` resolve the manifest `entry`
  export and run it with a capability-scoped context.

It runs a **trusted** extension module in-process — callers pass the already-imported extension
module. The WASM isolation substrate that sandboxes *untrusted* code is a separate concern, shipped
as [`@azphalt/runtime-wasm`](../runtime-wasm) (QuickJS-in-WASM for `runtime: js`, raw WebAssembly for
`runtime: wasm`); use that where you need real isolation, and this to read the contract plainly.

~~~ts
import { open, createWorld, runFilter } from "@azphalt/runtime-reference";
import * as ext from "my-extension/main.js"; // the extension's contributions

const { manifest } = open(azpBytes);         // verifies; throws AzpError on failure
const world = createWorld({ width: 64, height: 64, params: { strength: 1 } });
await runFilter(manifest, ext, world);       // host built from manifest.capabilities only
// world.layers[0].bitmap now reflects the edit
~~~
